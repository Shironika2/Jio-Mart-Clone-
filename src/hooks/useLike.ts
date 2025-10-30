import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const isUserLoggedIn = (): boolean => {
  const userName = localStorage.getItem('userName');
  const userMobile = localStorage.getItem('userMobile');
  return Boolean((userName && userName.trim() !== '') || (userMobile && userMobile.trim() !== ''));
};

export const useLike = (initialLikedProducts: Set<string> = new Set()) => {
  const navigate = useNavigate();

  const [likedProducts, setLikedProducts] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('likedProducts');
    return saved ? new Set(JSON.parse(saved) as string[]) : initialLikedProducts;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('likedProducts');
      if (saved) setLikedProducts(new Set(JSON.parse(saved) as string[]));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleLike = useCallback(
    (productId: string) => {
      if (!isUserLoggedIn()) {
        alert("Please sign in to like products.");
        navigate('/login');
        return;
      }

      setLikedProducts((prevLikedProducts) => {
        // Merge previous state with localStorage safely
        const saved = localStorage.getItem('likedProducts');
        const currentSet = saved ? new Set(JSON.parse(saved) as string[]) : new Set<string>();
        const newLikedProducts = new Set<string>([...currentSet, ...prevLikedProducts]);

        if (newLikedProducts.has(productId)) {
          newLikedProducts.delete(productId); // Unlike
        } else {
          newLikedProducts.add(productId); // Like
        }

        localStorage.setItem('likedProducts', JSON.stringify(Array.from(newLikedProducts)));

        return newLikedProducts;
      });
    },
    [navigate]
  );

  return { likedProducts, toggleLike };
};
