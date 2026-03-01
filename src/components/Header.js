import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Welcome Message */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800">
            សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ, {user?.full_name || user?.username}! 👋
          </h2>
          <p className="text-sm text-gray-500 mt-1">នេះជាសកម្មភាពថ្មីៗនៅក្នុងហាងរបស់អ្នកថ្ងៃនេះ</p>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ស្វែងរកផលិតផល..."
              className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/50"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.full_name || user?.username}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;