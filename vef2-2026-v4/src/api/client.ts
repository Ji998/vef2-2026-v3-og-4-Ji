export class ApiError extends Error {
    status: number
    body: unknown
  
    constructor(status: number, message: string, body: unknown) {
      super(message)
      this.status = status
      this.body = body
    }
  }
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string
  
  if (!BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not set')
  }
  
  function hasErrorField(x: unknown): x is { error: unknown } {
    return typeof x === 'object' && x !== null && 'error' in x
  }
  
  export async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })
  
    const contentType = res.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')
    const body: unknown = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => '')
  
    if (!res.ok) {
      const msg = hasErrorField(body) ? String(body.error) : `Request failed: ${res.status}`
      throw new ApiError(res.status, msg, body)
    }
  
    return body as T
  }