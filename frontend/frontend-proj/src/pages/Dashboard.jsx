import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, API_BASE, logout } from '../utils/auth';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const nav = useNavigate();
  const [dists, setDists] = useState([]);
  const [agents, setAgents] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
  fetchDistributions();
  fetchAgents();   // 🔥 ADD THIS
}, []);


  async function fetchAgents() {
  try {
    const res = await fetch(`${API_BASE}/agents`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (res.ok) setAgents(data);
  } catch (err) {
    console.log(err);
  }
}

  async function fetchDistributions() {
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/distributions`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || 'Failed');
        if (res.status === 401) {
          logout();
          nav('/login');
        }
      } else {
        setDists(data);
      }
    } catch (err) {
      setErr('Network error');
    }
  }

  function handleLogout() {
    logout();
    nav('/login');
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="nav-links">
          <Link to="/add-agent" className="nav-link">Add Agent</Link>
          <Link to="/upload" className="nav-link">Upload CSV</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">

        <h3 className="section-title">Agents</h3>
        {err && <div className="error-message">{err}</div>}
        {agents.length === 0 ? (
          <div className="no-data">No agents added yet.</div>
        ) : (
          <div className="distributions-grid">
            {agents.map((agent) => (
              <div key={agent._id} className="distribution-card">
                <div className="card-header">
                  <div className="agent-info">
                    <p><strong>Agent:</strong> {agent.name} ({agent.email})</p>
                    <p><strong>Mobile:</strong> {agent.mobile}</p>
                  </div>
                  <div className="file-info">
                    <p><strong>Status:</strong> Active Agent</p>
                  </div>
                </div>

                
                </div>
            ))}
          </div>
        )}


        <h3 className="section-title">Distributions</h3>
        {err && <div className="error-message">{err}</div>}
        {dists.length === 0 ? (
          <div className="no-data">No distributions yet. Upload a CSV.</div>
        ) : (
          <div className="distributions-grid">
            {dists.map((d) => (
              <div key={d._id} className="distribution-card">
                <div className="card-header">
                  <div className="agent-info">
                    <p><strong>Agent:</strong> {d.agent.name} ({d.agent.email})</p>
                    <p><strong>Mobile:</strong> {d.agent.mobile}</p>
                  </div>
                  <div className="file-info">
                    <p><strong>Items:</strong> {d.items.length}</p>
                    <small>Uploaded: {new Date(d.uploadedAt).toLocaleString()}</small><br />
                    <small>File: {d.sourceFileName}</small>
                  </div>
                </div>

                <div className="card-table">
                  <table>
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Phone</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((it) => (
                        <tr key={it._id}>
                          <td>{it.firstName}</td>
                          <td>{it.phone}</td>
                          <td>{it.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Lead Distribution System | Made with ❤️ by Team</p>
      </footer>
    </div>
  );
}
