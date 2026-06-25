import { createContext, useContext, useState, useEffect } from 'react'
import { getUsers, saveUsers, getSession, saveSession, clearSession } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session?.userId) {
      const found = getUsers().find(u => u.id === session.userId)
      if (found) setUser(found)
    }
    setReady(true)
  }, [])

  const register = (name, email, password) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('Bu e-posta zaten kullanımda.')
    }
    if (password.length < 6) throw new Error('Şifre en az 6 karakter olmalıdır.')
    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      coins: 1000,
      createdAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    saveSession({ userId: newUser.id })
    setUser(newUser)
    return newUser
  }

  const login = (email, password) => {
    const found = getUsers().find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )
    if (!found) throw new Error('E-posta veya şifre hatalı.')
    saveSession({ userId: found.id })
    setUser(found)
    return found
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  // delta can be negative (buy) or positive (sell)
  const updateCoins = (delta) => {
    const users = getUsers()
    const updated = users.map(u =>
      u.id === user.id ? { ...u, coins: u.coins + delta } : u
    )
    saveUsers(updated)
    const next = updated.find(u => u.id === user.id)
    setUser(next)
    return next
  }

  return (
    <AuthContext.Provider value={{ user, ready, register, login, logout, updateCoins }}>
      {!ready ? null : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
