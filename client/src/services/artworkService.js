import api from './api'

export async function getAllArtworks(params = {}) {
  const response = await api.get('/artworks', { params })
  return response.data.artworks
}

export async function getArtworkById(id) {
  const response = await api.get(`/artworks/${id}`)
  return response.data.artwork
}

export default {
  getAllArtworks,
  getArtworkById,
}
