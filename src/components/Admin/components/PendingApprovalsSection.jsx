import React from "react";
import {
  Clock,
  Mail,
  Phone,
  Shield,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";

const PendingApprovalsSection = ({ approvals, loading, onSelectApproval }) => {
  const pendingApprovals = approvals || [];

  if (loading) {
    return (
      <div 
        className="space-y-6 p-6 rounded-xl"
        style={{ backgroundColor: "#256C5C" }}
      >
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Pending Pharmacy Approvals
        </h2>
        <div 
          className="flex justify-center py-12 rounded-lg"
          style={{ backgroundColor: "#CAE7E1" }}
        >
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#FDE047", borderTopColor: "transparent" }}
          ></div>
        </div>
      </div>
    );
  }

  if (pendingApprovals.length === 0) {
    return (
      <div 
        className="space-y-6 p-6 rounded-xl"
        style={{ backgroundColor: "#256C5C" }}
      >
        <h2
          className="text-2xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Pending Pharmacy Approvals
        </h2>
        <div
          className="rounded-xl p-12 text-center"
          style={{
            backgroundColor: "#CAE7E1",
            border: "1px solid rgba(253, 224, 71, 0.2)",
          }}
        >
          <Clock
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#256C5C" }}
          />
          <p className="text-lg" style={{ color: "#256C5C" }}>
            No pending approvals
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "#256C5C", opacity: 0.8 }}
          >
            All pharmacy applications have been reviewed
          </p>
        </div>
      </div>
    );
  }

  // Generate initials for pharmacy names
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div 
      className="space-y-6 p-6 rounded-xl"
      style={{ backgroundColor: "#256C5C" }}
    >
      <h2
        className="text-2xl font-bold"
        style={{
          color: "#DBF5F0",
          fontFamily: "Playfair Display, serif",
        }}
      >
        Pending Pharmacy Approvals
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div
          className="rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: "#CAE7E1",
            border: "1px solid rgba(253, 224, 71, 0.2)",
          }}
        >
          {/* Table Header */}
          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: "rgba(37, 108, 92, 0.2)",
              borderBottomColor: "rgba(253, 224, 71, 0.2)",
            }}
          >
            <div className="grid grid-cols-6 gap-4 font-semibold text-black">
              <div>Pharmacy Name</div>
              <div>Contact Info</div>
              <div>License</div>
              <div>Location</div>
              <div>Applied Date</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y" style={{ divideColor: "rgba(253, 224, 71, 0.2)" }}>
            {pendingApprovals.map((approval, index) => (
              <div
                key={approval._id}
                className="px-6 py-4 hover:bg-opacity-80 transition-colors duration-200"
                style={{
                  backgroundColor: "#CAE7E1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#B8DDD6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#CAE7E1";
                }}
              >
                <div className="grid grid-cols-6 gap-4 items-center">
                  {/* Pharmacy Name */}
                  <div>
                    <h3 className="font-semibold text-black">
                      {approval.pharmacyData.pharmacyName}
                    </h3>
                    <span
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
                      style={{
                        backgroundColor: "rgba(253, 224, 71, 0.2)",
                        color: "#000000",
                      }}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-sm">
                    <p className="text-black break-words">
                      {approval.pharmacyData.email}
                    </p>
                    <p className="text-black">
                      {approval.pharmacyData.phone}
                    </p>
                  </div>

                  {/* License */}
                  <div className="text-black font-medium">
                    {approval.pharmacyData.licenseNumber}
                  </div>

                  {/* Location */}
                  <div className="text-black">
                    {approval.pharmacyData.address.city}, {approval.pharmacyData.address.state}
                  </div>

                  {/* Applied Date */}
                  <div className="text-black">
                    {new Date(approval.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div>
                    <button
                      onClick={() => onSelectApproval(approval)}
                      className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium text-black hover:text-white"
                      style={{
                        backgroundColor: "#000000",
                        color: "#FFFFFF",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#374151";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#000000";
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {pendingApprovals.map((approval) => (
          <div
            key={approval._id}
            className="rounded-xl shadow-lg p-4"
            style={{
              backgroundColor: "#CAE7E1",
              border: "1px solid rgba(253, 224, 71, 0.2)",
            }}
          >
            {/* Header with Avatar and Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                    color: "#115E59",
                  }}
                >
                  {getInitials(approval.pharmacyData.pharmacyName)}
                </div>
                <div>
                  <h3 className="font-semibold text-black text-sm">
                    {approval.pharmacyData.pharmacyName}
                  </h3>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
                    style={{
                      backgroundColor: "rgba(253, 224, 71, 0.2)",
                      color: "#000000",
                    }}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" style={{ color: "#FDE047" }} />
                <span className="text-black break-words">
                  {approval.pharmacyData.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" style={{ color: "#FDE047" }} />
                <span className="text-black">
                  {approval.pharmacyData.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" style={{ color: "#FDE047" }} />
                <span className="text-black">
                  License: {approval.pharmacyData.licenseNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" style={{ color: "#FDE047" }} />
                <span className="text-black">
                  {approval.pharmacyData.address.city}, {approval.pharmacyData.address.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" style={{ color: "#FDE047" }} />
                <span className="text-black">
                  Applied: {new Date(approval.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Separator */}
            <hr 
              className="my-3" 
              style={{ 
                borderColor: "rgba(0, 0, 0, 0.2)",
                borderWidth: "0.5px 0 0 0"
              }} 
            />

            {/* Action Button */}
            <button
              onClick={() => onSelectApproval(approval)}
              className="w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-white"
              style={{
                backgroundColor: "#000000",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#374151";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#000000";
              }}
            >
              <Eye className="w-4 h-4" />
              Review Application
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingApprovalsSection;