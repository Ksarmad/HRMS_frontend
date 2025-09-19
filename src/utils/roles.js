// Role constants matching backend roles for consistent role-based access control
export const ROLES = {
  SUPER_ADMIN: 1,
  HR: 2,
  MANAGER: 3,
  EMPLOYEE: 4,
  FINANCE: 5,
  RECRUITER: 6
};

// Helper function to check if user has required role
export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

// Helper function to check if user is super admin (can access everything)
export const isSuperAdmin = (userRole) => {
  return userRole === ROLES.SUPER_ADMIN;
};

// Helper function to get role name from ID
export const getRoleName = (roleId) => {
  const roleMap = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.HR]: 'HR',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.EMPLOYEE]: 'Employee',
    [ROLES.FINANCE]: 'Finance',
    [ROLES.RECRUITER]: 'Recruiter'
  };
  return roleMap[roleId] || 'Unknown';
};
