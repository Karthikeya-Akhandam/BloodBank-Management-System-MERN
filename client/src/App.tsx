import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizationDashboard from './pages/OrganizationDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DonorDashboard from './pages/DonorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

const Unauthorized = () => <div className="p-8 text-center text-red-600 font-bold text-2xl uppercase italic tracking-tighter">Unauthorized Access</div>;

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
      <Route path="/" element={<Home />} />
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
