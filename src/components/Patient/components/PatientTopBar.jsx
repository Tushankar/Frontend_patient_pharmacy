import React from "react";
import { Menu, Settings } from "lucide-react";
import UnifiedNotificationCenter from "../../Notifications/UnifiedNotificationCenter";

const PatientTopBar = ({ sidebarOpen, setSidebarOpen, user }) => {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg backdrop-blur-sm border-b"
      style={{
        backgroundColor: "rgba(15, 76, 71, 0.95)",
        borderColor: "rgba(253, 224, 71, 0.2)",
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg transition-all duration-300"
          style={{ color: "rgba(219, 245, 240, 0.6)" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(253, 224, 71, 0.1)";
            e.target.style.color = "#FDE047";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "rgba(219, 245, 240, 0.6)";
          }}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1
          className="text-2xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Welcome, {user?.firstName || "Patient"}!
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Unified Notification Center */}
        <UnifiedNotificationCenter userRole="patient" />

        {/* Settings Button */}
        <button
          className="p-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          style={{ color: "rgba(219, 245, 240, 0.6)" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(253, 224, 71, 0.1)";
            e.target.style.color = "#FDE047";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "rgba(219, 245, 240, 0.6)";
          }}
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PatientTopBar;
