import React, { useState } from 'react';
import { API_BASE, getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import "../styles/Uploadcsv.css";

export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setMsg('Please select a file'); return; }

    const formData = new FormData();
    formData.append('file', file);
    setMsg('');

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.message || 'Upload failed');
      else {
        setMsg(`Uploaded successfully! Items: ${data.totalItems}`);
        setTimeout(() => nav('/'), 800);
      }
    } catch {
      setMsg('Network error');
    }
  }

  return (
    <div className="upload-container">
      <h3>Upload CSV / XLSX</h3>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" accept=".csv,.xls,.xlsx" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Upload & Distribute</button>
      </form>
      <p className="note">
        CSV must contain <b>FirstName</b> and <b>Phone</b> columns.
      </p>
      {msg && <div className="upload-message">{msg}</div>}
    </div>
  );
}
