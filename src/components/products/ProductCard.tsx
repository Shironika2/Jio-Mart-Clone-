import React from "react";
import type { ProductCardProps, Product } from "../../types";
import { useLike } from "../../hooks/useLike";
import { useAddToCart } from "../../hooks/useAddToCart";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  cardWidth = "200px"
}) => {
  // Ensure product.id is treated as a string for consistency with hooks
  const productIdString = String(product.id);

  const { likedProducts, toggleLike } = useLike();
  const { addToCart } = useAddToCart();

  return (
    <div
      className="card product-card flex-shrink-0"
      style={{ width: cardWidth, cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="position-relative">
        <img
          src={product.image}
          className="card-img-top p-3"
          alt={product.title}
          style={{ height: "100px", objectFit: "contain" }}
        />
        <span
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the card's main onClick
            toggleLike(productIdString);
          }}
          className="position-absolute top-0 end-0 p-2"
          style={{
            cursor: "pointer",
            fontSize: "1.2em",
            color: likedProducts.has(productIdString) ? "red" : "black",
          }}
        >
          ♡
        </span>
      </div>
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1 ">
          {product.title.length > 25 ? product.title.substring(0, 25) + "..." : product.title}
        </h6>
        <p className="card-text text-success mb-2">
          ₹{product.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>
        <button
          className="btn btn-add w-100 mt-auto"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the card's main onClick
            // Pass the product object, ensuring its ID is handled correctly by the hook.
            // If the hook expects a string ID, it should handle the conversion or the Product type should be adjusted.
            // For now, we pass the product object as is, assuming the hook can manage it or the Product type is consistent.
            addToCart(product);
          }}
        >
          Add
        </button>
        
      </div>
    </div>
  );
};

export default ProductCard;
