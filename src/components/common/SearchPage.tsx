import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//import './HomePage.css'; // Reuse styling from HomePage
import type { Product, SearchParams } from "../../types";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  const parseQueryParams = (queryString: string): SearchParams => {
    const params = new URLSearchParams(queryString);
    const query = params.get('q') || undefined;
   const category = params.get('category') || undefined;
   // const minPrice = params.get('minPrice') ? parseFloat(params.get('minPrice')!) : undefined;
   // const maxPrice = params.get('maxPrice') ? parseFloat(params.get('maxPrice')!) : undefined;
    return { query, category };
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const currentSearchParams = parseQueryParams(location.search);
    setSearchParams(currentSearchParams);
    fetchAllProducts();
  }, [location.search]);

  useEffect(() => {
    if (loading) return;
    let results = [...products];

    if (searchParams.query) {
      const lowerCaseQuery = searchParams.query.toLowerCase();
      results = results.filter(
        (product) =>
          product.title.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (searchParams.category) {
      const normalizedApiCategory =
        searchParams.category.toLowerCase() === 'jewellery'
          ? 'jewelery'
          : searchParams.category.toLowerCase();
      results = results.filter(
        (product) => product.category.toLowerCase() === normalizedApiCategory
      );
    }

    // if (searchParams.minPrice !== undefined) {
    //   results = results.filter((product) => product.price >= searchParams.minPrice!);
    // }

    // if (searchParams.maxPrice !== undefined) {
    //   results = results.filter((product) => product.price <= searchParams.maxPrice!);
    // }

    setFilteredProducts(results);
  }, [products, searchParams, loading]);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Full-width container */}
      <div className="flex-grow-1" style={{ width: '100vw', margin: 0, padding: 0 }}>
        <h2 className="mb-4">Search Results</h2>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading search results...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center my-5">{error}</div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center my-5">
            <p>No products found matching your criteria.</p>
            <p>Try a different search term or adjust your filters.</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="d-flex flex-wrap gap-3 hide-scrollbar pb-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card product-card flex-shrink-0"
                style={{ width: '150px', cursor: 'pointer' }}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="position-relative">
                  <img
                    src={product.image}
                    className="card-img-top p-3"
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title mb-1 fw-bold">
                    {product.title.length > 25
                      ? product.title.substring(0, 25) + '...'
                      : product.title}
                  </h6>
                  <p className="card-text text-success mb-2">${product.price}</p>
                  <small className="text-muted">
                    <i className="bi bi-star-fill text-warning"></i> {product.rating.rate} ({product.rating.count})
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-5 w-100">
        <p className="mb-0">&copy; 2023 JioMart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SearchPage;
