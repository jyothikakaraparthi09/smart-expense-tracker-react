import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleConfirmPassword = (val) => {
    setConfirmPassword(val);
    if (password !== val) {
      setErrorMsg('Password should match!');
    } else {
      setErrorMsg('');
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword || errorMsg) return;

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        alert('User Registered Successfully');
        navigate('/login');
      } else {
        alert('Unable to register user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-body">
      <div className="auth-container">
        <h2>Register to Expense Tracker</h2>
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        
        <label>Password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={e => handleConfirmPassword(e.target.value)} placeholder="password" />
        
        {errorMsg && <span className="error">{errorMsg}</span>}
        
        <button onClick={handleRegister} style={{ marginTop: '20px', width: '100%' }}>Register</button>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}