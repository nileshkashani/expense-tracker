import React from 'react';

const CATEGORY_COLORS = {
  Food: '#f87171',
  Transport: '#fbbf24',
  Housing: '#38bdf8',
  Utilities: '#c084fc',
  Entertainment: '#f472b6',
  Health: '#2dd4bf',
  Shopping: '#818cf8',
  Other: '#a3a3a3',
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
          <div className="empty-state">
            <span className="empty-icon">📊</span>
            <p>Add some expenses to see visual insights.</p>
          </div>
        </div>
        <div className="glass-panel chart-card">
          <h4 className="chart-title">Spending Intensity</h4>
          <div className="empty-state">
            <span className="empty-icon">📈</span>
            <p>Add some expenses to see visual insights.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- SVG Donut Calculations ---
  const radius = 50;
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
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="18"
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
                strokeWidth="18"
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
