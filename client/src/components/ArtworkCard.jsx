import { useNavigate } from 'react-router-dom'

function ArtworkCard({ artwork }) {
  const navigate = useNavigate()

  function handleViewDetails() {
    navigate(`/gallery/${artwork.id}`)
  }

  return (
    <article className="artwork-card">
      <img src={artwork.image} alt={artwork.title} className="artwork-card__image" />
      <div className="artwork-card__content">
        <p className="artwork-card__category">{artwork.category}</p>
        <h2>{artwork.title}</h2>
        <p>Artist: {artwork.artist}</p>
        <button type="button" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </article>
  )
}

export default ArtworkCard
