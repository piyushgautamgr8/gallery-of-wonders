import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const getNavLinkClassName = ({ isActive }) => (isActive ? 'active' : undefined)

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav>
      <NavLink to="/" className={getNavLinkClassName}>
        Gallery of Wonders
      </NavLink>
      <ul>
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
              <NavLink to="/profile" className={getNavLinkClassName}>
                Profile
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
    </nav>
  )
}

export default Navbar
