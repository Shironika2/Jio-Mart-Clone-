import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './HomePage.css'; // Updated CSS

// Import new components
import CategoryNav from '../categories/CategoryNav'; // Adjusted path
import BannerSection from './BannerSection'; // Adjusted path
import ScrollingImagesSection from './ScrollingImagesSection'; // Adjusted path
import ProductSection from '../products/ProductSection'; // Adjusted path
import type { Product, CategoryProductData} from "../../types";

// Import the AppFooter component
import AppFooter from '../common/AppFooter'; // Adjusted path

// Define interfaces for product data and cart items


export default function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<CategoryProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 


  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesResp = await fetch('https://fakestoreapi.com/products/categories');
        if (!categoriesResp.ok) throw new Error('Failed to fetch categories');
        const fetchedCategories: string[] = await categoriesResp.json();
        
        //const normalized = fetchedCategories.map(c => c.toLowerCase() === 'jewellery' ? 'jewelery' : c);
        const limited = fetchedCategories.slice(0, 4); 
        setCategories(limited);

        const prodByCat: CategoryProductData[] = [];
        for (const category of limited) {
          const resp = await fetch(`https://fakestoreapi.com/products/category/${category}`);
          if (!resp.ok) throw new Error(`Failed to fetch products for ${category}`);
          const items: Product[] = await resp.json();
          prodByCat.push({ categoryName: category, items: items.slice(0, 10) }); // Limit products per category
        }
        setProducts(prodByCat);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handlers for user interactions
  const handleProductClick = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    // Navigate to the category page to display products for the selected category
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 px-0" style={{ width: '100vw' }}>
        {/* Shop by Category Section */}
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Banner Image Section */}
        <BannerSection />

        {/* Scrolling Images Section */}
        <ScrollingImagesSection />

        {/* Product Sections */}
        <ProductSection
          products={products}
          categories={categories}
          loading={loading}
          error={error}
          // Removed likedProducts, onLikeToggle, onAddToCart, onBuyNow props
          onViewAllClick={handleCategoryClick} // Use the same handler for "View All"
          onProductClick={handleProductClick} // Pass the product click handler
        />
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}
