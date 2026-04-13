import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Dummy components for now
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Dashboard - Welcome {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
const Unauthorized = () => <div>Unauthorized Access</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Route>

      {/* Organization Routes */}
      <Route element={<ProtectedRoute allowedRoles={['organization']} />}>
        <Route path="/org" element={<div>Organization Dashboard</div>} />
      </Route>

      {/* Hospital Routes */}
      <Route element={<ProtectedRoute allowedRoles={['hospital']} />}>
        <Route path="/hospital" element={<div>Hospital Dashboard</div>} />
      </Route>

      {/* Donor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
        <Route path="/donor" element={<div>Donor Dashboard</div>} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
