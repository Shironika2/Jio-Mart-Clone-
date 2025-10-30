import React from "react";
import PaymentCard from "../orders/PaymentCard";
import type { Product, CartItem ,PaymentStepProps} from "../../types"; // Adjusted path for types



export default function PaymentStep({
  mrpTotal,
  productDiscount,
  couponDiscount,
  couponCode,
  appliedCoupon,
  handleApplyCoupon,
  setCouponCode,
  handleMakePayment,
  isProcessing,
  savedAddress,
}: PaymentStepProps) {
  const total = mrpTotal - productDiscount - couponDiscount;

  return (
    <div className="w-100 d-flex justify-content-center align-items-center py-5 bg-white">
      <div className="card p-5 shadow-lg text-center w-100" style={{ maxWidth: "700px" }}>
        <h3 className="fw-bold mb-4">Choose Payment Method</h3>
        <PaymentCard
          mrpTotal={mrpTotal}
          productDiscount={productDiscount}
          couponDiscount={couponDiscount}
          step={3} // This is step 3
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          setCouponCode={setCouponCode}
        />
        <button
          className="btn btn-outline-primary btn-lg mb-3 w-100"
          onClick={() => handleMakePayment("UPI")}
          disabled={!savedAddress}
        >
          <i className="bi bi-qr-code-scan me-2"></i> UPI Payment
        </button>
        <button
          className="btn btn-outline-success btn-lg w-100"
          onClick={() => handleMakePayment("COD")}
          disabled={!savedAddress}
        >
           Cash on Delivery
        </button>
        {isProcessing && (
          <div className="mt-4 text-center">
            <h5>Scan this QR to pay</h5>
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=test@upi"
              alt="QR Code"
              className="my-3"
            />
            <p>Processing payment...</p>
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}
      </div>
    </div>
  );
}
