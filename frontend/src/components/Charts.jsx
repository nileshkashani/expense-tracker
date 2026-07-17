import React from 'react';

const CATEGORY_COLORS = {
  Food: '#065f46',
  Transport: '#334155',
  Housing: '#0369a1',
  Utilities: '#5b21b6',
  Entertainment: '#92400e',
  Health: '#0f766e',
  Shopping: '#3730a3',
  Other: '#52525b',
};

const Charts = ({ summary }) => {
  const byCategory = summary?.byCategory || [];
  const totalSpent = summary?.totalSpent || 0;

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  // If no data, display empty state
  if (byCategory.length === 0) {
    return (
      <div className="charts-grid">
        <div className="glass-panel chart-card">
          <h4 className="chart-title">Category Breakdown</h4>
          <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
            <p>Add some expenses to see visual insights.</p>
          </div>
        </div>
        <div className="glass-panel chart-card">
          <h4 className="chart-title">Spending Intensity</h4>
          <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <p>Add some expenses to see visual insights.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- SVG Donut Calculations ---
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~314.16

  // Calculate percentages and accumulate angles
  let accumulatedPercentage = 0;
  const donutSegments = byCategory.map((cat) => {
    const amount = cat.total;
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    const strokeDashArray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashOffset = -((accumulatedPercentage / 100) * circumference);
    
    accumulatedPercentage += percentage;

    return {
      category: cat.category,
      amount,
      percentage,
      strokeDashArray,
      strokeDashOffset,
      color: CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Other,
    };
  });

  // --- Bar Chart Calculations ---
  // We want to scale bars relative to the category with the HIGHEST spending (so it reaches 100% width)
  const maxCategoryTotal = Math.max(...byCategory.map((c) => c.total), 1);

  return (
    <div className="charts-grid">
      {/* Donut Chart Card */}
      <div className="glass-panel chart-card">
        <h4 className="chart-title">Category Breakdown</h4>
        
        <div className="donut-container">
          <svg className="donut-svg" viewBox="0 0 160 160">
            <circle
              className="donut-hole"
              cx="80"
              cy="80"
              r={radius}
            />
            <circle
              className="donut-underlay"
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            {donutSegments.map((segment, idx) => (
              <circle
                key={idx}
                className="donut-segment"
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth="8"
                strokeDasharray={segment.strokeDashArray}
                strokeDashoffset={segment.strokeDashOffset}
                title={`${segment.category}: ${segment.percentage.toFixed(1)}%`}
              />
            ))}
          </svg>
          <div className="donut-text">
            <span className="donut-text-amount">{formatCurrency(totalSpent)}</span>
            <span className="donut-text-label">Total spent</span>
          </div>
        </div>

        <div className="chart-legends">
          {donutSegments.map((segment, idx) => (
            <div className="legend-item" key={idx}>
              <div className="legend-color" style={{ backgroundColor: segment.color }}></div>
              <div className="legend-info">
                <span className="legend-name">{segment.category}</span>
                <span className="legend-val">{segment.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="glass-panel chart-card">
        <h4 className="chart-title">Spending Intensity</h4>
        
        <div className="bar-chart-container">
          {byCategory.map((cat, idx) => {
            const color = CATEGORY_COLORS[cat.category] || CATEGORY_COLORS.Other;
            const percentOfMax = (cat.total / maxCategoryTotal) * 100;
            const percentOfTotal = totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0;
            
            return (
              <div className="bar-item" key={idx}>
                <div className="bar-header">
                  <span className="bar-name">{cat.category}</span>
                  <span className="bar-amount-percent">
                    {formatCurrency(cat.total)} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 400 }}>({percentOfTotal.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${percentOfMax}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}33`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Charts;
