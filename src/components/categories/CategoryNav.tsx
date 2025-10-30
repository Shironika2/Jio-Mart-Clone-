import React from 'react';
import type { CategoryNavProps  } from "../../types";


const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => {
  // Displaying categories as per the  HomePage.tsx
  const displayedCategories = categories.slice(0, 4);

  return (
    <div className=" mb-4 p-3">
      <h4 className="mb-3">Shop by Category</h4>
      <div className="d-flex gap-2 overflow-auto hide-scrollbar">
        {displayedCategories.map(c => (
          <button
            key={c}
            className={`btn btn-sm flex-shrink-0 ${
              selectedCategory === c ? 'btn-selected' : 'btn-unselected'
            }`}
            onClick={() => onCategoryClick(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
