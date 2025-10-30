import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignInPage from './components/account/SignInPage';
//import AccountSetup from './components/AccountSetup';
//import SignUp from './components/account/SignUp';
import HomePage from './components/home/HomePage';
import MyAccountPage from './components/account/MyAccountPage';
import ProductPage from './components/products/ProductPage';
import OrderReviewPage from './components/orders/OrderReviewPage';
import Navbar from './components/common/Navbar';
import SearchPage from './components/common/SearchPage';
import Orders from './components/orders/Orders';
import MyWishlist from './components/account/MyWishlist';
import Delivery from './components/account/Delivery';
import CategoryPage from './components/categories/CategoryPage';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
     
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/order-review" element={<OrderReviewPage />} />
          <Route path="/search" element={<SearchPage />} /> {/* ✅ Added search route */}
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/wishlist" element={<MyWishlist />} />
          <Route path="/delivery-addresses" element={<Delivery />} />
        </Routes>
     </>
  );
};

export default App;
