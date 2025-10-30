import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { Product } from '../../types';
import { useLike } from '../../hooks/useLike';
import { useAddToCart } from '../../hooks/useAddToCart';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { likedProducts, toggleLike } = useLike();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const { addToCart } = useAddToCart();

  if (loading) return (
    <div className="container-fluid text-center my-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p>Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="container-fluid alert alert-danger text-center my-5">{error}</div>
  );

  if (!product) return (
    <div className="container-fluid text-center my-5"><p>Product not found.</p></div>
  );

  return (
    <div className="bg-light">
      <div className="container-fluid mt-4 px-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item">
              <Link to={`/category/${product.category}`}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{product.title.substring(0, 30)}...</li>
          </ol>
        </nav>

        <div className="row w-100">
          {/* Product Images */}
          <div className="col-md-5 mb-4">
            <div className="card p-3 border-0 shadow-sm w-100">
              <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '400px', objectFit: 'contain' }} />
              <div className="row mt-2 g-2">
                {[product.image, product.image, product.image].map((img, idx) => (
                  <div className="col-3" key={idx}>
                    <img src={img} className="img-thumbnail border-primary" alt={`Thumbnail ${idx + 1}`} style={{ height: '70px', objectFit: 'contain', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-7 mb-4">
            <div className="card p-4 border-0 shadow-sm w-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="h5 mb-0 fw-bold">{product.title}</h1>
                <span
                  onClick={() => toggleLike(String(product.id))}
                  style={{ cursor: 'pointer', fontSize: '1.2em', color: likedProducts.has(String(product.id)) ? 'red' : 'black' }}
                >♡</span>
              </div>

              <div className="d-flex align-items-center mb-3">
                <span className="text-warning me-2">
                  {[...Array(Math.round(product.rating.rate))].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                  {[...Array(5 - Math.round(product.rating.rate))].map((_, i) => <i key={i} className="bi bi-star"></i>)}
                </span>
                <span className="text-muted me-2">({product.rating.count} ratings)</span>
                <span className="text-success fw-bold">In Stock</span>
              </div>

              <h4 className="mb-3">
                <span className="text-danger fw-bold me-2 fs-3">
                  ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </span>
                <span className="text-muted me-1 fs-6">
                  <del>₹{(product.price * 1.5).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</del>
                </span>
                <span className="text-danger fw-bold fs-6">33% Off</span>
              </h4>

              <div className="row align-items-center mb-4">
                <div className="col-md-4">
                  <label htmlFor="quantity" className="form-label">Quantity:</label>
                  <input type="number" id="quantity" className="form-control" value={quantity}  min={1} onChange={e => setQuantity(Number(e.target.value))} />
                </div>
                <div className="col-md-8 d-flex gap-2">
                  <button className="btn btn-primary btn-lg flex-grow-1 shadow-lg" onClick={() => addToCart(product, quantity)}>
                    <i className="bi bi-cart-plus me-2"></i> Add to Cart
                  </button>
                  <button
                    className="btn btn-danger btn-lg flex-grow-1 shadow-lg"
                    onClick={() => navigate('/order-review', { state: { product, quantity } })}
                  >
                    <i className="bi bi-bag-check me-2"></i> Buy Now
                  </button>
                </div>
              </div>

            {/* Delivery Info */}
<div className="mb-3 border-top pt-3">
  <h5 className="fw-bold">Deliver to</h5>
  <p className="mb-1">{localStorage.getItem('deliveryAddress') || ''}</p>
  <p className="text-success">
    Delivery between{' '}
    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to{' '}
    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
  </p>
</div>


              {/* Sold By */}
              <div className="mb-3 border-top pt-3">
                <h5 className="fw-bold">Sold by</h5>
                <p className="mb-1">Raj Enterprises</p>
              </div>

              {/* Features */}
              <div className="mb-3 border-top pt-3">
                <h5 className="fw-bold">Features & Details</h5>
                <ul className="list-unstyled">
                     <li><i className="bi bi-check-circle-fill text-success me-2"></i> High Quality Materials</li>
    <li><i className="bi bi-check-circle-fill text-success me-2"></i> Durable and Long-lasting</li>
    <li><i className="bi bi-check-circle-fill text-success me-2"></i> Easy to Use</li>
    <li><i className="bi bi-check-circle-fill text-success me-2"></i> Convenient Maintenance</li>
    <li><i className="bi bi-check-circle-fill text-success me-2"></i> Ergonomic Design</li>
    <li><i className="bi bi-check-circle-fill text-success me-2"></i> Safe and Reliable</li>
                </ul>
              </div>

              {/* Customer Reviews */}
              <div className="mt-4 border-top pt-3">
                <h5 className="fw-bold">Customer Reviews</h5>
                {['User123', 'Shopaholic'].map((user, idx) => (
                  <div className="review d-flex mb-3" key={idx}>
                    <div className="review-author me-3 text-center">
                      <i className="bi bi-person-circle fs-3 text-secondary"></i>
                      <p className="text-muted mb-0">{user}</p>
                    </div>
                    <div className="review-content flex-grow-1">
                      <div className="text-warning mb-1">
                        {[...Array(5)].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                      </div>
                      <p className="mb-0">{user === 'User123' ? 'Great product! Exactly as described and arrived quickly.' : 'Excellent value for money. Highly recommend!'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-4 mt-5 w-100">
          <div className="container-fluid">
            <p>&copy; 2025 JioMart. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
