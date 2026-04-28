import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { saveToken, API_BASE } from '../utils/auth';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) setErr(data.message || 'Login failed');
      else {
        saveToken(data.token);
        nav('/');
      }
    } catch (error) {
      setErr('Network error');
    }
  }

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {err && <div className="error">{err}</div>}
      <p className="hint">
        Use seeded admin: <b>admin@example.com / Admin@123</b>
      </p>
    </div>
  );
}
