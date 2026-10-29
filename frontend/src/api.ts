import type { AuthResponse, Incident, User } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: 'Não foi possível concluir a ação.' }))
    const detail = Array.isArray(body.detail) ? body.detail[0]?.msg : body.detail
    throw new Error(detail || 'Não foi possível concluir a ação.')
  }
  return response.json()
}

export const api = {
  login: (payload: Record<string, unknown>) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: (token: string) => request<User>('/api/auth/me', {}, token),
  incidents: (token: string) => request<Incident[]>('/api/incidents', {}, token),
  createIncident: (token: string, payload: Record<string, unknown>) =>
    request<Incident>('/api/incidents', { method: 'POST', body: JSON.stringify(payload) }, token),
  alerts: (token: string) => request<Incident[]>('/api/alerts', {}, token),
  updateAlertSettings: (token: string, payload: Record<string, unknown>) =>
    request<{ radius_km: number; latitude: number; longitude: number; neighborhood: string }>(
      '/api/alerts/settings',
      { method: 'PUT', body: JSON.stringify(payload) },
      token,
    ),
}
