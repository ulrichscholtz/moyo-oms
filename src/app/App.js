import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VendorLogin from '../features/auth/components/VendorLogin';
import NormalLogin from '../features/auth/components/NormalLogin';
import Dashboard from '../features/dashboard/components/Dashboard';
import Statistics from '../features/stats/components/Statistics';
import { useEffect, useState } from 'react';
import { getData } from '../services/api';

function TitleScreen() {

  return (
    <div className="title-screen-bg">
      <div className="title-screen-card">
        <h1 className="title-screen-title">
          <span className="moyo-title">MOYO</span> Case Study Solution
        </h1>
        <p className="title-screen-desc">By Ulrich Scholtz</p>
        <Link to="/login" className="title-screen-btn">
          Review
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitleScreen />} />
        <Route path="/login" element={<VendorLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classic-login" element={<NormalLogin />} />
        <Route path="/statistics" element={<Statistics />} />
      </Routes>
    </Router>
  );
}
