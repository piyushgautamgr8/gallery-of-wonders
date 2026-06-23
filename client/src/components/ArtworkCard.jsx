import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { toggleBookmarkArtwork, toggleLikeArtwork } from '../services/artworkService'

function getEntityId(entity) {
  return String(entity?._id || entity?.id || entity || '')
}

function ArtworkCard({ artwork, onArtworkChange }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [optimisticArtwork, setOptimisticArtwork] = useState(null)
  const currentArtwork = optimisticArtwork || artwork
  const userId = getEntityId(user)
  const likes = currentArtwork.likes || []
  const bookmarks = currentArtwork.bookmarks || []
  const isLiked = likes.some((like) => getEntityId(like) === userId)
  const isBookmarked = bookmarks.some((bookmark) => getEntityId(bookmark) === userId)

  function handleViewDetails() {
    navigate(`/gallery/${currentArtwork.id}`)
  }

  async function handleLike() {
    const nextLiked = !isLiked
    const optimisticLikes = nextLiked
      ? [...likes, userId]
      : likes.filter((like) => getEntityId(like) !== userId)

    const nextArtwork = {
      ...currentArtwork,
      likes: optimisticLikes,
      likeCount: optimisticLikes.length,
    }

    setOptimisticArtwork(nextArtwork)
    onArtworkChange?.(nextArtwork)

    try {
      const updatedArtwork = await toggleLikeArtwork(currentArtwork.id)
      setOptimisticArtwork(updatedArtwork)
      onArtworkChange?.(updatedArtwork)
    } catch {
      setOptimisticArtwork(currentArtwork)
      onArtworkChange?.(currentArtwork)
    }
  }

  async function handleBookmark() {
    const nextBookmarked = !isBookmarked
    const optimisticBookmarks = nextBookmarked
      ? [...bookmarks, userId]
      : bookmarks.filter((bookmark) => getEntityId(bookmark) !== userId)

    const nextArtwork = {
      ...currentArtwork,
      bookmarks: optimisticBookmarks,
      bookmarkCount: optimisticBookmarks.length,
    }

    setOptimisticArtwork(nextArtwork)
    onArtworkChange?.(nextArtwork)

    try {
      const updatedArtwork = await toggleBookmarkArtwork(currentArtwork.id)
      setOptimisticArtwork(updatedArtwork)
      onArtworkChange?.(updatedArtwork)
    } catch {
      setOptimisticArtwork(currentArtwork)
      onArtworkChange?.(currentArtwork)
    }
  }

  return (
    <article className="artwork-card">
      <div className="artwork-card__media">
        <img src={currentArtwork.image} alt={currentArtwork.title} className="artwork-card__image" loading="lazy" />
        <span className="artwork-card__badge">{currentArtwork.category}</span>
      </div>
      <div className="artwork-card__content">
        <p className="artwork-card__category">Curated artwork</p>
        <h2>{currentArtwork.title}</h2>
        <p>Artist: {currentArtwork.artist || 'Gallery artist'}</p>
        {currentArtwork.description ? <p className="artwork-card__description">{currentArtwork.description}</p> : null}
        <div className="artwork-card__actions" aria-label={`${artwork.title} engagement`}>
          <button
            type="button"
            className={`icon-button ${isLiked ? 'is-active' : ''}`}
            onClick={handleLike}
            aria-label={`Like ${currentArtwork.title}`}
            aria-pressed={isLiked}
          >
            ♡ {currentArtwork.likeCount || 0}
          </button>
          <span>💬 {currentArtwork.commentCount || 0}</span>
          <button
            type="button"
            className={`icon-button ${isBookmarked ? 'is-active' : ''}`}
            onClick={handleBookmark}
            aria-label={`Save ${currentArtwork.title}`}
            aria-pressed={isBookmarked}
          >
            🔖 Save
          </button>
        </div>
        <button type="button" className="artwork-card__cta" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </article>
  )
}

export default ArtworkCard
