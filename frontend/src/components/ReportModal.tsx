import { FormEvent, useEffect, useState } from 'react'
import { Check, Clock, MapPin, ShieldAlert, X } from 'lucide-react'
import { NeighborhoodMap } from './NeighborhoodMap'
import type { Incident, User } from '../types'
import { api } from '../api'

const types = ['Furto de celular', 'Roubo de celular', 'Furto de veículo', 'Roubo de veículo', 'Furto em residência', 'Atividade suspeita', 'Outro']

type Props = { token: string; user: User; onClose: () => void; onCreated: (incident: Incident) => void }

export function ReportModal({ token, user, onClose, onCreated }: Props) {
  const [form, setForm] = useState({ type: '', location_reference: '', neighborhood: user.neighborhood, occurred_at: new Date().toISOString().slice(0, 16) })
  const [point, setPoint] = useState({ lat: user.latitude, lng: user.longitude })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const escape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [onClose])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setError('')
    try {
      const created = await api.createIncident(token, {
        ...form,
        latitude: point.lat,
        longitude: point.lng,
        occurred_at: new Date(form.occurred_at).toISOString(),
      })
      onCreated(created)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível publicar o aviso.')
    } finally { setSaving(false) }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <header><div><span className="eyebrow">Novo aviso</span><h2 id="report-title">O que aconteceu?</h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar"><X /></button></header>
        <form onSubmit={submit}>
          <label>Tipo de ocorrência
            <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="">Selecione uma opção</option>{types.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <div className="two-columns">
            <label><span><MapPin size={15} /> Referência do local</span><input required minLength={3} maxLength={120} value={form.location_reference} onChange={(e) => setForm({ ...form, location_reference: e.target.value })} placeholder="Ex.: próximo à padaria" /></label>
            <label><span><Clock size={15} /> Quando aconteceu</span><input type="datetime-local" required value={form.occurred_at} onChange={(e) => setForm({ ...form, occurred_at: e.target.value })} /></label>
          </div>
          <label>Bairro<input required value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} /></label>
          <div className="pick-map"><NeighborhoodMap incidents={[]} center={[user.latitude, user.longitude]} radiusKm={0} selected={point} onPick={(lat, lng) => setPoint({ lat, lng })} /><span>Clique no mapa para marcar o local aproximado</span></div>
          <div className="ethical-note"><ShieldAlert size={19} /><p><strong>Proteja sua comunidade.</strong> Não informe nomes, características ou fotos de pessoas.</p></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button type="button" className="text-button" onClick={onClose}>Cancelar</button><button className="primary-button" disabled={saving}>{saving ? 'Publicando...' : 'Publicar aviso'} <Check size={18} /></button></div>
        </form>
      </section>
    </div>
  )
}
