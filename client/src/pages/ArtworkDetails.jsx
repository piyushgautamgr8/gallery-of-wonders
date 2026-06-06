import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
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
        <Loader message="Loading artwork..." />
      </section>
    )
  }

  if (error) {
    return (
      <section className="artwork-details artwork-details--empty">
        <EmptyState
          title="Artwork details unavailable"
          description={error}
          buttonText="Back to Gallery"
          navigationLink="/gallery"
        />
      </section>
    )
  }

  if (!artwork) {
    return (
      <section className="artwork-details artwork-details--empty">
        <EmptyState
          title="Artwork not found"
          description="We could not find that artwork in the gallery."
          buttonText="Back to Gallery"
          navigationLink="/gallery"
        />
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
