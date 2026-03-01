import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'ទំព័រដើម', to: '/dashboard', icon: HomeIcon },
    { name: 'ផលិតផល', to: '/products', icon: CubeIcon },
    { name: 'វិភាគទិន្នន័យ', to: '/analytics', icon: ChartBarIcon },
    { name: 'ការកំណត់', to: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-100">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-20 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Phone E-commerce</h1>
            <p className="text-xs text-blue-100">ប្រព័ន្ធគ្រប់គ្រង</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || user?.username || 'អ្នកគ្រប់គ្រង'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@example.com'}</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span>ចាកចេញពីប្រព័ន្ធ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;