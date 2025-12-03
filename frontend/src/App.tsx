import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RegisterSupplier from './pages/RegisterSupplier';
import OnboardingApprovals from './pages/OnboardingApprovals';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register Supplier</Link>
        <Link to="/approvals">Onboarding Approvals</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<RegisterSupplier />} />
        <Route path="/approvals" element={<OnboardingApprovals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
