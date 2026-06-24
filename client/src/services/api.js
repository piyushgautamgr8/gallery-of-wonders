import axios from 'axios'

export const AUTH_TOKEN_KEY = 'galleryOfWondersToken'

const DEFAULT_API_BASE_URL = 'https://gallery-of-wonders.onrender.com/api'

function normalizeApiBaseUrl(baseUrl) {
  const normalizedBaseUrl = (baseUrl || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, '')

  if (!normalizedBaseUrl) {
    return DEFAULT_API_BASE_URL
  }

  return normalizedBaseUrl.endsWith('/api') ? normalizedBaseUrl : `${normalizedBaseUrl}/api`
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (typeof config.headers.delete === 'function') {
      config.headers.delete('Content-Type')
    } else {
      delete config.headers['Content-Type']
    }
  }

  return config
})

export default api
