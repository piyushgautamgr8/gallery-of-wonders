import api from './api'

export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function getProfile() {
  const response = await api.get('/auth/profile')
  return response.data.user
}

export async function updateProfile(profileData) {
  const response = await api.put('/users/profile', profileData)
  return response.data.user
}

export default {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
}
