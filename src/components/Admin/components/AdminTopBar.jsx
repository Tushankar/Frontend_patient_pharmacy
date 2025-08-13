import React from "react";
import UnifiedNotificationCenter from "../../Notifications/UnifiedNotificationCenter";

const AdminTopBar = ({
  sidebarOpen,
  setSidebarOpen,
  onShowNotificationCreator,
  notifications = [], // Accept notifications from parent
  notificationAnalytics = null, // Accept analytics from parent
  onMarkAsRead = () => {}, // Accept mark as read function from parent
}) => {
  console.log("=========================================",notifications);
  return (
    <div
      className="px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg backdrop-blur-sm border-b"
      style={{
        backgroundColor: "rgba(15, 76, 71, 0.95)",
        borderColor: "rgba(253, 224, 71, 0.2)",
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Desktop title */}
        <h1
          className="hidden lg:block text-xl lg:text-2xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Admin Panel
        </h1>
      </div>

      {/* Mobile centered title - absolutely positioned to center perfectly */}
      <div className="lg:hidden absolute left-1/4 transform -translate-x-1/2">
        <h1
          className="text-lg font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Admin
        </h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Unified Notification Center with Admin Access */}
        <UnifiedNotificationCenter 
          userRole="admin" 
          adminNotifications={notifications}
          analyticsData={notificationAnalytics}
          onMarkAsRead={onMarkAsRead}
        />

        {/* Create Notification Button */}
        <button
          onClick={onShowNotificationCreator}
          className="px-3 lg:px-4 py-2 text-xs lg:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-md"
          style={{
            background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
            color: "#115E59",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(253, 224, 71, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(253, 224, 71, 0.3)";
          }}
          title="Create Notification"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">Create Notification</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default AdminTopBar;