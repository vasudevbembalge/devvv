import React, { useState } from 'react';
import { API_BASE, getToken } from '../utils/auth';

import { useNavigate } from 'react-router-dom';
import '../styles/Addagent.css';

export default function AddAgent() {
  const [form, setForm] = useState({ name:'', email:'', mobile:'', password:'' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.message || 'Error');
      else {
        setMsg('Agent added successfully ✅');
        setForm({ name:'', email:'', mobile:'', password:'' });
        setTimeout(() => nav('/'), 800);
      }
    } catch(err) {
      setMsg('Network error');
    }
  }

  return (
    <div className="add-agent-container">
      <h3>Add New Agent</h3>
      <form onSubmit={handleSubmit} className="add-agent-form">
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        <label>Email</label>
        <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required />
        <label>Mobile (+91xxxxxxxxxx)</label>
        <input value={form.mobile} onChange={e=>setForm({...form, mobile: e.target.value})} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required />
        <button type="submit">Add Agent</button>
      </form>
      {msg && <div className="message">{msg}</div>}

      <div>
      
     </div>
    </div>
    
  );
}
