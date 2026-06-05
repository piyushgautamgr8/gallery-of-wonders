import ArtworkCard from '../components/ArtworkCard'
import artworks from '../utils/mockArtworks'

function Gallery() {
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
