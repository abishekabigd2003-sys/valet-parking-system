import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import Loader from './components/Loader';

const Home = React.lazy(() => import('./pages/valet/Home/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));

const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminVehicles = React.lazy(() => import('./pages/admin/Vehicles'));
const AdminSlots = React.lazy(() => import('./pages/admin/Slots'));
const AdminStaff = React.lazy(() => import('./pages/admin/Staff'));
const AdminCustomers = React.lazy(() => import('./pages/admin/Customers'));
const AdminReports = React.lazy(() => import('./pages/admin/Reports'));
const AdminPayments = React.lazy(() => import('./pages/admin/Payments'));
const AdminSettings = React.lazy(() => import('./pages/admin/Settings'));
const AdminProfile = React.lazy(() => import('./pages/admin/Profile'));

const ValetDashboard = React.lazy(() => import('./pages/ValetDashboard'));
const ValetCheckIn = React.lazy(() => import('./pages/valet/CheckIn'));
const ValetRetrieve = React.lazy(() => import('./pages/valet/Retrieve'));

const CustomerDashboard = React.lazy(() => import('./pages/customer/Dashboard'));
const CustomerReports = React.lazy(() => import('./pages/customer/Reports'));
const CustomerSettings = React.lazy(() => import('./pages/customer/Settings'));

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Loader global={true} />
      <Router>
        <div className="min-h-screen bg-themeBg text-themeText font-sans transition-colors duration-300">
          <Suspense fallback={<Loader fullScreen={true} />}>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<Home />} />
              
              <Route path="/login" element={
                user ? (
                  user.role === 'Admin' ? <Navigate to="/admin" replace /> :
                  user.role === 'Valet' ? <Navigate to="/valet" replace /> :
                  <Navigate to="/customer" replace />
                ) : (
                  <Login />
                )
              } />

              <Route path="/register" element={
                user ? (
                  user.role === 'Admin' ? <Navigate to="/admin" replace /> :
                  user.role === 'Valet' ? <Navigate to="/valet" replace /> :
                  <Navigate to="/customer" replace />
                ) : (
                  <Register />
                )
              } />

              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['Admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="vehicles" element={<AdminVehicles />} />
                <Route path="slots" element={<AdminSlots />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>

              {/* Valet Routes */}
              <Route path="/valet" element={
                <ProtectedRoute roles={['Valet', 'Admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ValetDashboard />} />
                <Route path="check-in" element={<ValetCheckIn />} />
                <Route path="retrieve" element={<ValetRetrieve />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="slots" element={<AdminSlots />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>

              {/* Customer Routes */}
              <Route path="/customer" element={
                <ProtectedRoute roles={['Customer', 'Admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<CustomerDashboard />} />
                <Route path="reports" element={<CustomerReports />} />
                <Route path="settings" element={<CustomerSettings />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;
