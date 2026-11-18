import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  // One or more front-end origins, comma-separated (e.g. "https://dinapoli.vercel.app,http://localhost:5173")
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: "8h",
  // Limit address search to a country (ISO codes, comma-separated). Empty = worldwide.
  geocodeCountry: process.env.GEOCODE_COUNTRY ?? "tn",
} as const;
