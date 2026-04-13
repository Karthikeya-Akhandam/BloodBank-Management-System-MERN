import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizationDashboard from './pages/OrganizationDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DonorDashboard from './pages/DonorDashboard';

// Dummy component for Admin
const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <p>Coming Soon...</p>
    <button onClick={() => window.location.href = '/login'} className="bg-red-600 text-white p-2 rounded mt-4">Logout</button>
  </div>
);
const Unauthorized = () => <div className="p-8 text-center text-red-600 font-bold">Unauthorized Access</div>;

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'admin': return <Navigate to="/admin" replace />;
    case 'organization': return <Navigate to="/org" replace />;
    case 'hospital': return <Navigate to="/hospital" replace />;
    case 'donor': return <Navigate to="/donor" replace />;
    default: return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Role-based Redirection */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardRedirect />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Organization Routes */}
      <Route element={<ProtectedRoute allowedRoles={['organization']} />}>
        <Route path="/org" element={<OrganizationDashboard />} />
      </Route>

      {/* Hospital Routes */}
      <Route element={<ProtectedRoute allowedRoles={['hospital']} />}>
        <Route path="/hospital" element={<HospitalDashboard />} />
      </Route>

      {/* Donor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
        <Route path="/donor" element={<DonorDashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
