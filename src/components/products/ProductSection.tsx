import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import type { ProductSectionProps, Product, CategoryProductData } from '../../types'; // Import types, CartItem is not directly used here
import { useLike } from '../../hooks/useLike'; // Import useLike hook
import { useAddToCart } from '../../hooks/useAddToCart'; // Import useAddToCart hook

const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  categories,
  loading,
  error,
  onViewAllClick,
  onProductClick,
}) => {
  // Initialize hooks
  const { likedProducts, toggleLike } = useLike();
  const { addToCart } = useAddToCart();

  // Handler for Buy Now functionality
  const handleBuyNow = (product: Product) => {
    // For now, just alert the user. In a real app, this would likely add to cart and navigate to checkout.
    alert(`Buy Now clicked for ${product.title}! (Proceeding to checkout would happen here)`);
  };

  return (
    <div className="product-sections-container">
      {loading && <div className="text-center my-5"><div className="spinner-border text-primary" role="status" /><p>Loading...</p></div>}
      {error && <div className="alert alert-danger text-center my-5">{error}</div>}

      {!loading && !error && products.length > 0 &&
        categories.map((cat, idx) => {
          // Find product data for the current category
          const catData = products.find(p => p.categoryName === cat);
          // Skip if no data or empty items for this category
          if (!catData || !catData.items.length) return null;
          
          return (
            <div key={idx} className="category-section mb-5 p-3 rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="category-title mb-0">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h2>
                <button className="btn btn-link btn-sm" onClick={() => onViewAllClick(cat)}>View All</button>
              </div>
              <div className="d-flex overflow-auto gap-3 hide-scrollbar pb-2">
                {catData.items.map(p => (
                  <ProductCard
                    key={p.id}
                    product={{
                      ...p,
                      category: p.category || "Uncategorized" // Ensure category is a string
                    }}
                    likedProducts={likedProducts}
                    onLikeToggle={toggleLike}
                    onAddToCart={addToCart}
                    onBuyNow={handleBuyNow}
                    onClick={() => onProductClick(p.id)} // Pass the product ID to the handler
                    cardWidth="200px" // Consistent width for cards
                  />
                ))}
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default ProductSection;
