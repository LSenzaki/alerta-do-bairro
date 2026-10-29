import { useEffect, useState } from 'react'
import { api } from './api'
import { Dashboard } from './components/Dashboard'
import { Login } from './components/Login'
import type { AuthResponse, User } from './types'

const TOKEN_KEY = 'alerta-do-bairro-token'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '')
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(Boolean(token))

  useEffect(() => {
    if (!token) return
    api.me(token).then(setUser).catch(() => {
      localStorage.removeItem(TOKEN_KEY); setToken('')
    }).finally(() => setChecking(false))
  }, [token])

  function loggedIn(auth: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, auth.token)
    setToken(auth.token); setUser(auth.user)
  }
  function logout() { localStorage.removeItem(TOKEN_KEY); setToken(''); setUser(null) }

  if (checking) return <div className="splash"><span className="brand-mark">!</span><p>Abrindo sua comunidade...</p></div>
  if (!token || !user) return <Login onLogin={loggedIn} />
  return <Dashboard initialUser={user} token={token} onLogout={logout} />
}
