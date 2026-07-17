import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Check login status on mount
  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Custom Toast notification manager
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <>
      {/* Toast Notification overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : toast.type === 'error' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      {user ? (
        <>
          <Navbar user={user} onLogout={() => setUser(null)} />
          <Dashboard addToast={addToast} />
        </>
      ) : (
        <AuthView onAuthSuccess={(usr) => setUser(usr)} addToast={addToast} />
      )}
    </>
  );
}

export default App;
