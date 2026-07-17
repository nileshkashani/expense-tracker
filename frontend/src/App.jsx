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
            <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
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
