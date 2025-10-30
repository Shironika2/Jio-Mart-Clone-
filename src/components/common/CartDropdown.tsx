// components/CartDropdown.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../common/CartDropdown.css'; // Adjusted path for CSS
import type { CartItem ,Product} from '../../types'; // Adjusted path for types



export default function CartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // Load cart items from localStorage
  const loadCartItems = () => {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem('cartItems');
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  };

  // Load cart on mount
  useEffect(() => {
    loadCartItems();

    // Listen to storage events (cart updates from other tabs/components)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cartItems') loadCartItems();
    };
    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleProceedToCart = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!")
    
    } else {
      navigate('/order-review');
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-dropdown shadow bg-white rounded p-2">
      <div className="cart-dropdown-header fw-bold mb-2">
        My Cart ({cartItems.length})
      </div>
      <div className="cart-dropdown-body mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {cartItems.length === 0 ? (
          <div className="text-center p-3 text-muted">No items in your cart.</div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item d-flex align-items-center mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="me-2"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
              <div className="flex-grow-1">
                <div className="cart-item-title fw-bold">{item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</div>
                <div className="cart-item-price text-muted">
                  ₹{item.price.toFixed(2)} x {item.quantity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="cart-total d-flex justify-content-between align-items-center mb-2 px-2">
          <span className="fw-bold">Total:</span>
          <span className="fw-bold">₹{totalAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="cart-dropdown-footer">
        <button className="btn btn-primary w-100" onClick={handleProceedToCart}>
          Proceed to Cart
        </button>
      </div>
    </div>
  );
}
