import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home, Users, Calendar, DollarSign,
  BarChart3, Settings, UserCheck
} from 'lucide-react';
import { ROLES, hasRole, isSuperAdmin } from '../../utils/roles';

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const allMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', allowedRoles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.FINANCE, ROLES.RECRUITER] },
    { path: '/employees', icon: Users, label: 'Employees', allowedRoles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.MANAGER] },
    { path: '/attendance', icon: Calendar, label: 'Attendance', allowedRoles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.MANAGER] },
    { path: '/payroll', icon: DollarSign, label: 'Payroll', allowedRoles: [ROLES.SUPER_ADMIN, ROLES.FINANCE] },
    { path: '/performance', icon: BarChart3, label: 'Performance', allowedRoles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.MANAGER] },
    { path: '/recruitment', icon: UserCheck, label: 'Recruitment', allowedRoles: [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.RECRUITER] },
    { path: '/settings', icon: Settings, label: 'Settings', allowedRoles: [ROLES.SUPER_ADMIN] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) => {
    if (isSuperAdmin(user?.role_id)) return true;
    return hasRole(user?.role_id, item.allowedRoles);
  });

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
