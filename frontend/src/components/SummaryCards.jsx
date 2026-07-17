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
          <span>📈</span> Cumulative record
        </span>
      </div>

      <div className="glass-panel summary-card month">
        <span className="summary-label">Spent This Month</span>
        <span className="summary-value">{formatCurrency(monthSpent)}</span>
        <span className="summary-meta">
          <span>📅</span> Starts 1st of month
        </span>
      </div>

      <div className="glass-panel summary-card avg">
        <span className="summary-label">Daily Avg (Last 30 Days)</span>
        <span className="summary-value">{formatCurrency(avgPerDay)}</span>
        <span className="summary-meta">
          <span>⚡</span> Rolling average
        </span>
      </div>

      <div className="glass-panel summary-card top">
        <span className="summary-label">Top Spending Category</span>
        <span className="summary-value">{topCategory}</span>
        <span className="summary-meta">
          <span>🔥</span> {formatCurrency(topCategoryTotal)} total
        </span>
      </div>
    </div>
  );
};

export default SummaryCards;
