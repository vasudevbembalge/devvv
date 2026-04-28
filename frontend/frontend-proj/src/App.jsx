import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddAgent from './pages/AddAgent';
import UploadCSV from './pages/UploadCSV';
import { isAuthenticated } from './utils/auth';
import './App.css';

function PrivateRoute({ children }){
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/add-agent" element={<PrivateRoute><AddAgent/></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><UploadCSV/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
