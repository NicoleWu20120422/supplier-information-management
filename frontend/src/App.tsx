import Dashboard from './pages/Dashboard';
import RegisterSupplier from './pages/RegisterSupplier';
import OnboardingApprovals from './pages/OnboardingApprovals';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register Supplier</Link>
        <Link to="/approvals" style={{ marginRight: '1rem' }}>Onboarding Approvals</Link>
        <Link to="/suppliers" style={{ marginRight: '1rem' }}>Suppliers</Link>
        <Link to="/documents">Documents</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<RegisterSupplier />} />
        <Route path="/approvals" element={<OnboardingApprovals />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </BrowserRouter>
  );
}
