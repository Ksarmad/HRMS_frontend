import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Calendar, DollarSign, 
  BarChart3, Settings, UserCheck 
} from 'lucide-react';

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/employees', icon: Users, label: 'Employees' },
    { path: '/attendance', icon: Calendar, label: 'Attendance' },
    { path: '/payroll', icon: DollarSign, label: 'Payroll' },
    { path: '/performance', icon: BarChart3, label: 'Performance' },
    { path: '/recruitment', icon: UserCheck, label: 'Recruitment' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'w-16' : 'w-64'}`}>
      <nav className="mt-8">
        <ul className={`space-y-1 ${collapsed ? 'px-2' : 'px-4'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${collapsed ? 'justify-center' : ''} ${isActive ? 'is-active' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
