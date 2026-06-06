const mockUser = {
  id: '1',
  username: 'Piyush',
  email: 'piyush@example.com',
}

const mockAuthToken = 'mock-auth-token'

export function registerUser(userData) {
  // TODO: Replace this mock response with api.post('/auth/register', userData) when the backend is ready.
  return Promise.resolve({
    user: {
      ...mockUser,
      username: userData?.username || mockUser.username,
      email: userData?.email || mockUser.email,
    },
    token: mockAuthToken,
  })
}

export function loginUser(credentials) {
  // TODO: Replace this mock response with api.post('/auth/login', credentials) when the backend is ready.
  return Promise.resolve({
    user: {
      ...mockUser,
      email: credentials?.email || mockUser.email,
    },
    token: mockAuthToken,
  })
}

export function logoutUser() {
  // TODO: Replace this mock response with api.post('/auth/logout') when the backend supports sessions.
  return Promise.resolve({
    success: true,
  })
}

export default {
  registerUser,
  loginUser,
  logoutUser,
}
