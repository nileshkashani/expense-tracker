import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import SummaryCards from './SummaryCards';
import Charts from './Charts';
import ExpenseFilters from './ExpenseFilters';
import ExpenseList from './ExpenseList';
import ExpenseModal from './ExpenseModal';

const Dashboard = ({ addToast }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    from: '',
    to: '',
    search: '',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger refresh of list and summary stats
  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  // Fetch dashboard data
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [expensesData, summaryData] = await Promise.all([
          api.getExpenses(filters),
          api.getSummary(),
        ]);
        
        if (active) {
          setExpenses(expensesData);
          setSummary(summaryData);
        }
      } catch (err) {
        if (active) {
          addToast(err.message || 'Failed to fetch dashboard data.', 'error');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [filters, refreshCount]);

  // Open modal for editing
  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  // Open modal for adding
  const handleAddNewClick = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  // Delete handler
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.deleteExpense(id);
        addToast('Transaction deleted successfully.', 'success');
        triggerRefresh();
      } catch (err) {
        addToast(err.message || 'Failed to delete transaction.', 'error');
      }
    }
  };

  return (
    <main className="dashboard-container">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <div>
          <h2>Financial Dashboard</h2>
          <p>Analyze and manage your personal expenses</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNewClick}>
          <span>+</span> New Expense
        </button>
      </header>

      {/* Grid of stats and charts */}
      <div className="dashboard-grid">
        {/* Metric widgets */}
        <SummaryCards summary={summary} />

        {/* Dynamic visual charts */}
        <Charts summary={summary} />

        {/* Data list filter controls */}
        <ExpenseFilters filters={filters} onFilterChange={setFilters} />

        {/* Expenses transactional list */}
        {isLoading && expenses.length === 0 ? (
          <div className="glass-panel expense-section" style={{ textAlign: 'center', padding: '40px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Loading transactions...</span>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAddNewClick={handleAddNewClick}
          />
        )}
      </div>

      {/* Transaction modal overlay */}
      {isModalOpen && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setIsModalOpen(false)}
          onSaveSuccess={triggerRefresh}
          addToast={addToast}
        />
      )}
    </main>
  );
};

export default Dashboard;
