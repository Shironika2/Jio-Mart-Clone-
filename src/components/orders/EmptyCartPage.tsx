import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="mb-3">🛒 No items in your cart</h1>
      <p className="mb-4">Looks like your shopping cart is empty. Start shopping now!</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
}
