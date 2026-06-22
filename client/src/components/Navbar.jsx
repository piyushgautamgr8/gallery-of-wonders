import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const getNavLinkClassName = ({ isActive }) => (isActive ? 'active' : undefined)

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const avatarInitial = (user?.username || user?.email || 'G').charAt(0).toUpperCase()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          Gallery of Wonders
        </NavLink>
        <ul className="navbar__links">
          <li>
            <NavLink to="/" className={getNavLinkClassName}>
              Home
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/gallery" className={getNavLinkClassName}>
                  Gallery
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={getNavLinkClassName}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/upload" className={getNavLinkClassName}>
                  Upload
                </NavLink>
              </li>
              <li>
                <NavLink to="/collections" className={getNavLinkClassName}>
                  Collections
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className={getNavLinkClassName}>
                  <span className="navbar__profile-link">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="" className="navbar__avatar" />
                    ) : (
                      <span className="navbar__avatar navbar__avatar--fallback" aria-hidden="true">
                        {avatarInitial}
                      </span>
                    )}
                    Profile
                  </span>
                </NavLink>
              </li>
              <li>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={getNavLinkClassName}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={getNavLinkClassName}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
