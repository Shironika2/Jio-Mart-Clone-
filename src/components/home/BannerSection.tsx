import React from 'react';
import banner from '../../assets/banner.png'; // Adjusted path for banner image

const BannerSection: React.FC = () => {
  return (
    <div className=" mb-4 px-5">
      <img
        src={banner}
        alt="Banner"
        className="img-fluid rounded shadow-sm w-100"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default BannerSection;
