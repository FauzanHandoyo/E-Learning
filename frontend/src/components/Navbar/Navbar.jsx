import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import AuthContext
import './Navbar.css'; // Import the CSS file
import logo from '../../assets/logo.svg'; // Import the logo

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Access user and logout from AuthContext

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full border-2 border-blue-500 mr-5" />
          E-Learning
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="nav-mobile-menu"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="nav-icon"></span>
          <span className="nav-icon"></span>
          <span className="nav-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            // Navbar for logged-in users
            <>
              <span className="nav-link">Welcome, {user.username}</span>
              {user.role === 'instructor' && (
                <Link to="/instructor" className="nav-link" onClick={toggleMenu}>
                  Dashboard
                </Link>
              )}
              {user.role === 'student' && (
                <>
                  <Link to="/student" className="nav-link" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                  <Link to="/enrolled" className="nav-link" onClick={toggleMenu}>
                    Enrolled Courses
                  </Link> {/* New menu item for students */}
                </>
              )}
              <Link to="/profile" className="nav-link" onClick={toggleMenu}>
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="nav-link bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // Navbar for guests
            <>
              <Link to="/login" className="nav-link" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={toggleMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;