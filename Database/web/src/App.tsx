import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmergencyReports from './pages/EmergencyReports';
import RescueTeams from './pages/RescueTeams';
import Resources from './pages/Resources';
import Hospitals from './pages/Hospitals';
import Finance from './pages/Finance';
import Approvals from './pages/Approvals';
import Analytics from './pages/Analytics';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="reports"   element={<EmergencyReports />} />
        <Route path="teams"     element={<RescueTeams />} />
        <Route path="resources" element={<Resources />} />
        <Route path="hospitals" element={<Hospitals />} />
        <Route path="finance"   element={<Finance />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="audit"     element={<AuditLogs />} />
        <Route path="users"     element={<Users />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
