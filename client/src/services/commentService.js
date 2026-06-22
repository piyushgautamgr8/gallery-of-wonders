import api from './api'

export async function getArtworkComments(artworkId) {
  const response = await api.get(`/comments/artwork/${artworkId}`)
  return response.data.comments
}

export async function createComment(artworkId, text) {
  const response = await api.post(`/comments/artwork/${artworkId}`, { text })
  return response.data.comment
}

export async function deleteComment(id) {
  const response = await api.delete(`/comments/${id}`)
  return response.data
}
