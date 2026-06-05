import { useNavigate, useParams } from 'react-router-dom'
import artworks from '../utils/mockArtworks'

function ArtworkDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const artwork = artworks.find((item) => item.id === id)

  function handleBackToGallery() {
    navigate('/gallery')
  }

  if (!artwork) {
    return (
      <section className="artwork-details artwork-details--empty">
        <h1>Artwork not found</h1>
        <p>We could not find that artwork in the gallery.</p>
        <button type="button" onClick={handleBackToGallery}>
          Back to Gallery
        </button>
      </section>
    )
  }

  return (
    <section className="artwork-details">
      <button type="button" onClick={handleBackToGallery}>
        Back to Gallery
      </button>
      <div className="artwork-details__layout">
        <img src={artwork.image} alt={artwork.title} className="artwork-details__image" />
        <div className="artwork-details__content">
          <p className="artwork-details__category">{artwork.category}</p>
          <h1>{artwork.title}</h1>
          <p>
            <strong>Artist:</strong> {artwork.artist}
          </p>
          <p>
            <strong>Category:</strong> {artwork.category}
          </p>
          <p>{artwork.description}</p>
        </div>
      </div>
    </section>
  )
}

export default ArtworkDetails
