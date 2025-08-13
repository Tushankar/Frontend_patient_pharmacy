import React, { useEffect } from "react";
import {
  User,
  X,
  LogOut,
  Activity,
  Calendar,
  FileText,
  Package,
  Heart,
  Bell,
  MapPin,
} from "lucide-react";

const PatientSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  user,
  notificationCounts,
  onLogout,
}) => {
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "find-pharmacies", label: "Find Pharmacies", icon: MapPin },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "order-history", label: "Order History", icon: Package },
    { id: "health-records", label: "Health Records", icon: Heart },
  ];

  // Auto-close sidebar when screen size changes and handle initial state
  useEffect(() => {
    const handleResize = () => {
      // iPad Pro width is typically 1024px, so anything below that should have sidebar closed
      // This includes mobile phones, iPad mini, regular iPad, etc.
      if (window.innerWidth < 1366 && sidebarOpen) { // 1366px covers iPad Pro 11" and larger
        setSidebarOpen(false);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initial check - close sidebar on page load if screen is too small
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const setInitialState = () => {
      // Only show sidebar by default on screens 1366px and wider (iPad Pro and desktop)
      if (window.innerWidth < 1366) {
        setSidebarOpen(false);
      }
    };

    setInitialState();
  }, []); // Run only once on mount

  // Close sidebar when clicking outside on smaller devices
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Apply to all devices smaller than iPad Pro
      if (window.innerWidth >= 1366) return;
      
      const sidebar = document.getElementById('patient-sidebar');
      if (sidebar && !sidebar.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile/Tablet overlay for devices smaller than iPad Pro */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          style={{ display: window.innerWidth >= 1366 ? 'none' : 'block' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div
        id="patient-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          // Show sidebar by default only on screens 1366px+ (iPad Pro and larger)
          transform: window.innerWidth >= 1366 
            ? 'translateX(0)' 
            : sidebarOpen 
              ? 'translateX(0)' 
              : 'translateX(-100%)',
          backgroundColor: "rgba(15, 76, 71, 0.95)",
          borderRight: "1px solid rgba(253, 224, 71, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid rgba(253, 224, 71, 0.2)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
              }}
            >
              <User className="w-6 h-6" style={{ color: "#115E59" }} />
            </div>
            <span
              className="text-xl font-bold"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Patient Portal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="transition-colors duration-300 p-2 rounded-lg"
            style={{ 
              color: "rgba(219, 245, 240, 0.6)",
              display: window.innerWidth >= 1366 ? 'none' : 'block' // Hide close button on large screens
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(253, 224, 71, 0.1)";
              e.target.style.color = "#FDE047";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "rgba(219, 245, 240, 0.6)";
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div
          className="p-4"
          style={{ borderBottom: "1px solid rgba(253, 224, 71, 0.2)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
              }}
            >
              <User className="w-6 h-6" style={{ color: "#115E59" }} />
            </div>
            <div>
              <h3
                className="font-semibold"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {user?.firstName || "Patient"} {user?.lastName || ""}
              </h3>
              <p
                className="text-sm"
                style={{
                  color: "rgba(219, 245, 240, 0.7)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {user?.email || "patient@example.com"}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  // Close sidebar after selecting an item on smaller devices
                  if (window.innerWidth < 1366) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 font-medium transform hover:scale-105`}
                style={{
                  backgroundColor: isActive
                    ? "rgba(253, 224, 71, 0.15)"
                    : "transparent",
                  color: isActive ? "#FDE047" : "#DBF5F0",
                  borderLeft: isActive
                    ? "3px solid #FDE047"
                    : "3px solid transparent",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "rgba(17, 94, 89, 0.3)";
                    e.target.style.color = "#DBF5F0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#DBF5F0";
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.id === "prescriptions" &&
                  notificationCounts?.prescriptions > 0 && (
                    <span
                      className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        backgroundColor: "#EF4444",
                        color: "white",
                      }}
                    >
                      {notificationCounts.prescriptions}
                    </span>
                  )}
                {item.id === "appointments" &&
                  notificationCounts?.appointments > 0 && (
                    <span
                      className="ml-auto text-xs px-2 py-1 rounded-full font-semibold"
                      style={{
                        backgroundColor: "#FDE047",
                        color: "#115E59",
                      }}
                    >
                      {notificationCounts.appointments}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ borderTop: "1px solid rgba(253, 224, 71, 0.2)" }}
        >
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium transform hover:scale-105"
            style={{
              color: "#FDE047",
              backgroundColor: "transparent",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
              e.target.style.color = "#EF4444";
              e.target.style.borderLeft = "3px solid #EF4444";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#FDE047";
              e.target.style.borderLeft = "3px solid transparent";
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientSidebar;