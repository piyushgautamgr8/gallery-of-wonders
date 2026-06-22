import { useEffect, useState } from 'react'
import { AUTH_TOKEN_KEY } from '../services/api'
import { getProfile, loginUser, registerUser, updateProfile as saveProfile } from '../services/authService'
import { AuthContext } from './authContext'

const AUTH_USER_KEY = 'galleryOfWondersUser'

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
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(getStoredToken()))

  const isAuthenticated = Boolean(token)

  function storeAuth(userData, authToken) {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData))
    localStorage.setItem(AUTH_TOKEN_KEY, authToken)
  }

  useEffect(() => {
    if (!token) {
      return undefined
    }

    let isCurrent = true

    getProfile()
      .then((profileUser) => {
        if (!isCurrent) {
          return
        }

        setUser(profileUser)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profileUser))
      })
      .catch(() => {
        if (!isCurrent) {
          return
        }

        logout()
      })
      .finally(() => {
        if (isCurrent) {
          setIsAuthLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [token])

  async function login(credentials) {
    const data = await loginUser(credentials)
    storeAuth(data.user, data.token)
    return data
  }

  async function register(userData) {
    const data = await registerUser(userData)
    storeAuth(data.user, data.token)
    return data
  }

  async function updateProfile(profileData) {
    const updatedUser = await saveProfile(profileData)
    setUser(updatedUser)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser))
    return updatedUser
  }

  function logout() {
    setUser(null)
    setToken(null)
    setIsAuthLoading(false)
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  const value = {
    user,
    token,
    isAuthenticated,
    isAuthLoading,
    login,
    register,
    updateProfile,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
