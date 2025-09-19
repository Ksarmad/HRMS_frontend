import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchDepartments } from '../../store/slices/departmentSlice';
import { Users, Building, Calendar, DollarSign,BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { list: employees, pagination } = useAppSelector((state) => state.employees);
  const { list: departments } = useAppSelector((state) => state.departments);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 5 }));
    dispatch(fetchDepartments());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Employees',
      value: pagination.total,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Departments',
      value: departments.length,
      icon: Building,
      color: 'bg-green-500',
    },
    {
      title: 'Today Attendance',
      value: '95%',
      icon: Calendar,
      color: 'bg-yellow-500',
    },
    {
      title: 'Payroll Processed',
      value: '₹2.5L',
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="container-page">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your HR management today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Employees</h2>
          <div className="space-y-4">
            {employees.slice(0, 5).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="font-medium text-gray-600">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{employee.department_name}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition-colors">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Employee</span>
            </button>
            <button className="bg-green-50 text-green-600 p-4 rounded-lg hover:bg-green-100 transition-colors">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Mark Attendance</span>
            </button>
            <button className="bg-yellow-50 text-yellow-600 p-4 rounded-lg hover:bg-yellow-100 transition-colors">
              <DollarSign className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Process Payroll</span>
            </button>
            <button className="bg-purple-50 text-purple-600 p-4 rounded-lg hover:bg-purple-100 transition-colors">
              <BarChart3 className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
