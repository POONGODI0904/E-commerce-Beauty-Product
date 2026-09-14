import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Clock,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Click outside search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.get(`/products/suggestions?q=${encodeURIComponent(searchQuery)}`);
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSuggestions([]);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/shop#categories' },
    { label: 'New Arrivals', path: '/shop?newArrival=true' },
    { label: 'Best Sellers', path: '/shop?bestseller=true' },
    { label: 'Offers', path: '/shop?hasDiscount=true' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      {/* Top Banner Announcement */}
      <div style={{
        background: 'linear-gradient(90deg, #1F1B18 0%, #382E2B 50%, #1F1B18 100%)',
        color: '#F4ECE4',
        fontSize: '0.78rem',
        letterSpacing: '0.08em',
        padding: '0.45rem 1rem',
        textAlign: 'center',
        fontWeight: 400
      }}>
        <span>COMPLIMENTARY ROYAL SHIPPING ON ORDERS OVER $50 • USE CODE <strong>GLOW20</strong> FOR 20% OFF</span>
      </div>

      {/* Main Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(250, 248, 245, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 217, 209, 0.6)',
        boxShadow: isScrolled ? '0 8px 30px rgba(31, 27, 24, 0.05)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '82px' }}>
          
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0.5rem'
            }}
            className="mobile-nav-toggle"
          >
            <Menu size={24} />
          </button>

          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.95rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: 'var(--text-primary)',
              lineHeight: 1
            }}>
              ÉLORA
            </span>
            <span style={{
              fontSize: '0.62rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--primary-rose)',
              fontWeight: 500,
              marginTop: '3px'
            }}>
              BEAUTY
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
            {navLinks.map((link) => {
              const active = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  style={{
                    fontSize: '0.86rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--primary-rose)' : 'var(--text-primary)',
                    position: 'relative',
                    padding: '0.4rem 0',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-rose)')}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* Live Search Toggle & Bar */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search products"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '50%',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(197, 137, 122, 0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Search size={20} />
              </button>

              {/* Search Floating Popover */}
              {searchOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '340px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '1rem',
                  zIndex: 1001,
                  animation: 'slideUp 0.2s ease-out'
                }}>
                  <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Search serums, lipsticks, perfumes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="form-input"
                      style={{ padding: '0.6rem 0.9rem', fontSize: '0.88rem' }}
                    />
                    <button type="submit" className="btn btn-rose btn-sm" style={{ padding: '0.6rem 0.9rem' }}>
                      <Search size={16} />
                    </button>
                  </form>

                  {/* Suggestions List */}
                  {suggestions.length > 0 && (
                    <div style={{ marginTop: '0.8rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.6rem' }}>
                      <div style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                        Products Found ({suggestions.length})
                      </div>
                      {suggestions.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            navigate(`/product/${item._id}`);
                            setSearchOpen(false);
                            setSuggestions([]);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.4rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.84rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--primary-rose)' }}>
                              ${item.price.toFixed(2)} • <span style={{ color: 'var(--text-muted)' }}>{item.category}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                color: 'var(--text-primary)',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(197, 137, 122, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: 'var(--primary-rose)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'heartBeat 0.5s ease-out'
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              aria-label="Shopping bag"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                color: 'var(--text-primary)',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(197, 137, 122, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  background: '#1A1715',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  {itemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(197, 137, 122, 0.1)',
                      border: '1px solid rgba(197, 137, 122, 0.25)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={user.name}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.82rem', fontWeight: 500, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} color="var(--text-muted)" />
                  </button>

                  {userDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '125%',
                      right: 0,
                      width: '210px',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--border-light)',
                      padding: '0.5rem 0',
                      zIndex: 1002,
                      animation: 'slideUp 0.2s ease-out'
                    }}>
                      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</div>
                        {isAdmin && (
                          <span className="badge badge-gold" style={{ marginTop: '0.3rem', fontSize: '0.65rem' }}>
                            Admin Access
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.85rem', color: 'var(--primary-rose)', fontWeight: 600 }}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <ShieldAlert size={16} /> Admin Portal
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <UserIcon size={16} /> My Account
                      </Link>

                      <Link
                        to="/dashboard?tab=orders"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Clock size={16} /> My Orders
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          width: '100%',
                          padding: '0.6rem 1rem',
                          fontSize: '0.85rem',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-danger)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderTop: '1px solid var(--border-light)',
                          marginTop: '0.25rem'
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="btn btn-rose btn-sm"
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  <UserIcon size={15} /> Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(26, 23, 21, 0.5)',
          backdropFilter: 'blur(6px)'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '82%',
            maxWidth: '320px',
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 }}>
                ÉLORA BEAUTY
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: 'var(--primary-rose)', fontWeight: 600, marginTop: '0.5rem' }}
                >
                  🛡️ Admin Panel
                </Link>
              )}
            </nav>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  <button onClick={logout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-rose"
                  style={{ width: '100%' }}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Style hook for responsive desktop/mobile display */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
