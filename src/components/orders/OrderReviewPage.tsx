import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import StepIndicator from "../orders/StepIndicator"; // Updated import path
import CartStep from "../orders/CartStep"; // Updated import path
import DeliveryAddressStep from "../orders/DeliveryAddressStep"; // Updated import path
import PaymentStep from "../orders/PaymentStep"; // Updated import path
import SuccessStep from "../orders/SuccessStep"; // Updated import path

import type { Product,  Order} from "../../types/index"; // Adjusted path for types


export default function OrderReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  

    const singleProduct = location.state?.product as Product | undefined;
    const singleQuantity = location.state?.quantity || 1;

    // Ensure cartItems state uses the Product type imported from ../../types/index
    // The type Product is imported at the top of the file.
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [step, setStep] = useState(1);


  const [savedAddress, setSavedAddress] = useState<string | null>(null);


  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const availableCoupons = [
    { code: "JIO10", type: "percent", value: 10 },
    { code: "SAVE50", type: "flat", value: 50 },
    { code: "FREESHIP", type: "flat", value: 30 },
  ];

  // ------------------ Load Cart & Saved Address ------------------
  useEffect(() => {
    // Single product Buy Now
    if (singleProduct) {
      setCartItems([{ ...singleProduct, quantity: singleQuantity }]);
    } else {
      const stored = localStorage.getItem("cartItems");
      if (stored) setCartItems(JSON.parse(stored));
    }

    const saved = localStorage.getItem("savedAddress");
    if (saved) setSavedAddress(saved);

    // Reset coupon for new order
    setAppliedCoupon(null);
    setCouponDiscount(0);
  }, [singleProduct, singleQuantity]);

  const mrpTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productDiscount = 0;
  //const total = mrpTotal - productDiscount - couponDiscount;

  // ------------------ Authentication ------------------
  const isLoggedIn = !!localStorage.getItem("userMobile"); // Check if user signed in

  const requireLogin = (callback: () => void) => {
    if (!isLoggedIn) {
      alert("Please sign in to continue.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    callback();
  };


  // ------------------ Step Handlers ------------------
  const handlePlaceOrder = () => requireLogin(() => setStep(2));

 

  const handleMakePayment = (method: "COD" | "UPI") =>
    requireLogin(() => {
      if (!savedAddress) return alert("Please add address first.");

      const completeOrder = () => {
        setOrderSuccess(true);
        setStep(4);

        // Save order to purchaseHistory
        const existingOrders = JSON.parse(localStorage.getItem("purchaseHistory") || "[]");
        const orderId = `ORD-${Date.now()}`;
        const orderDate = new Date().toLocaleDateString();
        const newOrder: Order = { // Explicitly type newOrder as Order
          orderId,
          orderDate,
          // Ensure items use the correct Product type from the imported types
          items: cartItems.map((item: Product) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            rating: item.rating || { rate: 0, count: 0 }, // Provide default rating if undefined
            description: item.description || "", // Added missing description, defaulting to empty string
            category: item.category || "Uncategorized", // Added missing category with default
          })),
        };
        const updatedOrders = [...existingOrders, newOrder];
        localStorage.setItem("purchaseHistory", JSON.stringify(updatedOrders));

        if (!singleProduct) localStorage.removeItem("cartItems");

        // Mark coupon as used
        const appliedCoupon = localStorage.getItem("appliedCoupon");
        if (appliedCoupon) {
          const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
          if (!usedCoupons.includes(appliedCoupon)) usedCoupons.push(appliedCoupon);
          localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
          localStorage.removeItem("appliedCoupon");
          setAppliedCoupon(null);
          setCouponDiscount(0);
        }
      };

      if (method === "UPI") {
        setIsProcessing(true);
        setTimeout(() => {
          setIsProcessing(false);
          completeOrder();
        }, 4000);
      } else {
        completeOrder();
      }
    });

  const handleContinueShopping = () => navigate("/");

  const handleApplyCoupon = () => {
    if (!couponCode) return;

    const storedCoupons = JSON.parse(localStorage.getItem("usedCoupons") || "[]");
    if (storedCoupons.includes(couponCode.toUpperCase()))
      return alert("You have already used this coupon!");

    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase());
    if (!coupon) return alert("Invalid coupon code");

    let discount = 0;
    if (coupon.type === "percent") discount = (mrpTotal * coupon.value) / 100;
    else discount = coupon.value;

    setCouponDiscount(discount);
    setAppliedCoupon(coupon.code);
    localStorage.setItem("usedCoupons", JSON.stringify([...storedCoupons, coupon.code]));
    localStorage.setItem("appliedCoupon", coupon.code);
    localStorage.setItem("couponDiscount", discount.toString());
    alert(`Coupon ${coupon.code} applied! Discount: ₹${discount.toFixed(2)}`);
  };

  const StepWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ width: "100vw", maxWidth: "100%", padding: "2rem", boxSizing: "border-box" }}>
      {children}
    </div>
  );

  return (
    <div className="bg-light w-100 min-vh-100">
  <StepWrapper>
    <div className="container-fluid px-5 py-4">
      {/* Header Row: Show only for step 1 and 2 */}
      {(step === 1 || step === 2) && (
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <h3 className="fw-bold mb-0" style={{ color: "#000" }}>
            My Cart
          </h3>
          <div className="flex-shrink-0">
            <StepIndicator step={step} />
          </div>
        </div>
      )}

      {/* Step 1: Cart */}
      {step === 1 && (
        <CartStep
          cartItems={cartItems}
          setCartItems={setCartItems}
          mrpTotal={mrpTotal}
          productDiscount={productDiscount}
          couponDiscount={couponDiscount}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          setCouponCode={setCouponCode}
          handlePlaceOrder={handlePlaceOrder}
        />
      )}

      {/* Step 2: Delivery */}
      {step === 2 && (
        <DeliveryAddressStep
          cartItems={cartItems}
          setCartItems={setCartItems}
          mrpTotal={mrpTotal}
          productDiscount={productDiscount}
          couponDiscount={couponDiscount}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          setCouponCode={setCouponCode}
          onProceedToPayment={() => setStep(3)}
        />
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <PaymentStep
          mrpTotal={mrpTotal}
          productDiscount={productDiscount}
          couponDiscount={couponDiscount}
          couponCode={couponCode}
          appliedCoupon={appliedCoupon}
          handleApplyCoupon={handleApplyCoupon}
          setCouponCode={setCouponCode}
          handleMakePayment={handleMakePayment}
          isProcessing={isProcessing}
          savedAddress={savedAddress}
        />
      )}

      {/* Step 4: Success */}
      {step === 4 && orderSuccess && (
        <SuccessStep handleContinueShopping={handleContinueShopping} />
      )}
    </div>
  </StepWrapper>

  <footer className="bg-dark text-white text-center py-3 mt-5 w-100">
    <p className="mb-0">&copy; 2025 JioMart. All rights reserved.</p>
  </footer>
</div>

  );
}
