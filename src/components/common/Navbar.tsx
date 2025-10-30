import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchBar from './SearchBar';
import jiomartIcon from '../../assets/jiomart-icon.png';
import CartDropdown from './CartDropdown';
import DeliveryLocationSelector from './DeliveryLocationSelector';

export default function Navbar() {
  const navigate = useNavigate();

  const initialUserName = localStorage.getItem('userName');
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialUserName);
  const [userName, setUserName] = useState(initialUserName || '');

  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [hideTimeoutId, setHideTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<'Quick' | 'Scheduled'>('Quick');
  const [cartCount, setCartCount] = useState(0);

  // ================= Cart Dropdown Hover =================
  const handleMouseEnter = () => {
    if (hideTimeoutId) clearTimeout(hideTimeoutId);
    setShowCartDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeoutId = setTimeout(() => setShowCartDropdown(false), 200);
    setHideTimeoutId(timeoutId);
  };

  // ================= Storage Listener =================
  useEffect(() => {
    const handleStorageChange = () => {
      const storedName = localStorage.getItem('userName');
      setIsLoggedIn(!!storedName);
      setUserName(storedName || '');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-logout', handleStorageChange);

    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-logout', handleStorageChange);
      if (hideTimeoutId) clearTimeout(hideTimeoutId);
    };
  }, []);

  // ================= Cart Count Effect =================
  const updateCartCount = () => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart);
        setCartCount(items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };


  useEffect(() => {
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === 'cartItems') updateCartCount();
  };
  const handleCartUpdated = () => updateCartCount();

  updateCartCount();

  window.addEventListener('storage', handleStorageEvent);
  window.addEventListener('cart-updated', handleCartUpdated);

  return () => {
    window.removeEventListener('storage', handleStorageEvent);
    window.removeEventListener('cart-updated', handleCartUpdated);
  };
}, []);

  // ================= Handlers =================
  const handleSignInOrProfileClick = () => navigate(isLoggedIn ? '/my-account' : '/login');

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('deliveryAddress');

    setIsLoggedIn(false);
    setUserName('');

    window.dispatchEvent(new Event('user-logout'));
    window.dispatchEvent(new Event('storage'));

    navigate('/');
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg py-2 w-100" style={{ backgroundColor: '#0062a3', minHeight: '60px' }}>
        <div className="container-fluid px-3 align-items-center" style={{ minHeight: '60px' }}>

          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center me-3 navbar-light-bg">
            <img src={jiomartIcon} alt="JioMart" className="me-2" style={{ width: '40px' }} />
            <span className="fw-bold text-white">JioMart</span>
          </Link>

          {/* Scheduled / Quick Toggle */}
          <div className="delivery-mode-toggle d-flex align-items-center me-3">
            <button
              className={`btn btn-sm ${deliveryMode === 'Quick' ? 'btn-light text-dark' : 'btn-outline-light'}`}
              onClick={() => setDeliveryMode('Quick')}
            >
              Quick
            </button>
            <button
              className={`btn btn-sm ${deliveryMode === 'Scheduled' ? 'btn-light text-dark' : 'btn-outline-light'}`}
              onClick={() => setDeliveryMode('Scheduled')}
            >
              Scheduled
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-grow-1 mx-3 navbar-light-bg p-1 rounded">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Cart & User */}
          <div className="d-flex align-items-center">
            {/* Cart */}
            <div className="position-relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <button className="navbar-cart-btn mx-3">
                🛒
                <span className="cart-count-badge">{cartCount > 0 ? cartCount : ''}</span>
              </button>
              {showCartDropdown && <CartDropdown />}
            </div>

            {/* Sign In / Profile */}
            {!isLoggedIn ? (
              <button
                className="btn btn-link text-white d-flex align-items-center navbar-light-bg"
                onClick={handleSignInOrProfileClick}
              >
                <i className="bi bi-person-fill fs-5"></i>
                <span className="ms-1">Sign In</span>
              </button>
            ) : (
              <div className="nav-item dropdown px-3 navbar-light-bg">
                <button
                  className="btn btn-link nav-link dropdown-toggle text-white d-flex align-items-center"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  onClick={handleSignInOrProfileClick}
                >
                  <div
                    className="rounded-circle bg-light text-primary d-flex justify-content-center align-items-center me-2"
                    style={{ width: '30px', height: '30px', fontSize: '0.9rem' }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li><Link to="/my-account" className="dropdown-item">My Account</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleSignOut}>Sign Out</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= Delivery Bar ================= */}
      <div className="delivery-bar py-1 px-3 text-white" style={{ backgroundColor: '#004880' }}>
        <DeliveryLocationSelector />
      </div>
    </>
  );
}
