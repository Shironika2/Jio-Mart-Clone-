import React from "react";

import type { ProductListProps} from "../../types/index"; 



export default function ProductList({ cartItems, setCartItems, onIncreaseQty, onDecreaseQty }: ProductListProps) {
  return (
    <>
      {cartItems.map((product) => (
        <div
          key={product.id}
          className="d-flex align-items-center border p-3 rounded mb-3 bg-white w-100"
        >
          <img
            src={product.image}
            alt={product.title}
            className="img-thumbnail me-3"
            style={{ width: 80, height: 80}}
          />
          <div className="flex-grow-1">
            <h5>{product.title}</h5>
            <p className="text-muted mb-1">
              ₹{product.price.toFixed(2)} x {product.quantity}
            </p>
            <p className="fw-bold mb-0">
              Total: ₹{(product.price * product.quantity).toFixed(2)}
            </p>
            <div className="d-flex align-items-center mt-2">
              <label className="me-2">Qty:</label>
              <div className="d-flex">
                <button
                  className="btn btn-outline-secondary btn-sm px-2 py-1"
                  style={{ width: 24, height: 24, fontSize: '12px',marginTop: 6 }} 
                  onClick={() => onDecreaseQty && onDecreaseQty(product.id)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control mx-1 text-center"
                  style={{ width: 50 }}
                  value={product.quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary btn-sm px-2 py-1"
                  style={{ width: 24, height: 24, fontSize: '12px' ,marginTop: 6 }} 
                  onClick={() => onIncreaseQty && onIncreaseQty(product.id)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
