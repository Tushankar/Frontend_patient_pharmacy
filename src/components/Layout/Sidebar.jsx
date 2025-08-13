import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Login";
import {
  User,
  Calendar,
  FileText,
  Activity,
  LogOut,
  Bell,
  Settings,
  Pill,
  Heart,
  Package,
  Building,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageCircle,
  MapPin,
  Clock,
  Menu,
  X,
} from "lucide-react";
import UnifiedNotificationCenter from "../Notifications/UnifiedNotificationCenter";

const Sidebar = ({ activeTab, setActiveTab, userRole, tabs = [] }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getUserIcon = () => {
    switch (userRole) {
      case "patient":
        return User;
      case "pharmacy":
        return Building;
      case "admin":
        return Shield;
      default:
        return User;
    }
  };

  const getUserTitle = () => {
    switch (userRole) {
      case "patient":
        return `Welcome, ${user?.firstName || "Patient"}!`;
      case "pharmacy":
        return user?.pharmacyName || "Pharmacy Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getUserSubtitle = () => {
    switch (userRole) {
      case "patient":
        return "Manage your health journey";
      case "pharmacy":
        return "Manage your pharmacy operations";
      case "admin":
        return "System Administration";
      default:
        return "";
    }
  };

  const getPrimaryColor = () => {
    switch (userRole) {
      case "patient":
        return "bg-blue-600";
      case "pharmacy":
        return "bg-green-600";
      case "admin":
        return "bg-gray-700";
      default:
        return "bg-blue-600";
    }
  };

  const getAccentColor = () => {
    switch (userRole) {
      case "patient":
        return "blue";
      case "pharmacy":
        return "green";
      case "admin":
        return "gray";
      default:
        return "blue";
    }
  };

  const UserIcon = getUserIcon();
  const accentColor = getAccentColor();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          ${isCollapsed ? "w-20" : "w-80"} 
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          bg-white border-r border-gray-200 shadow-xl
          transition-all duration-300 ease-in-out
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${getPrimaryColor()} rounded-lg flex items-center justify-center shadow-sm`}
                >
                  <UserIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {getUserTitle()}
                  </h1>
                  <p className="text-sm text-gray-500 truncate">
                    {getUserSubtitle()}
                  </p>
                </div>
              </div>
            )}

            {isCollapsed && (
              <div
                className={`w-10 h-10 ${getPrimaryColor()} rounded-lg flex items-center justify-center shadow-sm mx-auto`}
              >
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${
                    isActive
                      ? `bg-${accentColor}-50 text-${accentColor}-700 border-l-4 border-${accentColor}-600`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? tab.label : ""}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? `text-${accentColor}-600` : ""
                  }`}
                />
                {!isCollapsed && (
                  <span className="flex-1 text-left">{tab.label}</span>
                )}
                {!isCollapsed && isActive && (
                  <div
                    className={`w-2 h-2 bg-${accentColor}-600 rounded-full opacity-75`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {/* Notifications */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            } px-4 py-3`}
          >
            <UnifiedNotificationCenter userRole={userRole} />
            {!isCollapsed && (
              <span className="text-sm text-gray-600">Notifications</span>
            )}
          </div>

          {/* Settings */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
