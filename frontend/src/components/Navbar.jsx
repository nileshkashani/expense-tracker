import React from 'react';
import { api } from '../services/api';

const Navbar = ({ user, onLogout }) => {
  const handleLogout = () => {
    api.logout();
    onLogout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Expense Tracker</h1>
      </div>
      
      {user && (
        <div className="navbar-user">
          <div className="user-profile">
            <div className="avatar">{getInitials(user.name)}</div>
            <span className="username">{user.name}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
