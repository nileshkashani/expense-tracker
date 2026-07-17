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
        <div className="empty-state">
          <div className="empty-icon">💸</div>
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
                        📝
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="action-icon-btn delete"
                        title="Delete Transaction"
                      >
                        🗑️
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
