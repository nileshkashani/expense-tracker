import React from 'react';

const ExpenseList = ({ expenses, onEdit, onDelete, onAddNewClick }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="glass-panel expense-section">
      <div className="section-header">
        <h3 className="section-title">Transactions</h3>
        <span className="expense-count">{expenses.length} total</span>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <p>No expenses found. Reset your filters or log a new transaction.</p>
          <button className="btn btn-primary" onClick={onAddNewClick}>
            Add First Expense
          </button>
        </div>
      ) : (
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const categoryClass = expense.category ? expense.category.toLowerCase() : 'other';
                return (
                  <tr key={expense._id} className="expense-row">
                    <td className="expense-title-cell">{expense.title}</td>
                    <td>
                      <span className={`category-badge ${categoryClass}`}>
                        {expense.category || 'Other'}
                      </span>
                    </td>
                    <td>{formatDate(expense.date)}</td>
                    <td className="notes-cell" title={expense.notes}>
                      {expense.notes || '—'}
                    </td>
                    <td className="expense-amount-cell" style={{ color: 'var(--text-main)' }}>
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => onEdit(expense)}
                        className="action-icon-btn edit"
                        title="Edit Transaction"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="action-icon-btn delete"
                        title="Delete Transaction"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
