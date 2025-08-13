import React from "react";
import { Shield, UserPlus, Clock, Mail, Calendar, Key } from "lucide-react";

const AdminsSection = ({ admins, loading, onAddAdmin }) => {
  // Ensure admins is always an array
  const adminsList = admins || [];

  // Demo data for when no admins are provided
  const demoAdmins = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Admin",
      email: "john.admin@hospital.com",
      isSuperAdmin: true,
      permissions: ["manage_users", "manage_pharmacies", "view_reports"],
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      _id: "2", 
      firstName: "Sarah",
      lastName: "Manager",
      email: "sarah.manager@hospital.com",
      isSuperAdmin: false,
      permissions: ["manage_patients", "view_reports"],
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      _id: "3",
      firstName: "Mike",
      lastName: "Support",
      email: "mike.support@hospital.com",
      isSuperAdmin: false,
      permissions: ["view_patients", "manage_notifications"],
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    }
  ];

  const displayAdmins = adminsList.length > 0 ? adminsList : demoAdmins;

  if (loading) {
    return (
      <div className="w-screen max-w-full overflow-x-hidden">
        <div className="w-full px-3 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
            <h2
              className="text-lg font-bold"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Admin Users
            </h2>
            <button
              onClick={onAddAdmin}
              className="w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                color: "#115E59",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)";
              }}
            >
              <UserPlus className="w-4 h-4" />
              Add Admin
            </button>
          </div>
          <div className="flex justify-center py-12">
            <div
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#FDE047", borderTopColor: "transparent" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen max-w-full overflow-x-hidden">
      <div className="w-full px-3 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2
            className="text-lg font-bold"
            style={{
              color: "#DBF5F0",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Admin Users
          </h2>
          <button
            onClick={onAddAdmin}
            className="w-full sm:w-auto px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            style={{
              background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
              color: "#115E59",
              fontFamily: "Inter, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)";
            }}
          >
            <UserPlus className="w-4 h-4" />
            Add Admin
          </button>
        </div>

        {displayAdmins.length > 0 ? (
          <div className="w-full space-y-3 sm:space-y-4">
            {displayAdmins.map((admin) => (
              <div
                key={admin._id}
                className="w-full rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 transition-all duration-300"
                style={{
                  background: "#CAE7E1",
                  border: "1px solid rgba(253, 224, 71, 0.2)",
                  backdropFilter: "blur(10px)",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Mobile Layout */}
                <div className="lg:hidden w-full">
                  {/* Header with Avatar and Super Admin Badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                      }}
                    >
                      <span className="font-bold text-sm" style={{ color: "#115E59" }}>
                        {admin.firstName[0]}
                        {admin.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <h3
                        className="text-sm font-semibold mb-1"
                        style={{ 
                          color: "#000000",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {admin.firstName} {admin.lastName}
                      </h3>
                      {admin.isSuperAdmin && (
                        <span
                          className="inline-block px-2 py-0.5 text-xs rounded-full font-medium mb-1"
                          style={{
                            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
                            color: "#A855F7",
                            border: "1px solid rgba(168, 85, 247, 0.3)",
                          }}
                        >
                          Super Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="w-full mb-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                      <span
                        className="text-xs flex-1"
                        style={{ 
                          color: "#000000",
                          wordWrap: "break-word",
                          overflowWrap: "anywhere",
                          lineHeight: "1.3"
                        }}
                      >
                        {admin.email}
                      </span>
                    </div>
                    
                    {admin.lastLogin && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                        <span className="text-xs" style={{ color: "#000000" }}>
                          Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Permissions */}
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-3 h-3 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#000000" }}
                      >
                        Permissions:
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-0.5 text-xs rounded-md font-medium"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            color: "#000000",
                            border: "1px solid rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          {permission.replace(/_/g, " ").toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                        }}
                      >
                        <span className="font-bold" style={{ color: "#115E59" }}>
                          {admin.firstName[0]}
                          {admin.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: "#000000" }}
                        >
                          {admin.firstName} {admin.lastName}
                          {admin.isSuperAdmin && (
                            <span
                              className="ml-2 px-2.5 py-0.5 text-xs rounded-full font-medium"
                              style={{
                                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
                                color: "#A855F7",
                                border: "1px solid rgba(168, 85, 247, 0.3)",
                              }}
                            >
                              Super Admin
                            </span>
                          )}
                        </h3>
                        <p
                          className="text-sm mt-1"
                          style={{ color: "#000000", opacity: 0.8 }}
                        >
                          {admin.email}
                        </p>
                        <div className="mt-3">
                          <p
                            className="text-xs font-medium mb-2"
                            style={{ color: "#000000" }}
                          >
                            Permissions:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {admin.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="px-2.5 py-1 text-xs rounded-md font-medium"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                                  color: "#000000",
                                  border: "1px solid rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                {permission.replace(/_/g, " ").toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "#000000", opacity: 0.8 }}
                    >
                      {admin.lastLogin && (
                        <p className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last login: {new Date(admin.lastLogin).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl p-6 text-center w-full"
            style={{
              background: "rgba(219, 245, 240, 0.1)",
              border: "1px solid rgba(253, 224, 71, 0.2)",
            }}
          >
            <Shield
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "#A7F3D0" }}
            />
            <p className="text-base" style={{ color: "#DBF5F0" }}>
              No admin users found
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: "#A7F3D0", opacity: 0.8 }}
            >
              Add admin users to manage the platform
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminsSection;