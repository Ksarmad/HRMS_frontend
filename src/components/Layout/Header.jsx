import React from 'react';
import { LogOut, User, Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const Header = ({ collapsed = false, onToggleSidebar }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <button onClick={onToggleSidebar} aria-label="Toggle sidebar" className="btn btn-ghost p-2">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">HRMS</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-5 w-5" />
              <span>{user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
