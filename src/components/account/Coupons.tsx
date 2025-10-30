import React, { useState, useEffect } from 'react';
import type { Coupon } from "../../types";

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'JIO10', description: 'Get 10% off on orders above ₹500', expiry: '2025-12-31', discount: '10%', isUsed: false },
    { code: 'FREESHIP', description: 'Free delivery on orders above ₹300', expiry: '2025-11-30', discount: 'Free Shipping', isUsed: false },
    { code: 'SAVE50', description: '₹50 off on orders above ₹400', expiry: '2025-10-31', discount: '₹50', isUsed: false },
  ]);

  // 🟩 Load used coupons from localStorage when component mounts
  useEffect(() => {
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons') || '[]');
    setCoupons((prevCoupons) =>
      prevCoupons.map((c) =>
        usedCoupons.includes(c.code) ? { ...c, isUsed: true } : c
      )
    );
  }, []);

  // 🟨 Calculate counts
  const availableCoupons = coupons.filter((c) => !c.isUsed).length;
  const myCoupons = coupons.filter((c) => c.isUsed).length;
 const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

const expiringSoon = coupons.filter(
  (c) =>
    !c.isUsed && // Only available coupons
    new Date(c.expiry) >= today &&
    new Date(c.expiry) <= nextWeek
).length;



  return (
    <div
      className="mt-4"
      style={{
        width: '80vw',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      {/* ===== Summary Section ===== */}
      <h3 className="mb-4 fw-bold">Coupon Store</h3>

      <div className="d-flex flex-wrap gap-3 mb-4 justify-content-start">
        <div
          className="card shadow-sm p-3 text-center"
          style={{ width: '250px', background: '#f0f8ff', borderRadius: '10px' }}
        >
          <h5 className="text-primary fw-bold mb-1">{availableCoupons}</h5>
          <p className="mb-0 small">Coupons Available</p>
        </div>

        <div
          className="card shadow-sm p-3 text-center"
          style={{ width: '250px', background: '#fffaf0', borderRadius: '10px' }}
        >
          <h5 className="text-warning fw-bold mb-1">{myCoupons}</h5>
          <p className="mb-0 small">Used Coupons</p>
        </div>

        <div
          className="card shadow-sm p-3 text-center"
          style={{ width: '250px', background: '#ffe6e6', borderRadius: '10px' }}
        >
          <h5 className="text-danger fw-bold mb-1">{expiringSoon}</h5>
          <p className="mb-0 small">Expiring Soon</p>
        </div>
      </div>

      {/* ===== Coupon List ===== */}
      <h4 className="mb-3">JioMart Coupons</h4>
      {coupons.map((coupon) => (
        <div
          key={coupon.code}
          className="p-3 mb-2 border rounded d-flex justify-content-between align-items-center shadow-sm bg-white"
          style={{ maxWidth: 700 }}
        >
          <div>
            <strong>{coupon.code}</strong> - {coupon.description}
            <p className="mb-0 text-muted">Expires on: {coupon.expiry}</p>
          </div>
          <span
            className={`badge ${
              coupon.isUsed ? 'bg-secondary' : 'bg-primary'
            }`}
          >
            {coupon.isUsed ? 'Used' : 'Available'}
          </span>
        </div>
      ))}

      {coupons.length === 0 && (
        <p className="text-muted mt-3">No coupons available at the moment.</p>
      )}
    </div>
  );
}
