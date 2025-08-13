import React, { useState, useEffect } from "react";
import { useAuth } from "../Login";
import {
  Building,
  Package,
  Users,
  DollarSign,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Activity,
  FileText,
  MessageCircle,
  Heart,
  ClipboardList,
  Home,
  Bell,
} from "lucide-react";
import UnifiedNotificationCenter from "../Notifications/UnifiedNotificationCenter";

const PharmacySidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      
      // Auto-collapse on tablet
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity, color: "text-green-300" },
    { id: "prescriptions", label: "Prescriptions", icon: FileText, color: "text-blue-300" },
    { id: "orders", label: "Orders", icon: Package, color: "text-purple-300" },
    { id: "inventory", label: "Inventory", icon: ClipboardList, color: "text-orange-300" },
    { id: "analytics", label: "Analytics", icon: DollarSign, color: "text-yellow-300" },
    { id: "chat", label: "Messages", icon: MessageCircle, color: "text-pink-300" },
  ];

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0F4C47] border-b border-white/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 bg-white/10 rounded-lg"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm truncate max-w-[150px]">
                  {user?.pharmacyName || "Pharmacy"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white/10 rounded-lg relative">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {isMobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="fixed top-0 left-0 h-full w-72 bg-[#0F4C47] z-50 transform transition-transform duration-300">
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold text-lg">Menu</h2>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {user?.pharmacyName || "Pharmacy Portal"}
                      </p>
                      <p className="text-teal-200 text-xs">
                        {user?.email || "Manage operations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeView === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveView(tab.id);
                        setIsMobileOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-yellow-400/20 text-white border border-yellow-400/50"
                            : "text-teal-200 hover:bg-white/10"
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-yellow-300" : tab.color}`} />
                      <span className="flex-1 text-left">{tab.label}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/20 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-teal-200 hover:bg-white/10 rounded-lg">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0F4C47] border-t border-white/20 z-40">
          <div className="grid grid-cols-5 py-2">
            {tabs.slice(0, 5).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`
                    flex flex-col items-center gap-1 py-2 transition-all
                    ${isActive ? "text-yellow-300" : "text-teal-200"}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">
                    {tab.label.split(" ")[0]}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-yellow-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Tablet and Desktop Sidebar
  return (
    <>
      {/* Tablet Toggle Button - Floating */}
      {isTablet && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="fixed top-4 left-4 z-50 p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 md:hidden lg:hidden"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white" />
          )}
        </button>
      )}

      {/* Sidebar - Tablet and Desktop */}
      <div
        className={`
          hidden md:flex
          sticky top-0 h-screen
          ${isCollapsed ? "w-20" : isTablet ? "w-64" : "w-80"} 
          transition-all duration-300 ease-in-out
          flex-col flex-shrink-0
          border-r border-white/20 
        `}
        style={{
          backgroundColor: "#0F4C47",
          backgroundImage: "linear-gradient(180deg, #0F4C47 0%, #115E59 100%)",
        }}
      >
        {/* Header */}
        <div className={`flex-shrink-0 ${isCollapsed ? "p-4" : "p-6"} border-b border-white/20`}>
          {!isCollapsed ? (
            <>
              {/* Desktop Toggle Button - Only shown when not collapsed */}
              {!isTablet && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="absolute top-6 right-6 z-10 p-2 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 border border-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              <div className={`flex items-center gap-4 ${!isTablet && "pr-10"}`}>
                <div className={`${isTablet ? "w-10 h-10" : "w-12 h-12"} bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30`}>
                  <Building className={`${isTablet ? "w-6 h-6" : "w-7 h-7"} text-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className={`${isTablet ? "text-base" : "text-lg"} font-bold text-white truncate`}>
                    {user?.pharmacyName || "Pharmacy Portal"}
                  </h1>
                  <p className={`${isTablet ? "text-xs" : "text-sm"} text-teal-200 truncate`}>
                    Manage operations
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              {/* Toggle Button replaces logo when collapsed (Desktop only) */}
              {!isTablet ? (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30 text-teal-200 hover:text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              ) : (
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                  <Building className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden ${isCollapsed ? "p-3" : "p-4"} space-y-2`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`
                  w-full flex items-center gap-3 
                  ${isCollapsed ? "px-0 py-3 justify-center" : isTablet ? "px-3 py-2.5" : "px-4 py-3"} 
                  rounded-xl font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-yellow-400/20 to-amber-400/20 backdrop-blur-sm text-white border-2 border-yellow-400/50 shadow-sm"
                      : "text-teal-200 hover:text-white hover:bg-white/10"
                  }
                `}
                title={isCollapsed ? tab.label : ""}
              >
                <Icon
                  className={`${isTablet ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0 ${
                    isActive ? "text-yellow-300" : tab.color
                  }`}
                />
                {!isCollapsed && (
                  <>
                    <span className={`flex-1 text-left truncate ${isTablet ? "text-sm" : ""}`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm flex-shrink-0" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`flex-shrink-0 ${isCollapsed ? "p-3" : "p-4"} border-t border-white/20 space-y-2`}>
          {/* Settings */}
          <button
            className={`w-full flex items-center gap-3 
              ${isCollapsed ? "px-0 py-3 justify-center" : isTablet ? "px-3 py-2.5" : "px-4 py-3"} 
              text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/20`}
            title={isCollapsed ? "Settings" : ""}
          >
            <Settings className={`${isTablet ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0`} />
            {!isCollapsed && <span className={`truncate ${isTablet ? "text-sm" : ""}`}>Settings</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 
              ${isCollapsed ? "px-0 py-3 justify-center" : isTablet ? "px-3 py-2.5" : "px-4 py-3"} 
              text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-xl transition-colors font-medium border border-red-400/30`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className={`${isTablet ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0`} />
            {!isCollapsed && <span className={`truncate ${isTablet ? "text-sm" : ""}`}>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default PharmacySidebar;