import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Bell, ChevronRight, Crosshair, LogOut, MapPin, Navigation, Plus, Radio, Search, Settings, ShieldCheck, SlidersHorizontal, Volume2, X } from 'lucide-react'
import { api } from '../api'
import type { Incident, User } from '../types'
import { NeighborhoodMap } from './NeighborhoodMap'
import { ReportModal } from './ReportModal'

type Props = { initialUser: User; token: string; onLogout: () => void }

function timeAgo(value: string) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000)
  if (minutes < 60) return `há ${Math.max(1, minutes)} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  return `há ${Math.floor(hours / 24)}d`
}

function shortType(type: string) { return type.replace(' de celular', '').replace(' de veículo', '') }

export function Dashboard({ initialUser, token, onLogout }: Props) {
  const [user, setUser] = useState(initialUser)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [alerts, setAlerts] = useState<Incident[]>([])
  const [reportOpen, setReportOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [radius, setRadius] = useState(user.alert_radius_km)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeAlert, setActiveAlert] = useState<Incident | null>(null)
  const [mapFocus, setMapFocus] = useState<{ incident: Incident; requestId: number } | null>(null)
  const seenAlertIds = useRef<Set<string> | null>(null)
  const audioContext = useRef<AudioContext | null>(null)
  const focusRequestId = useRef(0)

  const playAlertSound = useCallback(() => {
    const AudioContextClass = window.AudioContext
    const context = audioContext.current ?? new AudioContextClass()
    audioContext.current = context
    void context.resume().then(() => {
      const now = context.currentTime
      ;[0, 0.2].forEach((delay, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(index === 0 ? 740 : 880, now + delay)
        gain.gain.setValueAtTime(0.0001, now + delay)
        gain.gain.exponentialRampToValueAtTime(0.18, now + delay + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.16)
        oscillator.connect(gain).connect(context.destination)
        oscillator.start(now + delay)
        oscillator.stop(now + delay + 0.18)
      })
    }).catch(() => undefined)
  }, [])

  const load = useCallback(async () => {
    try {
      const [all, nearby] = await Promise.all([api.incidents(token), api.alerts(token)])
      setIncidents(all); setAlerts(nearby); seenAlertIds.current = new Set(nearby.map((item) => item.id))
    } finally { setLoading(false) }
  }, [token])
  useEffect(() => { load() }, [load])

  useEffect(() => {
    const unlockSound = () => {
      const context = audioContext.current ?? new window.AudioContext()
      audioContext.current = context
      void context.resume()
    }
    document.addEventListener('pointerdown', unlockSound, { once: true })
    return () => document.removeEventListener('pointerdown', unlockSound)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(async () => {
      try {
        const nearby = await api.alerts(token)
        const known = seenAlertIds.current
        const newAlert = known ? nearby.find((item) => !known.has(item.id)) : undefined
        setAlerts(nearby)
        seenAlertIds.current = new Set(nearby.map((item) => item.id))
        if (newAlert) {
          setActiveAlert(newAlert)
          playAlertSound()
        }
      } catch {
        // A próxima atualização tenta novamente sem interromper o uso do mapa.
      }
    }, 10_000)
    return () => window.clearInterval(interval)
  }, [playAlertSound, token])

  const filteredAlerts = useMemo(() => alerts.filter((item) => `${item.type} ${item.location_reference} ${item.neighborhood}`.toLowerCase().includes(search.toLowerCase())), [alerts, search])

  function focusOnMap(incident: Incident) {
    focusRequestId.current += 1
    setMapFocus({ incident, requestId: focusRequestId.current })
    setActiveAlert(null)
  }

  async function saveRadius() {
    await api.updateAlertSettings(token, { radius_km: radius, latitude: user.latitude, longitude: user.longitude })
    setUser({ ...user, alert_radius_km: radius })
    setSettingsOpen(false)
    setToast(`Alertas configurados para um raio de ${radius} km`)
    setTimeout(() => setToast(''), 3500)
    const nearby = await api.alerts(token); setAlerts(nearby); seenAlertIds.current = new Set(nearby.map((item) => item.id))
  }

  function created(incident: Incident) {
    setIncidents([incident, ...incidents]); setReportOpen(false); setToast('Aviso publicado para a comunidade')
    setTimeout(() => setToast(''), 3500); load()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Radio size={20} /></span><span>Alerta do Bairro</span></div>
        <div className="topbar-location"><MapPin size={16} /><span>{user.neighborhood}</span></div>
        <nav aria-label="Ações da conta">
          <button className="topbar-icon" aria-label="Abrir alerta mais recente" onClick={() => alerts[0] && setActiveAlert(alerts[0])}><Bell size={20} /><span className="notification-dot">{alerts.length}</span></button>
          <button className="avatar" title={user.name}>{user.name.slice(0, 1).toUpperCase()}</button>
          <button className="topbar-icon" onClick={onLogout} aria-label="Sair"><LogOut size={19} /></button>
        </nav>
      </header>

      <main className="dashboard">
        <aside className="activity-panel">
          <div className="panel-heading"><div><span className="eyebrow">Últimas 24 horas</span><h1>Ao seu redor</h1></div><button className="filter-button" aria-label="Filtros"><SlidersHorizontal size={18} /></button></div>
          <div className="search-box"><Search size={17} /><input aria-label="Buscar ocorrências" placeholder="Buscar por local ou tipo" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="community-summary"><span className="pulse"><span /></span><p><strong>{alerts.length} alertas</strong> no seu raio de {user.alert_radius_km} km</p><button onClick={() => setSettingsOpen(true)}>Ajustar</button></div>
          <div className="incident-list">
            {loading && <p className="empty-state">Carregando avisos...</p>}
            {!loading && filteredAlerts.length === 0 && <p className="empty-state">Nenhum alerta dentro do seu raio.</p>}
            {filteredAlerts.map((incident) => (
              <button className="incident-card" key={incident.id} onClick={() => focusOnMap(incident)} aria-label={`Ver ${incident.type} no mapa`}>
                <span className={`incident-symbol type-${incident.type.toLowerCase().includes('roubo') ? 'danger' : incident.type.toLowerCase().includes('suspeita') ? 'green' : 'amber'}`}><MapPin size={18} /></span>
                <div><div className="incident-meta"><span className="incident-type">{shortType(incident.type)}</span><time>{timeAgo(incident.occurred_at)}</time></div><h3>{incident.location_reference}</h3><p>{incident.neighborhood} {incident.distance_km != null && <>· {incident.distance_km.toFixed(1)} km</>}</p></div>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
          <div className="bias-note"><ShieldCheck size={16} /><span>Poucos registros não significa área segura.</span></div>
        </aside>

        <section className="map-panel" aria-label="Mapa de ocorrências">
          <NeighborhoodMap incidents={incidents} center={[user.latitude, user.longitude]} radiusKm={user.alert_radius_km} focusedIncident={mapFocus?.incident} focusRequestId={mapFocus?.requestId} />
          <div className="map-overlay map-legend"><span><i className="legend-dot danger" /> Roubo</span><span><i className="legend-dot amber" /> Furto</span><span><i className="legend-dot green" /> Atividade</span></div>
          <button className="locate-control" aria-label="Centralizar mapa"><Crosshair size={20} /></button>
          <button className="report-button" onClick={() => setReportOpen(true)}><Plus size={20} /> Avisar a comunidade</button>
        </section>
      </main>

      {reportOpen && <ReportModal token={token} user={user} onClose={() => setReportOpen(false)} onCreated={created} />}
      {activeAlert && <div className="alert-popup-backdrop" role="presentation"><section className="alert-popup" role="alertdialog" aria-modal="true" aria-labelledby="nearby-alert-title"><button className="icon-button alert-popup-close" onClick={() => setActiveAlert(null)} aria-label="Fechar alerta"><X /></button><span className="alert-siren"><Volume2 size={27} /></span><span className="eyebrow">Alerta próximo</span><h2 id="nearby-alert-title">{activeAlert.type}</h2><p className="alert-location"><MapPin size={18} /> {activeAlert.location_reference}</p><p>A ocorrência foi registrada a <strong>{activeAlert.distance_km?.toFixed(1)} km</strong> da sua localização.</p><button className="primary-button" onClick={() => focusOnMap(activeAlert)}><Navigation size={18} /> Ver no mapa</button><button className="text-button" onClick={() => setActiveAlert(null)}>Dispensar</button></section></div>}
      {settingsOpen && <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSettingsOpen(false)}><aside className="settings-drawer"><header><div><span className="eyebrow">Preferências</span><h2>Distância dos alertas</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="Fechar"><X /></button></header><p>Mostraremos avisos que acontecerem dentro desta distância da sua localização.</p><div className="radius-display"><span>{radius}</span> km</div><input className="range" aria-label="Raio dos alertas" type="range" min="0.5" max="10" step="0.5" value={radius} onChange={(e) => setRadius(Number(e.target.value))} /><div className="range-labels"><span>0,5 km</span><span>10 km</span></div><div className="settings-map"><NeighborhoodMap incidents={[]} center={[user.latitude, user.longitude]} radiusKm={radius} /></div><button className="primary-button" onClick={saveRadius}><Settings size={18} /> Salvar preferência</button></aside></div>}
      {toast && <div className="toast" role="status"><ShieldCheck size={18} /> {toast}</div>}
    </div>
  )
}
