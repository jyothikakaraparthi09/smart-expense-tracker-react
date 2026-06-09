import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) throw new Error('Invalid Credentials');
      
      const token = await response.text();
      login(token);
      alert(`Hi ${username}! Welcome to Expense Tracker!`);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <h2>Login to Expense Tracker</h2>
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        
        <button onClick={handleLogin} style={{ marginTop: '20px', width: '100%' }}>Login</button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          New User? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}