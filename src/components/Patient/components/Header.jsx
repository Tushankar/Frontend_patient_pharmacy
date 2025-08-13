// components/PatientDashboard/Header.js
import React from "react";
import { Search, Settings } from "lucide-react";

const Header = ({ user, notificationComponent }) => {
  return (
    <header className="bg-[#104440] sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-200">
              Welcome back, {user?.firstName || "Patient"}!
            </h1>
            <p className="text-yellow-400 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-64 px-4 py-2 pr-10 border bg-transparent border-[#a2a74739] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
            </div>
            
            {/* Notifications */}
            {notificationComponent}

            {/* Settings */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-200">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-300">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;