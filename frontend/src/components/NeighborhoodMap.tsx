import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { Incident } from '../types'

const colors: Record<string, string> = {
  'Furto de celular': '#d97706',
  'Roubo de celular': '#c2413b',
  'Furto de veículo': '#7358a6',
  'Roubo de veículo': '#8f322e',
  'Furto em residência': '#256b59',
  'Atividade suspeita': '#256b59',
  Outro: '#53615b',
}

function markerIcon(type: string) {
  const color = colors[type] ?? colors.Outro
  return L.divIcon({
    className: 'incident-marker-wrap',
    html: `<span class="incident-marker" style="--marker:${color}"><span></span></span>`,
    iconSize: [34, 42], iconAnchor: [17, 40], popupAnchor: [0, -36],
  })
}

function MapClick({ onPick }: { onPick?: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (event) => onPick?.(event.latlng.lat, event.latlng.lng) })
  return null
}

function MapFocus({ incident, requestId }: { incident?: Incident | null; requestId: number }) {
  const map = useMap()
  useEffect(() => {
    if (incident) map.flyTo([incident.latitude, incident.longitude], 17, { duration: 0.8 })
  }, [incident, map, requestId])
  return null
}

function IncidentMarker({ incident, focused, requestId }: { incident: Incident; focused: boolean; requestId: number }) {
  const markerRef = useRef<L.Marker | null>(null)
  useEffect(() => {
    if (focused) markerRef.current?.openPopup()
  }, [focused, requestId])

  return (
    <Marker ref={markerRef} position={[incident.latitude, incident.longitude]} icon={markerIcon(incident.type)}>
      <Popup>
        <strong>{incident.type}</strong><br />
        {incident.location_reference}<br />
        <small>{incident.distance_km != null ? `${incident.distance_km.toFixed(1)} km de você` : incident.neighborhood}</small>
      </Popup>
    </Marker>
  )
}

type Props = {
  incidents: Incident[]
  center: [number, number]
  radiusKm: number
  selected?: { lat: number; lng: number } | null
  onPick?: (lat: number, lng: number) => void
  focusedIncident?: Incident | null
  focusRequestId?: number
}

export function NeighborhoodMap({ incidents, center, radiusKm, selected, onPick, focusedIncident, focusRequestId = 0 }: Props) {
  return (
    <MapContainer center={center} zoom={15} scrollWheelZoom className="map" key={`${center[0]}-${center[1]}`}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Circle center={center} radius={radiusKm * 1000} pathOptions={{ color: '#28715d', fillColor: '#4f9b82', fillOpacity: 0.08, weight: 1.5 }} />
      <MapFocus incident={focusedIncident} requestId={focusRequestId} />
      {incidents.map((incident) => <IncidentMarker key={incident.id} incident={incident} focused={focusedIncident?.id === incident.id} requestId={focusRequestId} />)}
      {selected && <Marker position={[selected.lat, selected.lng]} />}
      <MapClick onPick={onPick} />
    </MapContainer>
  )
}
