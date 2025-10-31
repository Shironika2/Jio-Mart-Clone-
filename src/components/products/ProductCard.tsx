import React from "react";
import type { ProductCardProps } from "../../types";
import { useLike } from "../../hooks/useLike";
import { useAddToCart } from "../../hooks/useAddToCart";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  cardWidth = "200px",
}) => {
  const productIdString = String(product.id);
  const { likedProducts, toggleLike } = useLike();
  const { addToCart } = useAddToCart();

  const isLiked = likedProducts.has(productIdString);

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
        <i
          className={`bi ${isLiked ? "bi-heart-fill text-danger" : "bi-heart"}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            toggleLike(productIdString);
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "pointer",
            fontSize: "1.3rem",
            transition: "color 0.3s ease",
          }}
        ></i>
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1">
          {product.title.length > 25
            ? product.title.substring(0, 25) + "..."
            : product.title}
        </h6>
        <p className="card-text text-success mb-2">
          ₹{product.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </p>
        <button
          className="btn btn-add w-100 mt-auto"
          onClick={(e) => {
            e.stopPropagation();
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
