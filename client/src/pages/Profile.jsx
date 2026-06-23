import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ArtworkCard from '../components/ArtworkCard'
import EmptyState from '../components/EmptyState'
import useAuth from '../hooks/useAuth'
import { getAllArtworks, uploadArtworkImage } from '../services/artworkService'

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxImageSize = 10 * 1024 * 1024

function getEntityId(entity) {
  return String(entity?._id || entity?.id || entity || '')
}

function isBookmarkedByUser(artwork, userId) {
  return (artwork.bookmarks || []).some((bookmark) => getEntityId(bookmark) === userId)
}

function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
  })
  const [savedArtworks, setSavedArtworks] = useState([])
  const [profileUploadProgress, setProfileUploadProgress] = useState(0)
  const [profileUploadMessage, setProfileUploadMessage] = useState('')
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    getAllArtworks()
      .then((artworks) => {
        if (!isCurrent) {
          return
        }

        const userId = getEntityId(user)
        const bookmarkIds = new Set((user?.bookmarks || []).map((bookmark) => getEntityId(bookmark)))

        setSavedArtworks(
          artworks.filter((artwork) => {
            const artworkId = getEntityId(artwork.id)
            const artworkBookmarks = artwork.bookmarks || []

            return (
              bookmarkIds.has(artworkId) ||
              artworkBookmarks.some((bookmark) => getEntityId(bookmark) === userId)
            )
          }),
        )
      })
      .catch(() => {
        if (isCurrent) {
          setSavedArtworks([])
        }
      })

    return () => {
      isCurrent = false
    }
  }, [user])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  function validateImage(file) {
    if (!file) {
      return 'Choose an image to upload.'
    }

    if (!allowedImageTypes.includes(file.type)) {
      return 'Please choose a JPG, PNG, or WebP image.'
    }

    if (file.size > maxImageSize) {
      return 'Image must be 10MB or smaller.'
    }

    return ''
  }

  async function handleProfileImageChange(event) {
    const file = event.target.files?.[0]
    const validationError = validateImage(file)

    if (validationError) {
      setError(validationError)
      setProfileUploadMessage('')
      setProfileUploadProgress(0)
      return
    }

    setError('')
    setProfileUploadMessage('Uploading profile picture...')
    setProfileUploadProgress(0)
    setIsUploadingProfileImage(true)

    try {
      const uploadResult = await uploadArtworkImage(file, (progressEvent) => {
        if (!progressEvent.total) {
          return
        }

        setProfileUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      })
      const profileImage = uploadResult.imageUrl || uploadResult.image

      if (!profileImage) {
        throw new Error('Upload completed without an image URL.')
      }

      const updatedProfile = { ...formData, profileImage }
      setFormData(updatedProfile)
      await updateProfile(updatedProfile)
      setProfileUploadMessage('Profile picture updated.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Unable to upload profile picture.')
      setProfileUploadMessage('')
    } finally {
      setIsUploadingProfileImage(false)
      event.target.value = ''
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await updateProfile(formData)
      setIsEditing(false)
      setError('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile.')
    }
  }

  if (!user) {
    return (
      <section className="profile-page profile-page--empty">
        <EmptyState
          title="Profile unavailable"
          description="We could not load your profile information right now."
          buttonText="Return Home"
          navigationLink="/"
        />
      </section>
    )
  }

  const displayName = user.username || 'Gallery Guest'
  const bio =
    user.bio ||
    'Art lover exploring timeless collections, hidden masterpieces, and new gallery favorites.'
  const avatarInitial = displayName.charAt(0).toUpperCase()
  const userId = getEntityId(user)

  function handleSavedArtworkChange(updatedArtwork) {
    setSavedArtworks((currentArtworks) => {
      if (!isBookmarkedByUser(updatedArtwork, userId)) {
        return currentArtworks.filter((artwork) => getEntityId(artwork.id) !== getEntityId(updatedArtwork.id))
      }

      return currentArtworks.map((artwork) =>
        getEntityId(artwork.id) === getEntityId(updatedArtwork.id) ? updatedArtwork : artwork,
      )
    })
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-card__media">
          {user.profileImage ? (
            <img src={user.profileImage} alt={displayName} className="profile-card__image" />
          ) : (
            <div className="profile-card__avatar" aria-label={`${displayName} avatar`}>
              {avatarInitial}
            </div>
          )}
          <label className="profile-image-upload">
            <span>{isUploadingProfileImage ? 'Uploading...' : 'Change Profile Picture'}</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleProfileImageChange}
              disabled={isUploadingProfileImage}
            />
          </label>
        </div>
        <div className="profile-card__content">
          <p className="profile-card__eyebrow">Collector Profile</p>
          <h1>{displayName}</h1>
          <p className="profile-card__email">{user.email || 'No email available'}</p>
          <p className="profile-card__bio">{bio}</p>
          <div className="profile-stats" aria-label="Profile stats">
            <span>
              <strong>{user.bookmarks?.length || 0}</strong>
              Saved
            </span>
            <span>
              <strong>{user.createdAt ? new Date(user.createdAt).getFullYear() : 'New'}</strong>
              Member
            </span>
            <span>
              <strong>∞</strong>
              Wonder
            </span>
          </div>
          {isEditing ? (
            <form className="studio-form studio-form--compact" onSubmit={handleSubmit}>
              {error ? <p className="auth-form__error">{error}</p> : null}
              {profileUploadProgress > 0 || profileUploadMessage ? (
                <div className="upload-status" aria-live="polite">
                  <div className="upload-progress" aria-label={`Upload progress ${profileUploadProgress}%`}>
                    <span style={{ width: `${profileUploadProgress}%` }} />
                  </div>
                  <p>{profileUploadMessage || `${profileUploadProgress}% uploaded`}</p>
                </div>
              ) : null}
              <label>
                Display name
                <input name="username" value={formData.username} onChange={handleChange} />
              </label>
              <label>
                Bio
                <textarea name="bio" value={formData.bio} onChange={handleChange} />
              </label>
              <button type="submit">Save profile</button>
            </form>
          ) : null}
          {!isEditing && (profileUploadProgress > 0 || profileUploadMessage || error) ? (
            <div className="profile-upload-feedback">
              {error ? <p className="auth-form__error">{error}</p> : null}
              {profileUploadProgress > 0 || profileUploadMessage ? (
                <div className="upload-status" aria-live="polite">
                  <div className="upload-progress" aria-label={`Upload progress ${profileUploadProgress}%`}>
                    <span style={{ width: `${profileUploadProgress}%` }} />
                  </div>
                  <p>{profileUploadMessage || `${profileUploadProgress}% uploaded`}</p>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="profile-card__actions">
            <button type="button" onClick={() => setIsEditing((currentValue) => !currentValue)}>
              {isEditing ? 'Close Editor' : 'Edit Profile'}
            </button>
            <button type="button" className="button-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <section className="profile-gallery-section">
        <div className="page-heading">
          <p>Saved Posts</p>
          <h2>Bookmarked artworks</h2>
        </div>
        {savedArtworks.length > 0 ? (
          <div className="artwork-grid">
            {savedArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} onArtworkChange={handleSavedArtworkChange} />
            ))}
          </div>
        ) : (
          <EmptyState title="No saved posts yet" description="Bookmarked artworks will appear here." />
        )}
      </section>
    </section>
  )
}

export default Profile
