import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
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