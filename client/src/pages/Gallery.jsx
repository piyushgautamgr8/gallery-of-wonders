import { useEffect, useState } from 'react'
import ArtworkCard from '../components/ArtworkCard'
import { getAllArtworks } from '../services/artworkService'

function Gallery() {
  const [artworks, setArtworks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllArtworks()
      .then((artworkList) => {
        setArtworks(artworkList)
      })
      .catch(() => {
        setError('Unable to load artworks. Please try again later.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <section className="gallery-page">
        <h1>Gallery</h1>
        <p>Loading artworks...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="gallery-page">
        <h1>Gallery</h1>
        <p>{error}</p>
      </section>
    )
  }

  return (
    <section className="gallery-page">
      <h1>Gallery</h1>
      <div className="artwork-grid">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  )
}

export default Gallery
