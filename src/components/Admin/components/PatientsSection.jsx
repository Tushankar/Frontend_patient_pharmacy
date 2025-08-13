import React from "react";
import { Users, Phone, Mail, Calendar, Eye, ToggleLeft, ToggleRight } from "lucide-react";

const PatientsSection = ({
  patients,
  loading,
  onViewPatientDetails,
  onToggleUserStatus,
}) => {
  // Ensure patients is always an array
  const patientsList = patients || [];

  // Demo data for when no patients are provided
  const demoPatients = [
    {
      _id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      isActive: true
    },
    {
      _id: "2", 
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: "+1 (555) 987-6543",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      isActive: false
    },
    {
      _id: "3",
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@email.com",
      phone: "+1 (555) 456-7890",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      isActive: true
    }
  ];

  const displayPatients = patientsList.length > 0 ? patientsList : demoPatients;

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
            Registered Patients
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

  if (patientsList.length === 0 && demoPatients.length === 0) {
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
            Registered Patients
          </h2>
          <div
            className="rounded-xl p-6 text-center w-full"
            style={{
              background: "rgba(219, 245, 240, 0.1)",
              border: "1px solid rgba(253, 224, 71, 0.2)",
            }}
          >
            <Users
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "#A7F3D0" }}
            />
            <p className="text-base" style={{ color: "#DBF5F0" }}>
              No registered patients
            </p>
            <p
              className="text-sm mt-2"
              style={{ color: "#A7F3D0", opacity: 0.8 }}
            >
              Patients will appear here once they sign up
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
          Registered Patients
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
                      Patient Name
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
                      Registration Date
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
                  {displayPatients.map((patient, index) => (
                    <tr
                      key={patient._id}
                      className="transition-all duration-200"
                      style={{
                        background: "#CAE7E1",
                        borderBottom:
                          index < displayPatients.length - 1
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
                        <div className="flex items-center">
                          <div
                            className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                            style={{
                              background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                            }}
                          >
                            <span
                              className="font-medium"
                              style={{ color: "#115E59" }}
                            >
                              {patient.firstName[0]}
                              {patient.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p
                              className="text-sm font-medium"
                              style={{ color: "#000000" }}
                            >
                              {patient.firstName} {patient.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p style={{ color: "#000000" }}>{patient.email}</p>
                          <p style={{ color: "#000000", opacity: 0.7 }}>
                            {patient.phone}
                          </p>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ color: "#000000" }}
                      >
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                          style={{
                            backgroundColor: patient.isActive
                              ? "rgba(34, 197, 94, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                            color: patient.isActive ? "#22C55E" : "#EF4444",
                            border: `1px solid ${
                              patient.isActive ? "#22C55E" : "#EF4444"
                            }40`,
                          }}
                        >
                          {patient.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewPatientDetails && onViewPatientDetails(patient._id)}
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
                            onClick={() => onToggleUserStatus && onToggleUserStatus(patient._id)}
                            className={`font-medium transition-colors duration-200`}
                            style={{
                              color: patient.isActive ? "#EF4444" : "#22C55E",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.color = patient.isActive
                                ? "#DC2626"
                                : "#16A34A";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = patient.isActive
                                ? "#EF4444"
                                : "#22C55E";
                            }}
                          >
                            {patient.isActive ? "Deactivate" : "Activate"}
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
          {displayPatients.map((patient, index) => (
            <div
              key={patient._id}
              className="w-full rounded-xl shadow-lg p-3 mb-4"
              style={{
                background: "#CAE7E1",
                border: "1px solid rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Header with Avatar and Status */}
              <div className="w-full mb-3">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-3 flex-1" style={{ minWidth: 0 }}>
                    <div
                      className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                      }}
                    >
                      <span
                        className="font-medium text-sm"
                        style={{ color: "#115E59" }}
                      >
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <h3
                        className="text-sm font-semibold"
                        style={{
                          color: "#000000",
                          fontFamily: "Inter, sans-serif",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          lineHeight: "1.3",
                        }}
                      >
                        {patient.firstName} {patient.lastName}
                      </h3>
                    </div>
                  </div>
                  
                  <div>
                    <span
                      className="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                      style={{
                        backgroundColor: patient.isActive
                          ? "rgba(34, 197, 94, 0.2)"
                          : "rgba(239, 68, 68, 0.2)",
                        color: patient.isActive ? "#22C55E" : "#EF4444",
                        border: `1px solid ${
                          patient.isActive ? "#22C55E" : "#EF4444"
                        }40`,
                      }}
                    >
                      {patient.isActive ? "Active" : "Inactive"}
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
                    {patient.email}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Phone className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                  <span className="text-xs" style={{ color: "#000000" }}>
                    {patient.phone}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#000000", opacity: 0.6 }} />
                  <span className="text-xs" style={{ color: "#000000" }}>
                    Registered: {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="w-full space-y-2">
                <button
                  onClick={() => {
                    console.log("Patient details clicked:", patient);
                    onViewPatientDetails && onViewPatientDetails(patient._id);
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
                  onClick={() => onToggleUserStatus && onToggleUserStatus(patient._id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: patient.isActive ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                    color: patient.isActive ? "#EF4444" : "#22C55E",
                    border: `1px solid ${patient.isActive ? "#EF4444" : "#22C55E"}40`,
                  }}
                >
                  {patient.isActive ? (
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

export default PatientsSection;