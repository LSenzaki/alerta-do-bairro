import { FormEvent, useState } from 'react'
import { ArrowRight, LocateFixed, MapPin, Radio, ShieldCheck } from 'lucide-react'
import { api } from '../api'
import type { AuthResponse } from '../types'

type Props = { onLogin: (auth: AuthResponse) => void }

const defaultPosition = { latitude: -25.4296, longitude: -49.2719 }

export function Login({ onLogin }: Props) {
  const [form, setForm] = useState({ name: '', email: '', password: '', neighborhood: 'Centro' })
  const [position, setPosition] = useState(defaultPosition)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function locate() {
    setLocating(true)
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setPosition({ latitude: coords.latitude, longitude: coords.longitude })
        setLocating(false)
      },
      () => {
        setError('Não conseguimos acessar sua localização. Você pode continuar com a localização de demonstração.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const auth = await api.login({ ...form, ...position })
      onLogin(auth)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-story" aria-label="Sobre o Alerta do Bairro">
        <div className="brand brand--light"><span className="brand-mark"><Radio size={21} /></span> Alerta do Bairro</div>
        <div className="story-copy">
          <span className="eyebrow eyebrow--light">Sua rua. Sua comunidade.</span>
          <h1>Informação perto de você,<br /><em>quando importa.</em></h1>
          <p>Registre ocorrências, acompanhe o que acontece ao redor e receba alertas da sua região.</p>
          <div className="trust-row"><ShieldCheck size={18} /> Sem exposição de vítimas ou suspeitos</div>
        </div>
        <div className="street-grid" aria-hidden="true"><span /><span /><span /><span /></div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand brand"><span className="brand-mark"><Radio size={20} /></span> Alerta do Bairro</div>
          <span className="eyebrow">Bem-vindo</span>
          <h2>Entre na sua comunidade</h2>
          <p className="muted">No primeiro acesso, sua conta será criada automaticamente.</p>
          <form onSubmit={submit}>
            <label>Seu nome
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Como podemos chamar você?" required minLength={2} />
            </label>
            <label>E-mail
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@email.com" required />
            </label>
            <label>Senha
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo de 6 caracteres" required minLength={6} />
            </label>
            <label>Seu bairro
              <div className="input-icon"><MapPin size={18} /><input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} required /></div>
            </label>
            <button className="location-button" type="button" onClick={locate}><LocateFixed size={17} /> {locating ? 'Localizando...' : 'Usar minha localização'}</button>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button" disabled={submitting}>{submitting ? 'Entrando...' : 'Entrar e ver o mapa'} <ArrowRight size={18} /></button>
          </form>
          <p className="privacy-note"><ShieldCheck size={15} /> Seus dados são usados somente para personalizar alertas próximos.</p>
        </div>
      </section>
    </main>
  )
}
