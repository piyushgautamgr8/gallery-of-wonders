import artworks from '../utils/mockArtworks'

export function getAllArtworks() {
  // TODO: Replace this mock response with api.get('/artworks') when the backend is ready.
  return Promise.resolve([...artworks])
}

export function getArtworkById(id) {
  // TODO: Replace this mock response with api.get(`/artworks/${id}`) when the backend is ready.
  const artwork = artworks.find((item) => item.id === String(id))

  return Promise.resolve(artwork || null)
}

export default {
  getAllArtworks,
  getArtworkById,
}
