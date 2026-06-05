import { useMemo, useState } from 'react'
import { AuthContext } from './authContext'

const mockUser = {
  id: '1',
  username: 'Piyush',
  email: 'piyush@example.com',
}

const AUTH_USER_KEY = 'galleryOfWondersUser'
const AUTH_TOKEN_KEY = 'galleryOfWondersToken'

function getStoredUser() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(AUTH_USER_KEY)
    return null
  }
}

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => getStoredToken())

  const isAuthenticated = Boolean(user && token)

  function login(userData = mockUser, authToken = 'mock-auth-token') {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData))
    localStorage.setItem(AUTH_TOKEN_KEY, authToken)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout,
      mockUser,
    }),
    [user, token, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
