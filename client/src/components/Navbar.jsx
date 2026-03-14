import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to={isAuthenticated ? '/dashboard' : '/login'} className="navbar-brand">
          <ShieldIcon />
          <span>PolicyVault</span>
        </Link>

        {isAuthenticated && (
          <div className="navbar-right">
            <span className="navbar-email" title={user?.email}>{user?.email}</span>
            <button id="logout-btn" className="btn btn-outline" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
