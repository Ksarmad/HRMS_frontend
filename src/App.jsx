import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import AppToastContainer from './components/Common/ToastContainer';

const ProtectedRoute = ({ children }) => {
  /*
  // Original auth-guarded route:
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
  */
  return children;
};

const PublicRoute = ({ children }) => {
  /*
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
  */
  return children;
};

function AppContent() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      {/* Temporarily always render Header (was gated by auth)
      {isAuthenticated && <Header collapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />}
      */}
      <Header collapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
      {/* Temporarily always render Sidebar (was gated by auth)
      {isAuthenticated && <Sidebar collapsed={isSidebarCollapsed} />}
      */}
      <Sidebar collapsed={isSidebarCollapsed} />
      
      {/* Was conditional on auth; keep layout consistent across refresh */}
      <div className={isSidebarCollapsed ? 'page-shell-collapsed' : 'page-shell'}>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute>
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
