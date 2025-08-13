import React from "react";
import {
  X,
  Store,
  Info,
  Phone,
  MapPin,
  Pill,
  Clock,
  FileText,
  Map,
  ExternalLink,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LocationMap from "./LocationMap";

const PharmacyDetailsModal = ({
  selectedPharmacy,
  onClose,
  onToggleUserStatus,
}) => {
  if (!selectedPharmacy) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        style={{
          backgroundColor: "#256C5C",
          border: "2px solid rgba(253, 224, 71, 0.4)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(253, 224, 71, 0.1)",
        }}
      >
        <div
          className="p-4 sm:p-6"
          style={{
            backgroundColor: "rgba(37, 108, 92, 0.8)",
            borderBottom: "1px solid rgba(253, 224, 71, 0.3)",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3
                className="text-xl sm:text-2xl font-bold"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Pharmacy Details
              </h3>
              <p
                className="mt-1 text-sm sm:text-base"
                style={{
                  color: "#A7F3D0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Complete information about the pharmacy
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-all duration-300 hover:scale-105"
              style={{
                color: "#FDE047",
                background: "rgba(253, 224, 71, 0.1)",
                border: "1px solid rgba(253, 224, 71, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#115E59";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(253, 224, 71, 0.1)";
                e.currentTarget.style.color = "#FDE047";
              }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Store className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#FDE047" }} />
                <h4
                  className="text-lg sm:text-xl font-semibold"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {selectedPharmacy?.pharmacyName || "Pharmacy Details"}
                </h4>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium self-start sm:self-auto`}
                style={{
                  background: selectedPharmacy?.isActive
                    ? "rgba(34, 197, 94, 0.2)"
                    : "rgba(239, 68, 68, 0.2)",
                  color: selectedPharmacy?.isActive ? "#A7F3D0" : "#FCA5A5",
                  border: selectedPharmacy?.isActive
                    ? "1px solid rgba(34, 197, 94, 0.3)"
                    : "1px solid rgba(239, 68, 68, 0.3)",
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2`}
                  style={{
                    background: selectedPharmacy?.isActive
                      ? "#22C55E"
                      : "#EF4444",
                  }}
                />
                {selectedPharmacy?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Basic Info */}
              <div
                className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                  <Info className="w-4 h-4" style={{ color: "#FDE047" }} />
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
                      License Number
                    </p>
                    <p className="text-sm break-words" style={{ color: "#000000" }}>
                      {selectedPharmacy?.licenseNumber || "N/A"}
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
                      Pharmacy Type
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      {typeof selectedPharmacy?.typeOfPharmacy === "string"
                        ? selectedPharmacy.typeOfPharmacy.replace(/_/g, " ")
                        : selectedPharmacy?.typeOfPharmacy || "N/A"}
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
                      Registered Pharmacist
                    </p>
                    <p className="text-sm break-words" style={{ color: "#000000" }}>
                      {selectedPharmacy?.registeredPharmacist || "N/A"}
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
                      Approval Status
                    </p>
                    <p className="text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full`}
                        style={{
                          background:
                            selectedPharmacy?.approvalStatus === "approved"
                              ? "rgba(34, 197, 94, 0.2)"
                              : selectedPharmacy?.approvalStatus === "pending"
                              ? "rgba(251, 191, 36, 0.2)"
                              : "rgba(239, 68, 68, 0.2)",
                          color:
                            selectedPharmacy?.approvalStatus === "approved"
                              ? "#166534"
                              : selectedPharmacy?.approvalStatus === "pending"
                              ? "#92400E"
                              : "#991B1B",
                          border:
                            selectedPharmacy?.approvalStatus === "approved"
                              ? "1px solid rgba(34, 197, 94, 0.3)"
                              : selectedPharmacy?.approvalStatus === "pending"
                              ? "1px solid rgba(251, 191, 36, 0.3)"
                              : "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        {selectedPharmacy?.approvalStatus?.toUpperCase() ||
                          "N/A"}
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
                      Rating & Reviews
                    </p>
                    <p className="text-sm" style={{ color: "#000000" }}>
                      ⭐ {selectedPharmacy?.rating || 0}/5 (
                      {selectedPharmacy?.reviewCount || 0} reviews)
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div
                className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                  <Phone className="w-4 h-4" style={{ color: "#FDE047" }} />
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
                    <p className="text-sm break-words" style={{ color: "#000000" }}>
                      {selectedPharmacy?.contactInfo?.email ||
                        selectedPharmacy?.email ||
                        "N/A"}
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
                    <p className="text-sm break-words" style={{ color: "#000000" }}>
                      {selectedPharmacy?.contactInfo?.phone ||
                        selectedPharmacy?.phone ||
                        "N/A"}
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
                      Website
                    </p>
                    <p className="text-sm break-words" style={{ color: "#000000" }}>
                      {selectedPharmacy?.website || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div
              className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                <MapPin className="w-4 h-4" style={{ color: "#FDE047" }} />
                Address
              </h5>
              <p className="text-sm break-words" style={{ color: "#000000" }}>
                {selectedPharmacy?.address?.street || "N/A"}
                <br />
                {selectedPharmacy?.address?.city || "N/A"},{" "}
                {selectedPharmacy?.address?.state || "N/A"}{" "}
                {selectedPharmacy?.address?.zipCode || ""}
              </p>
            </div>

            {/* Services and Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Services */}
              <div
                className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                  <Pill className="w-4 h-4" style={{ color: "#FDE047" }} />
                  Services
                </h5>
                <div className="space-y-2">
                  {(selectedPharmacy?.services || []).map((service, index) => {
                    // Handle both string services and object services
                    const serviceName =
                      typeof service === "string"
                        ? service
                        : service?.name || "Unknown Service";
                    const isAvailable =
                      typeof service === "object"
                        ? service?.available !== false
                        : true;

                    return (
                      <div
                        key={service?._id || service || index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle
                          className={`w-3 h-3 flex-shrink-0`}
                          style={{
                            color: isAvailable ? "#22C55E" : "#9CA3AF",
                          }}
                        />
                        <span
                          className="break-words"
                          style={{
                            color: isAvailable ? "#000000" : "#115E59",
                            opacity: isAvailable ? 1 : 0.6,
                          }}
                        >
                          {serviceName.replace(/_/g, " ")}
                          {!isAvailable && " (Not Available)"}
                        </span>
                      </div>
                    );
                  })}
                  {(!selectedPharmacy?.services ||
                    selectedPharmacy.services.length === 0) && (
                    <p
                      className="text-sm"
                      style={{ color: "#115E59", opacity: 0.8 }}
                    >
                      No services listed
                    </p>
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div
                className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                  <Clock className="w-4 h-4" style={{ color: "#FDE047" }} />
                  Operating Hours
                </h5>
                <div className="space-y-1">
                  {selectedPharmacy?.operatingHours &&
                    Object.entries(selectedPharmacy.operatingHours).map(
                      ([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm gap-2">
                          <span
                            className="capitalize flex-shrink-0"
                            style={{ color: "#115E59" }}
                          >
                            {day}
                          </span>
                          <span
                            className="text-right break-words"
                            style={{
                              color: hours.closed ? "#EF4444" : "#000000",
                            }}
                          >
                            {hours.closed
                              ? "Closed"
                              : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* License Documents */}
            {selectedPharmacy?.documents &&
              selectedPharmacy.documents.length > 0 && (
                <div
                  className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                      style={{ color: "#FDE047" }}
                    />
                    License Documents
                  </h5>
                  <div className="space-y-3">
                    {selectedPharmacy.documents.map((document, index) => (
                      <div
                        key={document._id || index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          border: "1px solid rgba(253, 224, 71, 0.2)",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{
                              background: "rgba(253, 224, 71, 0.2)",
                            }}
                          >
                            <FileText
                              className="w-4 h-4"
                              style={{ color: "#FDE047" }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm font-medium break-words"
                              style={{ color: "#000000" }}
                            >
                              {document.originalName || document.filename}
                            </p>
                            <div
                              className="flex flex-wrap items-center gap-2 text-xs mt-1"
                              style={{ color: "#115E59" }}
                            >
                              <span className="capitalize">
                                Type: {document.type || "Other"}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium`}
                                style={{
                                  background: document.verified
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : "rgba(251, 191, 36, 0.2)",
                                  color: document.verified
                                    ? "#166534"
                                    : "#92400E",
                                  border: document.verified
                                    ? "1px solid rgba(34, 197, 94, 0.3)"
                                    : "1px solid rgba(251, 191, 36, 0.3)",
                                }}
                              >
                                {document.verified
                                  ? "Verified"
                                  : "Pending Verification"}
                              </span>
                              {document.uploadedAt && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="text-xs">
                                    Uploaded:{" "}
                                    {new Date(
                                      document.uploadedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {document.cloudinaryUrl && (
                            <a
                              href={document.cloudinaryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg transition-all duration-300"
                              style={{
                                color: "#FDE047",
                                background: "rgba(253, 224, 71, 0.1)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#115E59";
                                e.currentTarget.style.color = "#FFFFFF";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(253, 224, 71, 0.1)";
                                e.currentTarget.style.color = "#FDE047";
                              }}
                              title="View document"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {document.cloudinaryUrl && (
                            <a
                              href={document.cloudinaryUrl}
                              download={
                                document.originalName || document.filename
                              }
                              className="p-2 rounded-lg transition-all duration-300"
                              style={{
                                color: "#22C55E",
                                background: "rgba(34, 197, 94, 0.1)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#115E59";
                                e.currentTarget.style.color = "#FFFFFF";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
                                e.currentTarget.style.color = "#22C55E";
                              }}
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Location Map */}
            {selectedPharmacy?.location && (
              <div
                className="rounded-xl p-4 sm:p-5 shadow-lg"
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
                  <Map className="w-4 h-4" style={{ color: "#FDE047" }} />
                  Location
                </h5>
                <div className="w-full overflow-hidden rounded-lg">
                  <LocationMap location={selectedPharmacy.location} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div
              className="pt-4 sm:pt-6"
              style={{ borderTop: "1px solid rgba(253, 224, 71, 0.2)" }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onToggleUserStatus(selectedPharmacy?._id)}
                  className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  style={{
                    background: selectedPharmacy?.isActive
                      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(37, 108, 92, 0.6) 100%)"
                      : "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 108, 92, 0.6) 100%)",
                    color: selectedPharmacy?.isActive ? "#FCA5A5" : "#A7F3D0",
                    border: selectedPharmacy?.isActive
                      ? "1px solid rgba(239, 68, 68, 0.4)"
                      : "1px solid rgba(34, 197, 94, 0.4)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPharmacy?.isActive) {
                      e.currentTarget.style.backgroundColor = "#DC2626";
                      e.currentTarget.style.color = "#FFFFFF";
                    } else {
                      e.currentTarget.style.backgroundColor = "#16A34A";
                      e.currentTarget.style.color = "#FFFFFF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedPharmacy?.isActive
                      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(37, 108, 92, 0.6) 100%)"
                      : "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 108, 92, 0.6) 100%)";
                    e.currentTarget.style.color = selectedPharmacy?.isActive ? "#FCA5A5" : "#A7F3D0";
                  }}
                >
                  {selectedPharmacy?.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Deactivate Pharmacy</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Activate Pharmacy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 sm:px-6 py-3 font-semibold rounded-lg transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 108, 92, 0.6) 100%)",
                    color: "#A7F3D0",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#115E59";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(37, 108, 92, 0.6) 100%)";
                    e.currentTarget.style.color = "#A7F3D0";
                  }}
                >
                  <span className="text-sm sm:text-base">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsModal;