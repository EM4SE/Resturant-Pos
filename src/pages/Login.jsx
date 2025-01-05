import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === '' || password === '') {
      setError('Please fill in all fields.');
      return;
    }

    // Example validation, replace with actual login logic
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('user', username);
      localStorage.setItem('loginTime', new Date().toISOString()); // Store login time
      window.location.href = '/home'; // Redirect to the dashboard or home page
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to Rest POS</h2>
        <p>Sign in to continue</p>

        {/* Error Message */}
        {error && <div className="login-error">{error}</div>}

        {/* Username Input */}
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        {/* Password Input */}
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
