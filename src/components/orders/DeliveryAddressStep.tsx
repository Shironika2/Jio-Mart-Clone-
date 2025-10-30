import React, { useState, useEffect } from "react";
import DeliveryAddressForm from "../orders/DeliveryAddressForm";
import ProductList from "../products/ProductList";
import PaymentCard from "../orders/PaymentCard";
import type { Product, CartItem, DeliveryAddressStepProps } from "../../types";

export default function DeliveryAddressStep(props: DeliveryAddressStepProps) {
  // ----------------- Step 2 Specific State -----------------
  const [street, setStreet] = useState("");
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [stateField, setStateField] = useState("");
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState(false);

  // ----------------- Load Saved Address -----------------
  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) setSavedAddress(saved);
  }, []);

  // ----------------- Address Handlers -----------------
  const handleSaveAddress = () => {
  // Regex patterns
  const streetRegex = /^[a-zA-Z0-9\s,'-]{3,100}$/; // letters, numbers, spaces, comma, apostrophe, dash
  const districtRegex = /^[a-zA-Z\s]{2,50}$/;       // only letters and spaces
  const stateRegex = /^[a-zA-Z\s]{2,50}$/;          // only letters and spaces
  const pincodeRegex = /^[1-9][0-9]{5}$/;           // Indian pincode: 6 digits, cannot start with 0

  if (!streetRegex.test(street)) return alert("Enter a valid street (3-100 characters).");
  if (!districtRegex.test(district)) return alert("Enter a valid district (letters only).");
  if (!stateRegex.test(stateField)) return alert("Enter a valid state (letters only).");
  if (!pincodeRegex.test(pincode)) return alert("Enter a valid 6-digit pincode.");

  const fullAddress = `${street}, ${district}, ${stateField} - ${pincode}`;
  setSavedAddress(fullAddress);
  localStorage.setItem("savedAddress", fullAddress);
  setEditAddress(false);
};


  const handleEditAddress = () => setEditAddress(true);

  // ----------------- Group Address Props -----------------
  const addressProps = {
    savedAddress,
    editAddress,
    setEditAddress,
    handleSaveAddress,
    street,
    setStreet,
    pincode,
    setPincode,
    district,
    setDistrict,
    stateField,
    setStateField,
  };

  return (
    <div className="row g-3">
      {/* Left Column: Address Form & Cart Items */}
      <div className="col-lg-8 col-md-12">
        <DeliveryAddressForm {...addressProps} />

        <div className="card p-4 mb-3 w-100">
          <h4 className="fw-bold mb-3">Review Items</h4>
          <ProductList
            cartItems={props.cartItems}
            setCartItems={props.setCartItems}
          />
        </div>
      </div>

      {/* Right Column: Payment Summary */}
      <div className="col-lg-4 col-md-12 d-flex flex-column">
        <PaymentCard
          mrpTotal={props.mrpTotal}
          productDiscount={props.productDiscount}
          couponDiscount={props.couponDiscount}
          step={2} // Step indicator
          couponCode={props.couponCode}
          appliedCoupon={props.appliedCoupon}
          handleApplyCoupon={props.handleApplyCoupon}
          setCouponCode={props.setCouponCode}
        />

        {savedAddress && !editAddress && props.onProceedToPayment && (
          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={props.onProceedToPayment} // step change handled by parent
          >
            Make Payment
          </button>
        )}
      </div>
    </div>
  );
}
