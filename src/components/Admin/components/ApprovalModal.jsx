import React from "react";
import {
  X,
  Store,
  Phone,
  Mail,
  MapPin,
  Pill,
  Clock,
  Map,
  FileText,
  ExternalLink,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import LocationMap from "./LocationMap";

const ApprovalModal = ({
  selectedApproval,
  onClose,
  approvalAction,
  setApprovalAction,
  remarks,
  setRemarks,
  actionLoading,
  onApprovalAction,
}) => {
  if (!selectedApproval) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: "#256C5C" }}
      >
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: "rgba(37, 108, 92, 0.9)" }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">
                Pharmacy Application Review
              </h3>
              <p className="text-green-100 mt-1">
                Review all details before making a decision
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: "#CAE7E1" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-gray-600" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Pharmacy Name
                  </p>
                  <p className="text-base text-gray-900 font-medium">
                    {selectedApproval.pharmacyData.pharmacyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    License Number
                  </p>
                  <p className="text-base text-gray-900 font-medium">
                    {selectedApproval.pharmacyData.licenseNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Pharmacy Type
                  </p>
                  <p className="text-base text-gray-900">
                    {(
                      selectedApproval.pharmacyData.typeOfPharmacy || ""
                    ).replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Pharmacist Name
                  </p>
                  <p className="text-base text-gray-900">
                    {selectedApproval.pharmacyData.pharmacistName}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: "#CAE7E1" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-600" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </p>
                  <p className="text-base text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedApproval.pharmacyData.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Phone
                  </p>
                  <p className="text-base text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {selectedApproval.pharmacyData.phone}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Address
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>
                      {selectedApproval.pharmacyData.address.street}
                      <br />
                      {selectedApproval.pharmacyData.address.city},{" "}
                      {selectedApproval.pharmacyData.address.state}{" "}
                      {selectedApproval.pharmacyData.address.zipCode}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Services & Operating Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Services */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: "#CAE7E1" }}
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-gray-600" />
                  Services Offered
                </h4>
                <div className="space-y-2">
                  {(selectedApproval.pharmacyData.services || []).map(
                    (service) => (
                      <div key={service} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">
                          {(service || "").replace(/_/g, " ")}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Operating Hours */}
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: "#CAE7E1" }}
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Operating Hours
                </h4>
                <div className="space-y-2">
                  {Object.entries(
                    selectedApproval.pharmacyData.operatingHours
                  ).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize font-medium text-gray-700">
                        {day}
                      </span>
                      <span
                        className={
                          hours.closed ? "text-red-600" : "text-gray-900"
                        }
                      >
                        {hours.closed
                          ? "Closed"
                          : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: "#CAE7E1" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-gray-600" />
                Pharmacy Location
              </h4>
              <LocationMap location={selectedApproval.pharmacyData.location} />
              {selectedApproval.pharmacyData.location &&
                selectedApproval.pharmacyData.location.coordinates && (
                  <p className="text-xs text-gray-500 mt-2">
                    Coordinates:{" "}
                    {selectedApproval.pharmacyData.location.coordinates[1].toFixed(
                      6
                    )}
                    ,{" "}
                    {selectedApproval.pharmacyData.location.coordinates[0].toFixed(
                      6
                    )}
                  </p>
                )}
            </div>

            {/* Documents */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: "#CAE7E1" }}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Uploaded Documents
              </h4>
              <div className="space-y-3">
                {(
                  selectedApproval.pharmacyData.verificationDocuments || []
                ).map((doc, idx) => {
                  const isPDF =
                    doc.documentUrl &&
                    doc.documentUrl.toLowerCase().endsWith(".pdf");
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.documentType || "Document"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded:{" "}
                              {doc.uploadedAt
                                ? new Date(doc.uploadedAt).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open
                          </a>
                          <a
                            href={doc.documentUrl}
                            download
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                      </div>

                      {/* PDF Preview */}
                      {isPDF && (
                        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-100 p-2 text-center">
                            <p className="text-xs text-gray-600">PDF Preview</p>
                          </div>
                          <iframe
                            src={`${doc.documentUrl}#view=FitH`}
                            width="100%"
                            height="500px"
                            style={{ border: "none" }}
                            title={`PDF Preview - ${doc.documentType}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Section */}
            {!approvalAction && (
              <div className="border-t border-gray-400 pt-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setApprovalAction("approve")}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => setApprovalAction("reject")}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </button>
                </div>
              </div>
            )}

            {approvalAction && (
              <div className="border-t border-gray-400 pt-6 space-y-4">
                <div 
                  className="border rounded-lg p-4"
                  style={{ 
                    backgroundColor: "#FEF3C7", 
                    borderColor: "#F59E0B" 
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">
                        {approvalAction === "approve"
                          ? "You are about to approve this pharmacy application"
                          : "You are about to reject this pharmacy application"}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        This action will notify the pharmacy via email.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    {approvalAction === "approve"
                      ? "Approval Remarks (Optional)"
                      : "Rejection Reason (Required)"}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder={
                      approvalAction === "approve"
                        ? "Add any remarks for the pharmacy..."
                        : "Please provide a reason for rejection..."
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    required={approvalAction === "reject"}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setApprovalAction(null);
                      setRemarks("");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onApprovalAction(approvalAction)}
                    disabled={
                      actionLoading || (approvalAction === "reject" && !remarks)
                    }
                    className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      approvalAction === "approve"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
                  >
                    {actionLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {approvalAction === "approve" ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Confirm Approval
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            Confirm Rejection
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;