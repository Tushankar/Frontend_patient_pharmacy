import React from "react";
import {
  X,
  Users,
  Info,
  Phone,
  Heart,
  FileText,
  AlertTriangle,
  Pill,
  CheckCircle,
  XCircle,
} from "lucide-react";

const PatientDetailsModal = ({
  selectedPatient,
  onClose,
  onToggleUserStatus,
}) => {
  if (!selectedPatient) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: "#256C5C",
          border: "2px solid rgba(253, 224, 71, 0.4)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(253, 224, 71, 0.1)",
        }}
      >
        <div
          className="p-6"
          style={{
            backgroundColor: "rgba(37, 108, 92, 0.8)",
            borderBottom: "1px solid rgba(253, 224, 71, 0.3)",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3
                className="text-2xl font-bold"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Patient Details
              </h3>
              <p
                className="mt-1"
                style={{
                  color: "#A7F3D0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Complete information about the patient
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:scale-105"
              style={{
                color: "#000000",
                background: "rgba(253, 224, 71, 0.1)",
                border: "1px solid rgba(253, 224, 71, 0.2)",
              }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" style={{ color: "#000000" }} />
                <h4
                  className="text-xl font-semibold"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {selectedPatient?.firstName} {selectedPatient?.lastName}
                </h4>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium`}
                style={{
                  background: selectedPatient?.isActive
                    ? "rgba(34, 197, 94, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                  color: selectedPatient?.isActive ? "#A7F3D0" : "#FCA5A5",
                  border: selectedPatient?.isActive
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2`}
                  style={{
                    background: selectedPatient?.isActive
                      ? "#22C55E"
                      : "#EF4444",
                  }}
                />
                {selectedPatient?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div
                className="rounded-xl p-5 shadow-lg"
                style={{
                  backgroundColor: "#CAE7E1",
                  border: "1px solid rgba(253, 224, 71, 0.3)",
                  backdropFilter: "blur(10px)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                }}
              >
                <h5
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{
                    color: "#256C5C",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <Info className="w-4 h-4" style={{ color: "#000000" }} />
                  Basic Information
                </h5>
                <div className="space-y-3">
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Full Name
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {selectedPatient?.firstName} {selectedPatient?.lastName}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Date of Birth
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {selectedPatient?.dateOfBirth
                        ? new Date(
                            selectedPatient.dateOfBirth
                          ).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Gender
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {selectedPatient?.gender || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Email Verified
                    </p>
                    <p className="text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                        style={{
                          background: selectedPatient?.isEmailVerified
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(251, 191, 36, 0.2)",
                          color: selectedPatient?.isEmailVerified
                            ? "#166534"
                            : "#92400E",
                          border: selectedPatient?.isEmailVerified
                            ? "1px solid rgba(34, 197, 94, 0.3)"
                            : "1px solid rgba(251, 191, 36, 0.3)",
                        }}
                      >
                        {selectedPatient?.isEmailVerified
                          ? "VERIFIED"
                          : "PENDING"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Member Since
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {selectedPatient?.createdAt
                        ? new Date(
                            selectedPatient.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div
                className="rounded-xl p-5 shadow-lg"
                style={{
                  backgroundColor: "#CAE7E1",
                  border: "1px solid rgba(253, 224, 71, 0.3)",
                  backdropFilter: "blur(10px)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                }}
              >
                <h5
                  className="text-sm font-semibold mb-3 flex items-center gap-2"
                  style={{
                    color: "#256C5C",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: "#000000" }} />
                  Contact Information
                </h5>
                <div className="space-y-3">
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Email
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {selectedPatient?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Phone
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {selectedPatient?.phone || "Not provided"}
                    </p>
                  </div>
                  {selectedPatient?.address && (
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{
                          color: "#115E59",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Address
                      </p>
                      <p className="text-sm" style={{ color: "#000000" }}>
                        {[
                          selectedPatient.address.street,
                          selectedPatient.address.city,
                          selectedPatient.address.state,
                          selectedPatient.address.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedPatient?.emergencyContact && (
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{
                          color: "#115E59",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Emergency Contact
                      </p>
                      <p className="text-sm" style={{ color: "#000000" }}>
                        {selectedPatient.emergencyContact.name} (
                        {selectedPatient.emergencyContact.relationship})
                        <br />
                        {selectedPatient.emergencyContact.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div
              className="rounded-xl p-5 shadow-lg"
              style={{
                backgroundColor: "#CAE7E1",
                border: "1px solid rgba(253, 224, 71, 0.3)",
                backdropFilter: "blur(10px)",
                boxShadow:
                  "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h5
                className="text-sm font-semibold mb-3 flex items-center gap-2"
                style={{
                  color: "#256C5C",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <Heart className="w-4 h-4" style={{ color: "#000000" }} />
                Health Information Summary
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#000000" }}
                  >
                    {selectedPatient?.medicalHistory?.length || 0}
                  </div>
                  <div className="text-xs" style={{ color: "#115E59" }}>
                    Medical Records
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#EF4444" }}
                  >
                    {selectedPatient?.allergies?.length || 0}
                  </div>
                  <div className="text-xs" style={{ color: "#115E59" }}>
                    Allergies
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#22C55E" }}
                  >
                    {selectedPatient?.currentMedications?.length || 0}
                  </div>
                  <div className="text-xs" style={{ color: "#115E59" }}>
                    Current Medications
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-lg font-bold"
                    style={{ color: "#A855F7" }}
                  >
                    {selectedPatient?.prescriptionHistory?.length || 0}
                  </div>
                  <div className="text-xs" style={{ color: "#115E59" }}>
                    Prescriptions
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            {selectedPatient?.medicalHistory &&
              selectedPatient.medicalHistory.length > 0 && (
                <div
                  className="rounded-xl p-5 shadow-lg"
                  style={{
                    backgroundColor: "#CAE7E1",
                    border: "1px solid rgba(253, 224, 71, 0.3)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <h5
                    className="text-sm font-semibold mb-3 flex items-center gap-2"
                    style={{
                      color: "#256C5C",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <FileText
                      className="w-4 h-4"
                      style={{ color: "#000000" }}
                    />
                    Medical History
                  </h5>
                  <div className="space-y-3">
                    {selectedPatient.medicalHistory
                      .slice(0, 5)
                      .map((record, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            border: "1px solid rgba(253, 224, 71, 0.2)",
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h6
                                className="font-medium"
                                style={{ color: "#000000" }}
                              >
                                {record.condition}
                              </h6>
                              <p
                                className="text-sm"
                                style={{ color: "#374151" }}
                              >
                                Diagnosed:{" "}
                                {record.diagnosedDate
                                  ? new Date(
                                      record.diagnosedDate
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </p>
                              {record.doctor && (
                                <p
                                  className="text-sm"
                                  style={{ color: "#374151" }}
                                >
                                  Doctor: {record.doctor}
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full`}
                              style={{
                                background:
                                  record.status === "active"
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : "rgba(156, 163, 175, 0.2)",
                                color:
                                  record.status === "active"
                                    ? "#166534"
                                    : "#6B7280",
                                border:
                                  record.status === "active"
                                    ? "1px solid rgba(34, 197, 94, 0.3)"
                                    : "1px solid rgba(156, 163, 175, 0.3)",
                              }}
                            >
                              {record.status || "active"}
                            </span>
                          </div>
                        </div>
                      ))}
                    {selectedPatient.medicalHistory.length > 5 && (
                      <p
                        className="text-sm text-center"
                        style={{ color: "#115E59", opacity: 0.8 }}
                      >
                        ... and {selectedPatient.medicalHistory.length - 5} more
                        records
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Current Allergies */}
            {selectedPatient?.allergies &&
              selectedPatient.allergies.length > 0 && (
                <div
                  className="rounded-xl p-5 shadow-lg"
                  style={{
                    backgroundColor: "#FEE2E2",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <h5
                    className="text-sm font-semibold mb-3 flex items-center gap-2"
                    style={{
                      color: "#DC2626",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <AlertTriangle
                      className="w-4 h-4"
                      style={{ color: "#EF4444" }}
                    />
                    Allergies
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h6
                              className="font-medium"
                              style={{ color: "#DC2626" }}
                            >
                              {allergy.allergen}
                            </h6>
                            <p className="text-sm" style={{ color: "#EF4444" }}>
                              {allergy.reaction}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full`}
                            style={{
                              background:
                                allergy.severity === "severe"
                                  ? "rgba(239, 68, 68, 0.2)"
                                  : allergy.severity === "moderate"
                                  ? "rgba(251, 191, 36, 0.2)"
                                  : "rgba(34, 197, 94, 0.2)",
                              color:
                                allergy.severity === "severe"
                                  ? "#DC2626"
                                  : allergy.severity === "moderate"
                                  ? "#92400E"
                                  : "#166534",
                              border:
                                allergy.severity === "severe"
                                  ? "1px solid rgba(239, 68, 68, 0.3)"
                                  : allergy.severity === "moderate"
                                  ? "1px solid rgba(251, 191, 36, 0.3)"
                                  : "1px solid rgba(34, 197, 94, 0.3)",
                            }}
                          >
                            {allergy.severity || "moderate"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Current Medications */}
            {selectedPatient?.currentMedications &&
              selectedPatient.currentMedications.length > 0 && (
                <div
                  className="rounded-xl p-5 shadow-lg"
                  style={{
                    backgroundColor: "#DCFCE7",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <h5
                    className="text-sm font-semibold mb-3 flex items-center gap-2"
                    style={{
                      color: "#166534",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <Pill className="w-4 h-4" style={{ color: "#22C55E" }} />
                    Current Medications
                  </h5>
                  <div className="space-y-3">
                    {selectedPatient.currentMedications.map(
                      (medication, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                          }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <h6
                                className="font-medium"
                                style={{ color: "#166534" }}
                              >
                                {medication.name}
                              </h6>
                              <p
                                className="text-sm"
                                style={{ color: "#22C55E" }}
                              >
                                Dosage: {medication.dosage}
                              </p>
                            </div>
                            <div>
                              <p
                                className="text-sm"
                                style={{ color: "#374151", opacity: 0.8 }}
                              >
                                Frequency
                              </p>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "#000000" }}
                              >
                                {medication.frequency}
                              </p>
                            </div>
                            <div>
                              <p
                                className="text-sm"
                                style={{ color: "#374151", opacity: 0.8 }}
                              >
                                Duration
                              </p>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "#000000" }}
                              >
                                {medication.startDate
                                  ? new Date(
                                      medication.startDate
                                    ).toLocaleDateString()
                                  : "N/A"}{" "}
                                -
                                {medication.endDate
                                  ? new Date(
                                      medication.endDate
                                    ).toLocaleDateString()
                                  : "Ongoing"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Actions */}
            <div
              className="pt-6"
              style={{ borderTop: "1px solid rgba(253, 224, 71, 0.2)" }}
            >
              <div className="flex gap-3">
                <button
                  onClick={() => onToggleUserStatus(selectedPatient?._id)}
                  className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2`}
                  style={{
                    backgroundColor: selectedPatient?.isActive
                      ? "#DC2626"
                      : "#16A34A",
                    color: "#FFFFFF",
                    border: selectedPatient?.isActive
                      ? "1px solid #B91C1C"
                      : "1px solid #15803D",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPatient?.isActive) {
                      e.currentTarget.style.backgroundColor = "#B91C1C";
                    } else {
                      e.currentTarget.style.backgroundColor = "#15803D";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPatient?.isActive) {
                      e.currentTarget.style.backgroundColor = "#DC2626";
                    } else {
                      e.currentTarget.style.backgroundColor = "#16A34A";
                    }
                  }}
                >
                  {selectedPatient?.isActive ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      Deactivate Patient
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Activate Patient
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 font-semibold rounded-lg transition-colors"
                  style={{
                    backgroundColor: "#6B7280",
                    color: "#FFFFFF",
                    border: "1px solid #4B5563",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#4B5563";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#6B7280";
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;