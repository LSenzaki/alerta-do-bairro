export type User = {
  id: string
  name: string
  email: string
  neighborhood: string
  latitude: number
  longitude: number
  alert_radius_km: number
}

export type Incident = {
  id: string
  type: string
  location_reference: string
  neighborhood: string
  latitude: number
  longitude: number
  occurred_at: string
  created_at: string
  distance_km: number | null
}

export type AuthResponse = {
  token: string
  user: User
  account_created: boolean
}
