const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'dinapoli_admin_token'

// Uploaded photos are served by the backend at /uploads/…; if the API lives on another domain, point there.
const MEDIA_ORIGIN = /^https?:\/\//.test(BASE_URL) ? new URL(BASE_URL).origin : ''
export const mediaUrl = (path: string) => `${MEDIA_ORIGIN}${path}`

export const UNAUTHORIZED_EVENT = 'dinapoli:unauthorized'

export class ApiError extends Error {
  status: number
  details: { field: string; message: string }[]

  constructor(status: number, message: string, details: { field: string; message: string }[] = []) {
    super(message)
    this.status = status
    this.details = details
  }
}

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
    } catch {
      /* storage unavailable: session will just not persist */
    }
  },
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export async function request<T>(path: string, { method = 'GET', body, auth = false }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  const isForm = body instanceof FormData // the browser sets the multipart boundary itself
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = tokenStore.get()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifiez votre connexion.')
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    if (res.status === 401 && auth) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    throw new ApiError(res.status, data?.error ?? 'Une erreur est survenue', data?.details)
  }
  return data as T
}
