import React from 'react';

const SummaryCards = ({ summary }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const totalSpent = summary?.totalSpent || 0;
  const monthSpent = summary?.monthSpent || 0;
  const avgPerDay = summary?.avgPerDay || 0;
  const topCategory = summary?.topCategory?.category || 'None';
  const topCategoryTotal = summary?.topCategory?.total || 0;

  return (
    <div className="summary-grid">
      <div className="glass-panel summary-card total">
        <span className="summary-label">Total Balance Spent</span>
        <span className="summary-value">{formatCurrency(totalSpent)}</span>
        <span className="summary-meta">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          Cumulative record
        </span>
      </div>

      <div className="glass-panel summary-card month">
        <span className="summary-label">Spent This Month</span>
        <span className="summary-value">{formatCurrency(monthSpent)}</span>
        <span className="summary-meta">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Starts 1st of month
        </span>
      </div>

      <div className="glass-panel summary-card avg">
        <span className="summary-label">Daily Avg (Last 30 Days)</span>
        <span className="summary-value">{formatCurrency(avgPerDay)}</span>
        <span className="summary-meta">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Rolling average
        </span>
      </div>

      <div className="glass-panel summary-card top">
        <span className="summary-label">Top Spending Category</span>
        <span className="summary-value">{topCategory}</span>
        <span className="summary-meta">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polygon points="12 2 2 22 22 22"></polygon>
          </svg>
          {formatCurrency(topCategoryTotal)} total
        </span>
      </div>
    </div>
  );
};

export default SummaryCards;
