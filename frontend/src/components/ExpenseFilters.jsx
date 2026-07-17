import React from 'react';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

const ExpenseFilters = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      from: '',
      to: '',
      search: '',
    });
  };

  return (
    <div className="glass-panel filters-card">
      <div className="filters-grid">
        <div className="input-group">
          <label className="input-label" htmlFor="search">Search Title</label>
          <input
            id="search"
            type="text"
            className="input-field"
            placeholder="e.g. Groceries..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            className="input-field"
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="from">From Date</label>
          <input
            id="from"
            type="date"
            className="input-field"
            value={filters.from || ''}
            onChange={(e) => handleChange('from', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="to">To Date</label>
          <input
            id="to"
            type="date"
            className="input-field"
            value={filters.to || ''}
            onChange={(e) => handleChange('to', e.target.value)}
          />
        </div>

        <button onClick={handleReset} className="btn btn-secondary btn-reset">
          Reset
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilters;
