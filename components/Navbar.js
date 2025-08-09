
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({ user: null, loading: true });

  useEffect(() => {
    // Update local state when auth context changes
    setAuthState({ user, loading });
  }, [user, loading]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" href="/">
          <strong>E-Commerce</strong>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMobileMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" href="/">Home</Link>
            </li>
            {authState.user && (
              <li className="nav-item">
                <Link className="nav-link" href="/orders">My Orders</Link>
              </li>
            )}
            {authState.user && authState.user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" href="/admin/orders">Admin</Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" href="/cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3 me-1" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                Cart
              </Link>
            </li>
            
            {authState.loading ? (
              <li className="nav-item">
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </li>
            ) : authState.user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  onClick={toggleDropdown}
                >
                  {authState.user.name}
                </a>
                <div className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}>
                  <Link className="dropdown-item" href="/orders">My Orders</Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" href="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;