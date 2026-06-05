import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${searchQuery.trim()}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      {/* Top bar */}
      <div className="navbar__top">
        <span>Free shipping on orders over PKR 5,000</span>
      </div>

      {/* Main navbar */}
      <div className="navbar__main">
        <div className="container navbar__inner">
          {/* Mobile menu toggle */}
          <button className="navbar__mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            ShopNest
          </Link>

          {/* Nav links */}
          <nav className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
            <Link to="/" className="navbar__link">Home</Link>
            <Link to="/shop" className="navbar__link">Shop</Link>
            <Link to="/shop?category=Men's Tops" className="navbar__link">Men</Link>
            <Link to="/shop?category=Women's Tops" className="navbar__link">Women</Link>
            <Link to="/shop?category=Outerwear" className="navbar__link">Outerwear</Link>
            <Link to="/shop?category=Accessories" className="navbar__link">Accessories</Link>
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            {/* Search */}
            <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn">
              <FiShoppingBag size={20} />
              {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
            </Link>

            {/* User */}
            <div className="navbar__user-menu">
              <button className="navbar__icon-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <FiUser size={20} />
              </button>
              {userMenuOpen && (
                <div className="navbar__dropdown">
                  {user ? (
                    <>
                      <div className="navbar__dropdown-header">
                        <span className="navbar__dropdown-name">{user.name}</span>
                        <span className="navbar__dropdown-email">{user.email}</span>
                      </div>
                      <div className="navbar__dropdown-divider" />
                      {user.role === 'admin' && (
                        <Link to="/admin" className="navbar__dropdown-item">
                          <FiSettings size={14} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/orders" className="navbar__dropdown-item">
                        <FiPackage size={14} /> My Orders
                      </Link>
                      <div className="navbar__dropdown-divider" />
                      <button className="navbar__dropdown-item navbar__dropdown-logout" onClick={handleLogout}>
                        <FiLogOut size={14} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="navbar__dropdown-item">Sign In</Link>
                      <Link to="/register" className="navbar__dropdown-item">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="navbar__search">
            <form onSubmit={handleSearch} className="navbar__search-form container">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="navbar__search-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="navbar__icon-btn">
                <FiX size={20} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Overlay for dropdown close */}
      {(userMenuOpen || mobileOpen) && (
        <div className="navbar__overlay" onClick={() => { setUserMenuOpen(false); setMobileOpen(false); }} />
      )}
    </header>
  );
};

export default Navbar;
