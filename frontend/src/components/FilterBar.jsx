import React from 'react';
import { SortDesc, Clock, Flame, Hourglass } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ activeSort, onSortChange }) => {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'music', label: 'Music' },
    { id: 'tech', label: 'Tech' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'education', label: 'Education' },
  ];

  const sorts = [
    { id: 'createdAt-desc', label: 'Latest', icon: <Clock size={16} /> },
    { id: 'views-desc', label: 'Popular', icon: <Flame size={16} /> },
    { id: 'duration-desc', label: 'Longest', icon: <Hourglass size={16} /> },
  ];

  return (
    <div className="filter-bar-container">
      <div className="categories-list">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            className={`filter-tag ${cat.id === 'all' ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="sort-group">
        <div className="sort-label">
          <SortDesc size={18} />
          <span>Sort by</span>
        </div>
        <div className="sort-options">
          {sorts.map((sort) => (
            <button
              key={sort.id}
              className={`sort-btn ${activeSort === sort.id ? 'active' : ''}`}
              onClick={() => onSortChange(sort.id)}
            >
              {sort.icon}
              {sort.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
