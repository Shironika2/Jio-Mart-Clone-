import React from "react";
import PaymentCard from "./PaymentCard"; // Updated path
import ProductList from "../products/ProductList";
import type { CartItem, CartStepProps } from "../../types/index"; 

export default function CartStep({
  cartItems,
  setCartItems,
  mrpTotal,
  productDiscount,
  couponDiscount,
  couponCode,
  appliedCoupon,
  handleApplyCoupon,
  setCouponCode,
  handlePlaceOrder,
}: CartStepProps) {
  // ----------- Quantity Handlers with localStorage Sync ----------
  const handleIncreaseQty = (productId: number) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      // ✅ Sync with localStorage
      localStorage.setItem("cartItems", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated")); // update dropdown
      return updated;
    });
  };

  const handleDecreaseQty = (productId: number) => {
    setCartItems(prev => {
      const updated = prev
        .map(item => {
          if (item.id === productId) {
            if (item.quantity === 1) return null; // remove if qty = 1
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      // ✅ Sync with localStorage
      localStorage.setItem("cartItems", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated")); // update dropdown
      return updated;
    });
  };

  return (
    <div className="row g-3">
      <div className="col-lg-8 col-md-12">
        <div className="card p-4 mb-3 w-100">
          <h4 className="fw-bold mb-3">Quick Basket</h4>
          <div className="alert alert-success">
            Yay! You get Free delivery with this Basket
          </div>

          {/* Pass qty handlers to ProductList */}
          <ProductList
            cartItems={cartItems}
            setCartItems={setCartItems}
            onIncreaseQty={handleIncreaseQty}
            onDecreaseQty={handleDecreaseQty}
          />
        </div>
      </div>

      <div className="col-lg-4 col-md-12 d-flex flex-column">
        <PaymentCard
          mrpTotal={mrpTotal}
          productDiscount={productDiscount}
          couponDiscount={couponDiscount}
          step={1} // Assuming this is step 1
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          setCouponCode={setCouponCode}
        />
        <button
          className="btn btn-primary btn-lg mt-3"
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
