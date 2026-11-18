import { env } from "../config/env.js";
import { HttpError } from "../types/http-error.js";

/**
 * Address search / reverse lookup with OpenStreetMap Nominatim (free, no API key).
 * Usage policy: max 1 request per second, identify the app with a User-Agent, cache results.
 * https://operations.osmfoundation.org/policies/nominatim/
 */
const BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "DiNapoliVitrine/1.0 (restaurant website admin)";
const MIN_INTERVAL_MS = 1100;
const CACHE_LIMIT = 300;

interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  postcode?: string;
}

interface NominatimPlace {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  adresse: string; // short, human-friendly ("12 Rue de Marseille, 1000 Tunis")
  label: string; // full label from OSM, for the suggestions list
}

/** Builds a short address that fits the 191-char column */
function shortAddress(place: NominatimPlace): string {
  const a = place.address;
  if (!a) return place.display_name.slice(0, 191);
  const street = [a.house_number, a.road ?? a.pedestrian].filter(Boolean).join(" ");
  const area = a.suburb ?? a.neighbourhood;
  const city = [a.postcode, a.city ?? a.town ?? a.village ?? a.municipality].filter(Boolean).join(" ");
  const parts = [street, area, city || a.state].filter((p): p is string => !!p);
  return (parts.length ? [...new Set(parts)].join(", ") : place.display_name).slice(0, 191);
}

function toResult(place: NominatimPlace): GeocodeResult {
  return {
    latitude: Number(place.lat),
    longitude: Number(place.lon),
    adresse: shortAddress(place),
    label: place.display_name,
  };
}

// --- politeness: one request at a time, ≥ 1.1 s apart, with a small cache ---
const cache = new Map<string, unknown>();
let queue: Promise<unknown> = Promise.resolve();
let lastCall = 0;

function remember(key: string, value: unknown) {
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!);
  cache.set(key, value);
}

async function nominatim<T>(path: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({ format: "jsonv2", addressdetails: "1", "accept-language": "fr", ...params });
  const url = `${BASE}${path}?${query}`;
  if (cache.has(url)) return cache.get(url) as T;

  const run = async () => {
    const wait = lastCall + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCall = Date.now();

    let res: Response;
    try {
      res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(8000) });
    } catch {
      throw new HttpError(502, "Service de cartographie injoignable, réessayez");
    }
    if (!res.ok) throw new HttpError(502, "Service de cartographie indisponible, réessayez");
    const data = (await res.json()) as T;
    remember(url, data);
    return data;
  };

  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}

export const geocodeService = {
  async search(q: string): Promise<GeocodeResult[]> {
    const params: Record<string, string> = { q, limit: "5" };
    if (env.geocodeCountry) params.countrycodes = env.geocodeCountry;
    const places = await nominatim<NominatimPlace[]>("/search", params);
    return places.map(toResult);
  },

  async reverse(lat: number, lng: number): Promise<GeocodeResult | null> {
    const place = await nominatim<NominatimPlace & { error?: string }>("/reverse", {
      lat: lat.toFixed(6),
      lon: lng.toFixed(6),
      zoom: "18",
    });
    if (place.error) return null;
    // keep the exact point the admin clicked, not the snapped OSM object
    return { ...toResult(place), latitude: lat, longitude: lng };
  },
};
