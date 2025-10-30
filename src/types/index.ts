// Interface for a product
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  description: string; // Added description
  category: string;
  rating: { rate: number; count: number }; // Made rating required
}

// Interface for an item within an order
// This interface extends Product, inheriting its properties including description and category.
export interface OrderItem extends Product {
  quantity: number;
   
}

// Interface for a complete order
export interface Order {
  orderId: string;
  orderDate: string;
  items: OrderItem[];
}

// Interface for an item in the cart
// Based on usage in Orders.tsx, CartItem includes rating.
// Based on usage in ProductPage.tsx, CartItem does not include description or category.
export interface CartItem extends Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  
  rating: { // Not optional
    rate: number;
    count: number;
  };
}

// Interface for product data grouped by category
export interface CategoryProductData {
  categoryName: string;
  items: Product[];
}
export interface Coupon {
  code: string;
  description: string;
  expiry: string;
  discount: string;
  isUsed?: boolean;
}
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQTopic {
  title: string;
  items: FAQItem[];
}
export interface SignOutConfirmationProps {
  onConfirmSignOut: () => void;
  onCancelSignOut: () => void;
  isOpen: boolean; // Prop to control visibility
}
export interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onCategoryClick: (category: string) => void;
}
export interface SearchBarProps {
  onSearch: (query: string) => void;
}
export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
export interface CartStepProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  mrpTotal: number;
  productDiscount: number;
  couponDiscount: number;
  couponCode: string;
  appliedCoupon: string | null;
  handleApplyCoupon: () => void;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  handlePlaceOrder: () => void;
}
export interface ProductListProps {
  cartItems: Product[];
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
  onIncreaseQty?: (productId: number) => void;
  onDecreaseQty?: (productId: number) => void;
}
export interface DeliveryAddressFormProps {
  savedAddress: string | null;
  editAddress: boolean;
  setEditAddress: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveAddress: () => void;
  street: string;
   handleEditAddress?: () => void;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
  pincode: string;
  setPincode: React.Dispatch<React.SetStateAction<string>>;
  district: string;
  setDistrict: React.Dispatch<React.SetStateAction<string>>;
  stateField: string;
  setStateField: React.Dispatch<React.SetStateAction<string>>;
}
export interface DeliveryAddressStepProps {
  cartItems: Product[];
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
  mrpTotal: number;
  productDiscount: number;
  couponDiscount: number;
  couponCode: string;
  appliedCoupon: string | null;
  handleApplyCoupon: () => void;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;

  // Callback to move to payment step (instead of exposing setStep)
  onProceedToPayment: () => void;
}

export interface PaymentCardProps {
  mrpTotal: number;
  productDiscount: number;
  couponDiscount: number;
  step: number;
  couponCode: string;
  appliedCoupon: string | null;
  handleApplyCoupon: () => void;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
}
export interface PaymentStepProps {
  mrpTotal: number;
  productDiscount: number;
  couponDiscount: number;
  couponCode: string;
  appliedCoupon: string | null;
  handleApplyCoupon: () => void;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  handleMakePayment: (method: "COD" | "UPI") => void;
  isProcessing: boolean;
  savedAddress: string | null;
}
export interface SuccessStepProps {
  handleContinueShopping: () => void;
}
export interface StepIndicatorProps {
  step: number;
}
export interface ProductCardProps {
  product: Product;
  likedProducts: Set<string>; // Changed to string to match useLike hook
  onLikeToggle: (productId: string) => void; // Changed to string to match useLike hook
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void; // Added prop for Buy Now functionality
  onClick: () => void;
  cardWidth?: string; // optional for responsive sizes
}
export interface ProductSectionProps {
  products: CategoryProductData[];
  categories: string[];
  loading: boolean;
  error: string | null;
  onViewAllClick: (category: string) => void;
  onProductClick: (id: number) => void; // Added prop to handle product clicks
}
export interface DeliveryLocationSelectorProps {
  onAddressSelect: (address: string) => void;
  selectedAddress: string;
}