import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../products/ProductCard";
import type { Product } from "../../types";
import { useLike } from "../../hooks/useLike";
import { useAddToCart } from "../../hooks/useAddToCart";

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const { likedProducts, toggleLike } = useLike();
  const { addToCart } = useAddToCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const apiCategoryName = categoryName ? categoryName.replace(/%20/g, " ") : "";

  // Fetch products by category
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!apiCategoryName) {
        setError("No category specified.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://fakestoreapi.com/products/category/${apiCategoryName}`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const fetchedData: any[] = await response.json();
        const processedData: Product[] = fetchedData.map((item) => ({
          ...item,
          quantity: 1, // Default quantity for cart
          category: item.category || "Uncategorized",
          rating:
            item.rating && typeof item.rating.rate === "number" && typeof item.rating.count === "number"
              ? item.rating
              : { rate: 0, count: 0 },
        }));
        setProducts(processedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [apiCategoryName]);

  // Handle Buy Now action
  const handleBuyNow = (product: Product) => {
    const productWithQuantity: Product = {
      ...product,
      quantity: product.quantity ?? 1,
    };
    localStorage.setItem("buyNowItem", JSON.stringify(productWithQuantity));
    navigate("/checkout");
  };

  if (loading) return <div className="text-center py-4">Loading products...</div>;
  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div
      style={{
        width: "100vw",   // Full viewport width
        marginTop: 0,     // Remove extra top margin
        padding: "2rem",  // Consistent padding
      }}
    >
      <h2 className="mb-4 text-capitalize">Category: {apiCategoryName}</h2>

      {products.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <ProductCard
                product={product}
                likedProducts={likedProducts}
                onLikeToggle={toggleLike}
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
