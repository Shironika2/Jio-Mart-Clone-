import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import type { Product } from "../../types";
import { useAddToCart } from '../../hooks/useAddToCart';
import { useLike } from '../../hooks/useLike'; // <-- Use the hook

export default function MyWishlist() {
  const navigate = useNavigate();
  const { addToCart } = useAddToCart();

  // Use custom hook for liked products
  const { likedProducts: likedIdsSet, toggleLike } = useLike();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product details whenever likedIdsSet changes
  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true);
      setError(null);

      const likedIds = Array.from(likedIdsSet).map(id => Number(id));
      if (likedIds.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        const products = await Promise.all(
          likedIds.map(async (id) => {
            const res = await fetch(`https://fakestoreapi.com/products/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
            return res.json() as Promise<Product>;
          })
        );
        setWishlistProducts(products);
      } catch (err: any) {
        console.error("Error fetching wishlist products:", err);
        setError("Failed to load wishlist items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [likedIdsSet]); // ✅ Re-fetch whenever liked products change

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  return (
    <div className="mt-4" style={{ width: '80vw', padding: '2rem 2rem',marginTop:0 }}>
      <h2 className="mb-3 fw-bold">My Wishlist</h2>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading wishlist...</p>
        </div>
      )}

      {error && <div className="alert alert-danger text-center my-5">{error}</div>}

      {!loading && wishlistProducts.length === 0 && (
        <div className="text-center my-5">
          <p>Your wishlist is empty.</p>
          <p>Explore our products and add items you love!</p>
          <Link to="/" className="btn btn-primary mt-3">Shop Now</Link>
        </div>
      )}

      {!loading && wishlistProducts.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {wishlistProducts.map((product) => {
            const isLiked = likedIdsSet.has(String(product.id)); // check if liked
            return (
              <div className="col" key={product.id}>
                <div className="card h-100 shadow-sm product-card">
                  <img
                    src={product.image}
                    className="card-img-top p-3"
                    alt={product.title}
                    style={{ height: '180px', objectFit: 'contain', cursor: 'pointer' }}
                    onClick={() => handleProductClick(product.id)}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title product-title mb-0">
                        {product.title.substring(0, 30)}...
                      </h5>
                      <button
                        className="btn btn-link p-0"
                        onClick={() => toggleLike(String(product.id))} // unlike
                        style={{
                          color: isLiked ? 'red' : 'gray',
                          fontSize: '1.2em',
                          border: 'none',
                          background: 'none',
                        }}
                      >
                        ❤️
                      </button>
                    </div>
                    <p className="card-text product-price">${product.price}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <small className="text-muted">
                        <i className="bi bi-star-fill text-warning"></i> {product.rating.rate} ({product.rating.count})
                      </small>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
