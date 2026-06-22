import api from './api'

export async function getAllArtworks(params = {}) {
  const response = await api.get('/artworks', { params })
  return response.data.artworks
}

export async function getArtworkById(id) {
  const response = await api.get(`/artworks/${id}`)
  return response.data.artwork
}

export async function getRelatedArtworks(id) {
  const response = await api.get(`/artworks/related/${id}`)
  return response.data.artworks
}

export async function createArtwork(artworkData) {
  const response = await api.post('/artworks', artworkData)
  return response.data.artwork
}

export async function uploadArtworkImage(file, onUploadProgress) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await api.post('/uploads/artwork', formData, {
    onUploadProgress,
  })

  return response.data
}

export async function updateArtwork(id, artworkData) {
  const response = await api.put(`/artworks/${id}`, artworkData)
  return response.data.artwork
}

export async function deleteArtwork(id) {
  const response = await api.delete(`/artworks/${id}`)
  return response.data
}

export async function toggleLikeArtwork(id) {
  const response = await api.post(`/artworks/${id}/like`)
  return response.data.artwork
}

export async function toggleBookmarkArtwork(id) {
  const response = await api.post(`/artworks/${id}/bookmark`)
  return response.data.artwork
}

export default {
  getAllArtworks,
  getArtworkById,
  getRelatedArtworks,
  createArtwork,
  uploadArtworkImage,
  updateArtwork,
  deleteArtwork,
  toggleLikeArtwork,
  toggleBookmarkArtwork,
}
