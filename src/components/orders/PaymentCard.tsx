import React from "react";
import type { PaymentCardProps} from "../../types"; // Adjusted path for types



export default function PaymentCard({
  mrpTotal,
  productDiscount,
  couponDiscount,
  step,
  couponCode,
  appliedCoupon,
  handleApplyCoupon,
  setCouponCode,
}: PaymentCardProps) {
  const total = mrpTotal - productDiscount - couponDiscount;

  return (
    <div className="card p-3 shadow-sm w-100 mb-3">
      <h5 className="fw-bold">Payment Details</h5>

      <div className="d-flex justify-content-between">
        <span>MRP Total</span> <span>₹{mrpTotal.toFixed(2)}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Product Discount</span> <span className="text-success">- ₹{productDiscount}</span>
      </div>

      {step === 1 && (
        <div className="mb-2 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={!!appliedCoupon}
          />
          <button
            className="btn btn-primary mt-2 w-100"
            onClick={handleApplyCoupon}
            disabled={!!appliedCoupon || !couponCode}
          >
            {appliedCoupon ? "Applied" : "Apply Coupon"}
          </button>
          {appliedCoupon && (
            <p className="text-success mt-2 mb-0">
              Coupon <strong>{appliedCoupon}</strong> applied! Discount: ₹{couponDiscount.toFixed(2)}
            </p>
          )}
        </div>
      )}

      <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
        <span>Total</span> <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
