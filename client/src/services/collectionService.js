import api from './api'

export async function getCollections() {
  const response = await api.get('/collections')
  return response.data.collections
}

export async function createCollection(collectionData) {
  const response = await api.post('/collections', collectionData)
  return response.data.collection
}
