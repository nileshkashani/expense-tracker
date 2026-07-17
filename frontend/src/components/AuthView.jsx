import React, { useState } from 'react';
import { api } from '../services/api';

const AuthView = ({ onAuthSuccess, addToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      addToast('Please fill out all fields.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const data = await api.login(email, password);
        addToast(`Welcome back, ${data.name}!`, 'success');
        onAuthSuccess(data);
      } else {
        const data = await api.signup(name, email, password);
        addToast(`Account created successfully! Welcome, ${data.name}.`, 'success');
        onAuthSuccess(data);
      }
    } catch (err) {
      addToast(err.message || 'Authentication failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-container">
      <div className="auth-glow-circle circle-1"></div>
      <div className="auth-glow-circle circle-2"></div>
      
      <div className="glass-panel auth-card">
        <div className="auth-logo">
          <span className="logo-icon">💸</span>
          <h2>Antigravity Spend</h2>
        </div>
        
        <h3 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
        <p className="auth-subtitle">
          {isLogin ? 'Enter your details to access your account' : 'Start tracking your expenses in seconds'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label className="input-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={toggleMode} className="auth-toggle-btn" disabled={isLoading}>
            {isLogin ? 'Sign Up Free' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
