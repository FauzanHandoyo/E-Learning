import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
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
          <Link to="/" className="nav-link" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/courses" className="nav-link" onClick={toggleMenu}>
            Courses
          </Link>
          <Link to="/login" className="nav-link" onClick={toggleMenu}>
            Login
          </Link>
          <Link to="/register" className="nav-link" onClick={toggleMenu}>
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;