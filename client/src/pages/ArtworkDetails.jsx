import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ArtworkCard from '../components/ArtworkCard'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import useAuth from '../hooks/useAuth'
import { createComment, getArtworkComments } from '../services/commentService'
import {
  getArtworkById,
  getRelatedArtworks,
  toggleBookmarkArtwork,
  toggleLikeArtwork,
} from '../services/artworkService'

function getEntityId(entity) {
  return String(entity?._id || entity?.id || entity || '')
}

function ArtworkDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [artwork, setArtwork] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [relatedArtworks, setRelatedArtworks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    Promise.all([
      getArtworkById(id),
      getArtworkComments(id).catch(() => []),
      getRelatedArtworks(id).catch(() => []),
    ])
      .then(([artworkDetails, nextComments, nextRelatedArtworks]) => {
        if (!isCurrent) {
          return
        }

        setArtwork(artworkDetails)
        setComments(nextComments)
        setRelatedArtworks(nextRelatedArtworks)
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

  async function handleLike() {
    const updatedArtwork = await toggleLikeArtwork(id)
    setArtwork(updatedArtwork)
  }

  async function handleBookmark() {
    const updatedArtwork = await toggleBookmarkArtwork(id)
    setArtwork(updatedArtwork)
  }

  async function handleCommentSubmit(event) {
    event.preventDefault()

    if (!commentText.trim()) {
      return
    }

    const comment = await createComment(id, commentText.trim())
    setComments((currentComments) => [comment, ...currentComments])
    setCommentText('')
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

  const userId = getEntityId(user)
  const isLiked = artwork.likes?.some((like) => getEntityId(like) === userId)
  const isBookmarked = artwork.bookmarks?.some((bookmark) => getEntityId(bookmark) === userId)

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
          <div className="detail-actions">
            <button type="button" className={isLiked ? 'is-active' : ''} onClick={handleLike} aria-pressed={isLiked}>
              Like ({artwork.likeCount || 0})
            </button>
            <button
              type="button"
              className={`button-secondary ${isBookmarked ? 'is-active' : ''}`}
              onClick={handleBookmark}
              aria-pressed={isBookmarked}
            >
              Bookmark ({artwork.bookmarkCount || 0})
            </button>
          </div>
        </div>
      </div>
      <section className="detail-section">
        <h2>Comments</h2>
        <form className="inline-form" onSubmit={handleCommentSubmit}>
          <input
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Share a thoughtful response"
          />
          <button type="submit">Post</button>
        </form>
        <div className="comment-list">
          {comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              <strong>{comment.username || 'Gallery member'}</strong>
              <p>{comment.text}</p>
            </article>
          ))}
        </div>
      </section>
      {relatedArtworks.length > 0 ? (
        <section className="detail-section">
          <h2>Related artworks</h2>
          <div className="artwork-grid">
            {relatedArtworks.map((relatedArtwork) => (
              <ArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

export default ArtworkDetails
