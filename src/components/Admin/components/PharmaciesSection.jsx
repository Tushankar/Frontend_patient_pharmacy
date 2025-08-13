import React from "react";
import { Building, Phone, Mail, MapPin, Eye, ToggleLeft, ToggleRight } from "lucide-react";

const PharmaciesSection = ({
  pharmacies,
  loading,
  onSelectPharmacy,
  onToggleUserStatus,
}) => {
  const pharmaciesList = pharmacies || [];

  if (loading) {
    return (
      <div className="w-screen max-w-full overflow-x-hidden">
        <div className="w-full px-3 py-4">
          <h2
            className="text-lg font-bold mb-6"
            style={{
              color: "#DBF5F0",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Registered Pharmacies
          </h2>
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

  if (pharmaciesList.length === 0) {
    return (
      <div className="w-screen max-w-full overflow-x-hidden">
        <div className="w-full px-3 py-4">
          <h2
            className="text-lg font-bold mb-6"
            style={{
              color: "#DBF5F0",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Registered Pharmacies
          </h2>
          <div
            className="rounded-xl p-6 text-center w-full"
            style={{
              background: "rgba(219, 245, 240, 0.1)",
              border: "1px solid rgba(253, 224, 71, 0.2)",
            }}
          >
            <Building
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "#A7F3D0" }}
            />
            <p className="text-base" style={{ color: "#DBF5F0" }}>
              No pharmacies registered
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen max-w-full overflow-x-hidden">
      <div className="w-full px-3 py-4">
        <h2
          className="text-lg font-bold mb-6"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Registered Pharmacies
        </h2>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="hidden lg:block">
          <div
            className="rounded-xl shadow-lg overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
              border: "1px solid rgba(253, 224, 71, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead
                  style={{
                    background: "rgba(15, 76, 71, 0.3)",
                    borderBottom: "1px solid rgba(253, 224, 71, 0.2)",
                  }}
                >
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
                    >
                      Pharmacy Details
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
                    >
                      Contact Info
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
                    >
                      Location
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
                    >
                      Status
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#A7F3D0", fontFamily: "Inter, sans-serif" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody style={{ background: "transparent" }}>
                  {pharmaciesList.map((pharmacy, index) => (
                    <tr
                      key={pharmacy._id}
                      className="transition-all duration-200"
                      style={{
                        background: "#CAE7E1",
                        borderBottom:
                          index < pharmaciesList.length - 1
                            ? "1px solid rgba(253, 224, 71, 0.1)"
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(202, 231, 225, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#CAE7E1";
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#000000" }}
                          >
                            {pharmacy.pharmacyName}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "#000000", opacity: 0.7 }}
                          >
                            License: {pharmacy.licenseNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p style={{ color: "#000000" }}>
                            {pharmacy.contactInfo?.email || pharmacy.email || "N/A"}
                          </p>
                          <p style={{ color: "#000000", opacity: 0.7 }}>
                            {pharmacy.contactInfo?.phone || pharmacy.phone || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#000000" }}
                      >
                        {pharmacy.address.city}, {pharmacy.address.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                          style={{
                            backgroundColor: pharmacy.isActive
                              ? "rgba(34, 197, 94, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                            color: pharmacy.isActive ? "#22C55E" : "#EF4444",
                            border: `1px solid ${
                              pharmacy.isActive ? "#22C55E" : "#EF4444"
                            }40`,
                          }}
                        >
                          {pharmacy.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              console.log("Pharmacy details clicked:", pharmacy);
                              onSelectPharmacy && onSelectPharmacy(pharmacy);
                            }}
                            className="font-medium transition-colors duration-200"
                            style={{ color: "#000000" }}
                            onMouseEnter={(e) => {
                              e.target.style.color = "#374151";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#000000";
                            }}
                          >
                            View Details
                          </button>
                          <span style={{ color: "#000000", opacity: 0.5 }}>|</span>
                          <button
                            onClick={() => onToggleUserStatus && onToggleUserStatus(pharmacy._id)}
                            className={`font-medium transition-colors duration-200`}
                            style={{
                              color: pharmacy.isActive ? "#EF4444" : "#22C55E",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = pharmacy.isActive
                                ? "#DC2626"
                                : "#16A34A";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = pharmacy.isActive
                                ? "#EF4444"
                                : "#22C55E";
                            }}
                          >
                            {pharmacy.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Card View - Shown on mobile and tablet */}
        <div className="lg:hidden w-full">
          {pharmaciesList.map((pharmacy, index) => (
            <div
              key={pharmacy._id}
              className="w-full rounded-xl shadow-lg p-3 mb-4"
              style={{
                background: "#CAE7E1",
                border: "1px solid rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Header */}
              <div className="w-full mb-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex-1" style={{ minWidth: 0 }}>
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{
                        color: "#000000",
                        fontFamily: "Inter, sans-serif",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        lineHeight: "1.3",
                      }}
                    >
                      {pharmacy.pharmacyName}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: "#000000", opacity: 0.7 }}
                    >
                      License: {pharmacy.licenseNumber}
                    </p>
                  </div>
                  
                  <div>
                    <span
                      className="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: pharmacy.isActive
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                        color: pharmacy.isActive ? "#22C55E" : "#EF4444",
                        border: `1px solid ${
                          pharmacy.isActive ? "#22C55E" : "#EF4444"
                        }40`,
                      }}
                    >
                      {pharmacy.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
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
                    {pharmacy.contactInfo?.email || pharmacy.email || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                  <span className="text-xs" style={{ color: "#000000" }}>
                    {pharmacy.contactInfo?.phone || pharmacy.phone || "N/A"}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                  <span className="text-xs" style={{ color: "#000000" }}>
                    {pharmacy.address.city}, {pharmacy.address.state}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="w-full space-y-2">
                <button
                  onClick={() => {
                    console.log("Pharmacy details clicked:", pharmacy);
                    onSelectPharmacy && onSelectPharmacy(pharmacy);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: "rgba(0, 0, 0, 0.1)",
                    color: "#000000",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Eye className="w-3 h-3" />
                  View Details
                </button>
                
                <button
                  onClick={() => onToggleUserStatus && onToggleUserStatus(pharmacy._id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: pharmacy.isActive ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                    color: pharmacy.isActive ? "#EF4444" : "#22C55E",
                    border: `1px solid ${pharmacy.isActive ? "#EF4444" : "#22C55E"}40`,
                  }}
                >
                  {pharmacy.isActive ? (
                    <>
                      <ToggleRight className="w-3 h-3" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-3 h-3" />
                      Activate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmaciesSection;