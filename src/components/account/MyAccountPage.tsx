import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAddToCart } from '../../hooks/useAddToCart';

// Import other components
import MyWishlist from '../account/MyWishlist'; 
import Coupons from '../account/Coupons'; 
import LegalInformation from '../account/LegalInformation'; 
import HelpAndSupport from '../account/HelpAndSupport'; 
import Orders from '../orders/Orders'; 
import Delivery from '../account/Delivery'; 
import SignOutConfirmation from '../account/SignOutConfirmation'; 

export default function MyAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useAddToCart();

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState('account');

  const [userDetails, setUserDetails] = useState({
    name: '',
    mobile: '',
    email: '',
    full_name: '',
    default_address: '',
  });

  const [cartCount, setCartCount] = useState(0);

  // Load user info and default address
  useEffect(() => {
    let fetchedName = '';
    let fetchedMobile = '';

    if (location.state?.user) {
      const { name, mobile } = location.state.user;
      fetchedName = name;
      fetchedMobile = mobile;
    } else {
      fetchedName = localStorage.getItem('userName') || '';
      fetchedMobile = localStorage.getItem('userMobile') || '';
    }

    const derivedEmail = fetchedName
      ? `${fetchedName.toLowerCase().replace(/\s+/g, '')}@jiomart.com`
      : '';
    const derivedMobile = fetchedMobile || '+91 XXXXXXXXXX';

    // Fetch default address (first saved one)
    let defaultAddress = '';
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      const addressList = JSON.parse(savedAddresses);
      if (Array.isArray(addressList) && addressList.length > 0) {
        defaultAddress = addressList[0];
      }
    }

    setUserDetails({
      name: fetchedName,
      full_name: fetchedName,
      mobile: derivedMobile,
      email: derivedEmail,
      default_address: defaultAddress,
    });

  
  }, [location.state]);

 const handleSignOut = () => {
  // Clear user-related state and storage
  setCartCount(0);
  clearCart();
localStorage.removeItem('usedCoupons');

  // Remove ALL possible auth and session data
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  localStorage.removeItem('userMobile');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('likedProducts');
  localStorage.removeItem('adresses');
  sessionStorage.clear(); // <---- important if you use session storage anywhere

  // Dispatch a global event so other components can react
  window.dispatchEvent(new Event('user-logout'));

  // Optional small delay ensures hooks update before redirect
  setTimeout(() => {
    navigate('/', { state: { user: null } });
  }, 200);
};


  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account':
       return (
  <div
    className="container-fluid p-4 bg-light rounded-3 shadow-sm"
    style={{ width: '80vw', padding: '2rem 2rem' }}
  >
    <h4 className="mb-3 fw-bold">Account Information</h4>
    <p><strong>Full Name:</strong> {userDetails.full_name}</p>
    <p><strong>Email ID:</strong> {userDetails.email}</p>
    <p><strong>Mobile No:</strong> {userDetails.mobile}</p>
    <p>
      <strong>Default Address:</strong>{' '}
      {userDetails.default_address || 'No address saved yet.'}
    </p>
  </div>
);

      case 'orders':
        return <Orders />;
      case 'wishlist':
        return <MyWishlist />;
      case 'coupons':
        return <Coupons />;
      case 'delivery':
        return <Delivery />;
      case 'help':
        return <HelpAndSupport />;
      case 'legal':
        return <LegalInformation />;
      default:
        return <p>Select a section to view details.</p>;
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-3 mb-3">
          <div
            className="bg-white border p-3 shadow-sm rounded-3"
            style={{ minHeight: '85vh' }}
          >
            <h5 className="fw-bold mb-4">My Account</h5>
            <div className="list-group">
              {[
                { key: 'account', label: 'Account',  },
                { key: 'orders', label: 'My Orders'},
                { key: 'wishlist', label: 'Wishlist' },
                { key: 'coupons', label: 'Coupons' },
                { key: 'delivery', label: 'Delivery Addresses' },
                { key: 'help', label: 'Help & Support'},
                { key: 'legal', label: 'Legal Information' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`list-group-item list-group-item-action d-flex align-items-center py-3 rounded ${
                    activeSection === item.key
                      ? 'bg-primary text-white fw-semibold'
                      : 'text-dark bg-transparent'
                  }`}
                  style={{ border: 'none', transition: 'all 0.3s ease' }}
                >
                 
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                className="list-group-item list-group-item-action text-danger mt-3 d-flex align-items-center border-0 bg-transparent"
                onClick={() => setShowSignOutConfirm(true)}
              >
                <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-9">
          <div
            className="bg-light p-4 rounded-3 shadow-sm"
            style={{ minHeight: '85vh', overflowY: 'auto' }}
          >
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation */}
      <SignOutConfirmation
        isOpen={showSignOutConfirm}
        onCancelSignOut={() => setShowSignOutConfirm(false)}
        onConfirmSignOut={handleSignOut}
      />
    </div>
  );
}
