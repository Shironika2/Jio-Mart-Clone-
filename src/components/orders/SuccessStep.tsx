import React from "react";
import type { Product, CartItem,SuccessStepProps } from "../../types"; // Adjusted path for types



export default function SuccessStep({ handleContinueShopping }: SuccessStepProps) {
  return (
    <div className="text-center py-5 w-100">
      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
      <h3 className="mt-3 text-success">Order Confirmed!</h3>
      <p>Your payment was successful. Thank you for shopping with us.</p>
      <button className="btn btn-primary btn-lg mt-3" onClick={handleContinueShopping}>
        Continue Shopping
      </button>
    </div>
  );
}
