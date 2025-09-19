import React, { use, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList';
// Add other pages as needed
// import Attendance from './pages/Attendance/Attendance';
// import Leave from './pages/Leave/Leave';
// import Payroll from './pages/Payroll/Payroll';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AppToastContainer from './components/Common/ToastContainer';
import { ROLES, hasRole, isSuperAdmin } from './utils/roles';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  console.log(user);
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If no roles specified, allow access (for backward compatibility)
  if (allowedRoles.length === 0) {
    return children;
  }

  // Super admin can access everything
  if (isSuperAdmin(user?.role_id)) {
    return children;
  }

  // Check if user has required role
  if (!hasRole(user?.role_id, allowedRoles)) {
    return <Navigate to="/dashboard" />; // Redirect to dashboard if no access
  }

  return children;
};

const PublicRoute = ({ children }) => {
  
  // Original public route redirect when authenticated:
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  
  // return children;
};

function AppContent() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      {/* Render Header and Sidebar only if authenticated */}
      {isAuthenticated && (
        <>
          <Header collapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
          <Sidebar collapsed={isSidebarCollapsed} />
        </>
      )}
      
      {/* Main content area */}
      <div className={isSidebarCollapsed ? 'page-shell-collapsed' : 'page-shell'}>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.FINANCE, ROLES.RECRUITER]}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.HR, ROLES.MANAGER]}>
              <EmployeeList />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
 return <>
  <AppContent />
  <AppToastContainer />
</>
}

export default App;
