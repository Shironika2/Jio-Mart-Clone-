import React, { useRef, useEffect } from 'react';
import './ScrollingImageSection.css'; // import the CSS file
import scroll1 from '../../assets/scroll1.png';
import scroll2 from '../../assets/Scroll2.png';
import scroll3 from '../../assets/Scroll3.png';
import scroll5 from '../../assets/Scroll5.png';
import scroll6 from '../../assets/Scroll6.png';

const ScrollingImagesSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollImages = [scroll1, scroll2, scroll3, scroll5, scroll6];

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="scrolling-images-section">
      <button className="scroll-arrow left-arrow" onClick={scrollLeft}>
        <i className="bi bi-chevron-left"></i>
      </button>

      <div className="scroll-container" ref={scrollContainerRef}>
        {scrollImages.map((imgSrc, i) => (
          <img key={i} src={imgSrc} alt={`Scroll Image ${i + 1}`} className="scroll-image" />
        ))}
      </div>

      <button className="scroll-arrow right-arrow" onClick={scrollRight}>
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

export default ScrollingImagesSection;
