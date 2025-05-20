import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import './Navbar.css'; 
import logo from '../../assets/logo.svg'; 

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth(); 
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              
              {/* Common links for both student and instructor */}
              <Link to="/main" className="nav-link" onClick={toggleMenu}>
                Dashboard
              </Link>
              <Link to="/enrolled" className="nav-link" onClick={toggleMenu}>
                Enrolled Courses
              </Link>
              
              {/* Instructor-specific tools */}
              {user.role === 'instructor' && (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="nav-link flex items-center"
                    aria-expanded={isDropdownOpen}
                  >
                    Instructor Tools
                    <svg className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                      <Link 
                        to="/instructor/courses" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          toggleDropdown();
                          toggleMenu();
                        }}
                      >
                        My Courses
                      </Link>
                      <Link 
                        to="/instructor/create-course" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          toggleDropdown();
                          toggleMenu();
                        }}
                      >
                        Create Course
                      </Link>
                      <Link 
                        to="/instructor/analytics" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          toggleDropdown();
                          toggleMenu();
                        }}
                      >
                        Analytics
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Profile moved to right before Logout */}
              <Link to="/profile" className="nav-link ml-auto" onClick={toggleMenu}>
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
            <div className="navbar-links">
              <a href="/login" className="nav-btn nav-btn-login">Login</a>
              <a href="/register" className="nav-btn nav-btn-register">Register</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;