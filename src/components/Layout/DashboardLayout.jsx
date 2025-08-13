import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({
  children,
  activeTab,
  setActiveTab,
  userRole,
  tabs = [],
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        tabs={tabs}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen">
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
