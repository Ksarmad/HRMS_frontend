import React from 'react';
import { useAppSelector } from '../../hooks/redux';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Welcome back, {user?.email}!
            </h2>
            <p className="text-blue-700">
              You are successfully logged into the HR Management System.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role ID:</span> {user?.role_id}</p>
              {user?.employee_id && (
                <p><span className="font-medium">Employee ID:</span> {user?.employee_id}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">View Employees</span>
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Manage Attendance</span>
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Process Payroll</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;