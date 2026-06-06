import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import useAuth from '../hooks/useAuth'

function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
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
        </div>
        <div className="profile-card__content">
          <p className="profile-card__eyebrow">Collector Profile</p>
          <h1>{displayName}</h1>
          <p className="profile-card__email">{user.email || 'No email available'}</p>
          <p className="profile-card__bio">{bio}</p>
          <div className="profile-card__actions">
            <button type="button">Edit Profile</button>
            <button type="button" className="button-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile
