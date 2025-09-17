// import React from 'react';
// import { Users, Building, Briefcase, Home, BarChart3 } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const location = useLocation();

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: Home },
//     { name: 'Employees', href: '/employees', icon: Users },
//     { name: 'Departments', href: '/departments', icon: Building },
//     { name: 'Designations', href: '/designations', icon: Briefcase },
//     { name: 'Reports', href: '/reports', icon: BarChart3 },
//   ];

//   return (
//     <div className="w-64 bg-white shadow-sm border-r border-gray-200">
//       <div className="flex flex-col h-full">
//         {/* Logo */}
//         <div className="flex items-center justify-center h-16 border-b border-gray-200">
//           <h1 className="text-xl font-bold text-gray-900">HRMS</h1>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-