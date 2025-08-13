import React, { useEffect } from "react";
import {
  Shield,
  ChevronLeft,
  LogOut,
  Activity,
  Clock,
  Bell,
  Building,
  Users,
  Menu,
} from "lucide-react";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  stats,
  notificationAnalytics,
  onLogout,
}) => {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "approvals", label: "Pending Approvals", icon: Clock },
    { id: "notifications", label: "All Notifications", icon: Bell },
    { id: "pharmacies", label: "Pharmacies", icon: Building },
    { id: "patients", label: "Patients", icon: Users },
    { id: "admins", label: "Admins", icon: Shield },
  ];

  // Handle mobile behavior - sidebar should start closed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Close sidebar on mobile
        setSidebarOpen(false);
      } else {
        // On desktop, sidebar can remain open based on user preference
        // but we'll default to open for better UX
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    // Always close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop - Shows when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Toggle Button (Always visible on mobile) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg transition-all duration-300 lg:hidden"
        style={{
          backgroundColor: "rgba(15, 76, 71, 0.95)",
          color: "#DBF5F0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#115E59";
          e.currentTarget.style.color = "#FFFFFF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(15, 76, 71, 0.95)";
          e.currentTarget.style.color = "#DBF5F0";
        }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        } ${
          // On mobile, translate the sidebar off-screen when closed
          sidebarOpen 
            ? "translate-x-0" 
            : "lg:translate-x-0 -translate-x-full lg:w-16"
        }`}
        style={{
          backgroundColor: "rgba(15, 76, 71, 0.95)",
          borderRight: "1px solid rgba(253, 224, 71, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{
            borderBottom: "1px solid rgba(253, 224, 71, 0.2)",
            height: "72px",
          }}
        >
          <div className="flex items-center gap-2 w-full">
            {sidebarOpen ? (
              <>
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                  }}
                >
                  <Shield className="w-6 h-6" style={{ color: "#115E59" }} />
                </div>
                <span
                  className="text-xl font-bold whitespace-nowrap"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  Admin Panel
                </span>
              </>
            ) : (
              <button
                onClick={toggleSidebar}
                className="transition-colors duration-300 p-2 rounded-lg mx-auto hidden lg:block"
                style={{ color: "#DBF5F0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#115E59";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#DBF5F0";
                }}
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="transition-colors duration-300 p-2 rounded-lg flex-shrink-0"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#115E59";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "rgba(219, 245, 240, 0.6)";
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`relative w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 mb-2 font-medium transform hover:scale-105 ${
                  !sidebarOpen ? "justify-center px-3" : ""
                }`}
                style={{
                  backgroundColor: isActive
                    ? "rgba(253, 224, 71, 0.15)"
                    : "transparent",
                  color: isActive ? "#FDE047" : "#DBF5F0",
                  borderLeft: sidebarOpen 
                    ? (isActive ? "3px solid #FDE047" : "3px solid transparent")
                    : "none",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#115E59";
                    e.currentTarget.style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#DBF5F0";
                  }
                }}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className={`w-5 h-5 flex-shrink-0`} />
                {sidebarOpen && (
                  <>
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.id === "approvals" && stats?.pendingApprovals > 0 && (
                      <span
                        className="ml-auto text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: "#EF4444",
                          color: "white",
                        }}
                      >
                        {stats.pendingApprovals}
                      </span>
                    )}
                    {item.id === "notifications" && notificationAnalytics?.unread > 0 && (
                      <span
                        className="ml-auto text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0"
                        style={{
                          backgroundColor: "#FDE047",
                          color: "#115E59",
                        }}
                      >
                        {notificationAnalytics.unread}
                      </span>
                    )}
                  </>
                )}
                {/* Show badge as dot when sidebar is collapsed */}
                {!sidebarOpen && (
                  <>
                    {item.id === "approvals" && stats?.pendingApprovals > 0 && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "#EF4444",
                        }}
                      />
                    )}
                    {item.id === "notifications" && notificationAnalytics?.unread > 0 && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: "#FDE047",
                        }}
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            borderTop: "1px solid rgba(253, 224, 71, 0.2)",
          }}
        >
          <button
            onClick={onLogout}
            className={`relative w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-105 ${
              !sidebarOpen ? "justify-center px-3" : "px-4"
            }`}
            style={{
              color: "#FDE047",
              backgroundColor: "transparent",
              fontFamily: "Inter, sans-serif",
              borderLeft: sidebarOpen ? "3px solid transparent" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#DC2626";
              e.currentTarget.style.color = "#FFFFFF";
              if (sidebarOpen) {
                e.currentTarget.style.borderLeft = "3px solid #DC2626";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#FDE047";
              if (sidebarOpen) {
                e.currentTarget.style.borderLeft = "3px solid transparent";
              }
            }}
            title={!sidebarOpen ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;