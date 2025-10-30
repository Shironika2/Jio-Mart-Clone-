import React from 'react';
import { useNavigate } from 'react-router-dom';
//import '../common/AppFooter.css'; // Adjusted path for CSS

const categories = ['Electronics', 'Jewellery', "Men's Clothing", "Women's Clothing"];
const accountLinks = ['My Account', 'My Orders', 'Wishlist', 'Delivery Addresses'];

const AppFooter: React.FC = () => {
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);

  return (
    <footer className="py-5 mt-5" style={{ backgroundColor: '#f5f5f5', color: '#555',marginTop:'0' }}>
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold text-dark">All Categories</h5>
            <ul className="list-unstyled">
              {categories.map(cat => (
                <li key={cat} className="mb-2">
                  <span style={{ cursor: 'pointer', color: '#555' }} onClick={() => goTo(`/search?category=${encodeURIComponent(cat)}`)}>{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold text-dark">My Account</h5>
            <ul className="list-unstyled">
              {accountLinks.map(link => (
                <li key={link} className="mb-2">
                  <span style={{ cursor: 'pointer', color: '#555' }} onClick={() => goTo(`/${link.toLowerCase().replace(/\s/g, '-')}`)}>{link}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3 fw-bold text-dark">Contact Us</h5>
            <p style={{ marginBottom: '.5rem' }}>WhatsApp: <strong>70003 70003</strong></p>
            <p style={{ marginBottom: '.5rem' }}>Call: <strong>1800 890 1222</strong></p>
            <p>8:00 AM to 8:00 PM, 365 days</p>
          </div>
        </div>

        <div className="text-center mt-5 pt-4 border-top">
          <p>&copy; 2025 All rights reserved. Reliance Retail Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
