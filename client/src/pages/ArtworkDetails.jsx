import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getArtworkById } from '../services/artworkService'

function ArtworkDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artwork, setArtwork] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    getArtworkById(id)
      .then((artworkDetails) => {
        if (!isCurrent) {
          return
        }

        setArtwork(artworkDetails)
        setError('')
      })
      .catch(() => {
        if (!isCurrent) {
          return
        }

        setError('Unable to load artwork details. Please try again later.')
      })
      .finally(() => {
        if (!isCurrent) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [id])

  function handleBackToGallery() {
    navigate('/gallery')
  }

  if (isLoading) {
    return (
      <section className="artwork-details artwork-details--empty">
        <h1>Loading artwork...</h1>
        <p>Please wait while we load the artwork details.</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="artwork-details artwork-details--empty">
        <h1>Artwork details unavailable</h1>
        <p>{error}</p>
        <button type="button" onClick={handleBackToGallery}>
          Back to Gallery
        </button>
      </section>
    )
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
