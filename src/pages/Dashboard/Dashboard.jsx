import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchDepartments } from '../../store/slices/departmentSlice';
import { Users, Building, Calendar, DollarSign, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { list: employees, pagination } = useAppSelector((state) => state.employees);
  const { list: departments } = useAppSelector((state) => state.departments);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 5 }));
    dispatch(fetchDepartments());
  }, [dispatch]);

  const totalEmployees = pagination.total || employees.length || 0;
  const deptCounts = departments.reduce((acc, d) => {
    acc[d.id] = employees.filter(e => e.department_id === d.id).length;
    return acc;
  }, {});

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
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome back, {user?.email}!
        </h1>
        <p className="text-slate-600">
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
                <div className="icon-ring">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Employees</h2>
          <div className="space-y-4">
            {employees.slice(0, 5).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="font-medium text-slate-600">
                      {employee.first_name?.[0]}{employee.last_name?.[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">
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
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn btn-primary">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Add Employee</span>
            </button>
            <button className="btn btn-secondary">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Mark Attendance</span>
            </button>
            <button className="btn btn-secondary">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Process Payroll</span>
            </button>
            <button className="btn btn-secondary">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Department Distribution</h2>
          <div className="space-y-3">
            {departments.map((dept) => {
              const count = deptCounts[dept.id] || 0;
              const percent = totalEmployees ? Math.round((count / totalEmployees) * 100) : 0;
              return (
                <div key={dept.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 font-medium">{dept.name}</span>
                      <span className="text-slate-500">{count} • {percent}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-primary-600 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {departments.length === 0 && (
              <p className="text-sm text-slate-500">No departments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
