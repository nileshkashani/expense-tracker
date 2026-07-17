import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

const ExpenseModal = ({ expense, onClose, onSaveSuccess, addToast }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!expense;

  // Initialize fields on open/expense update
  useEffect(() => {
    if (expense) {
      setTitle(expense.title || '');
      setAmount(expense.amount || '');
      setCategory(expense.category || 'Other');
      
      // format date to YYYY-MM-DD for date input
      if (expense.date) {
        const d = new Date(expense.date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDate('');
      }
      
      setNotes(expense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Other');
      
      // Default to today
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      
      setNotes('');
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast('Title is required.', 'error');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast('Amount must be greater than 0.', 'error');
      return;
    }
    if (!date) {
      addToast('Date is required.', 'error');
      return;
    }

    setIsLoading(true);
    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim(),
    };

    try {
      if (isEditMode) {
        await api.updateExpense(expense._id, payload);
        addToast('Expense updated successfully!', 'success');
      } else {
        await api.createExpense(payload);
        addToast('Expense added successfully!', 'success');
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save transaction.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit Transaction' : 'Log Transaction'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label className="input-label" htmlFor="modal-title">Title / Vendor</label>
            <input
              id="modal-title"
              type="text"
              className="input-field"
              placeholder="e.g. Groceries at Whole Foods"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              maxLength={120}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label" htmlFor="modal-amount">Amount (USD)</label>
              <input
                id="modal-amount"
                type="number"
                step="0.01"
                min="0.01"
                className="input-field"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label" htmlFor="modal-category">Category</label>
              <select
                id="modal-category"
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="modal-date">Date</label>
            <input
              id="modal-date"
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="modal-notes">Notes / Descriptions</label>
            <textarea
              id="modal-notes"
              className="input-field"
              placeholder="Add optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows="3"
              style={{ resize: 'none' }}
              maxLength={500}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
