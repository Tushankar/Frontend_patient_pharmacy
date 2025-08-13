import React, { useState } from "react";
import {
  ChevronRight,
  MessageCircle,
  FileText,
  ShoppingCart,
  Package,
  Truck,
  Eye,
  Clock,
  User,
  Pill,
  Activity,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import getStatusColor from "../../utils/getStatusColor";
import PrescriptionApprovals from "./PrescriptionApprovals";
import PrescriptionChatModal from "./PrescriptionChatModal";
import PatientOrderTracking from "./PatientOrderTracking";

const ActivePrescriptions = ({
  title = "Active Prescriptions",
  prescriptions = [],
  onPrescriptionUpdate,
}) => {
  console.log("ActivePrescriptions prescriptions:", prescriptions);
  console.log(
    "Prescription statuses:",
    prescriptions.map((p) => ({
      id: p?.prescriptionId?._id,
      status: p?.status,
    }))
  );
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showApprovals, setShowApprovals] = useState({});
  const [showOrderTracking, setShowOrderTracking] = useState({});
  const [chatModal, setChatModal] = useState({
    isOpen: false,
    threadId: null,
    pharmacyName: "",
    prescriptionId: null,
    prescriptionDetails: null,
  });

  // Handler to view prescription file
  const handleViewPrescription = async (id) => {
    try {
      const res = await axiosInstance.get(`/prescriptions/${id}`);
      const url = res?.data?.data?.originalFile?.secureUrl;
      if (url) {
        window.open(url, "_blank");
      } else {
        console.error("No secure URL found for prescription file");
      }
    } catch (err) {
      console.error("Failed to fetch prescription:", err);
    }
  };

  // Handler to view OCR processed data
  const handleViewOCR = async (id) => {
    try {
      const res = await axiosInstance.get(`/prescriptions/${id}`);
      console.log("handleViewOCR response data:", res?.data);
      const ocrData = res?.data?.data?.ocrData;
      if (!ocrData) {
        alert("No OCR data available. Processing may still be in progress.");
        return;
      }
      // Show OCR extracted text in modal
      setModalText(ocrData?.extractedText || "");
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch OCR data:", err);
    }
  };

  // Handler to toggle approval view
  const handleToggleApprovals = (prescriptionId) => {
    console.log("Toggling approvals for prescription:", prescriptionId);
    console.log("Current showApprovals state:", showApprovals);
    setShowApprovals((prev) => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId],
    }));
  };

  // Handler to toggle order tracking view
  const handleToggleOrderTracking = (prescriptionId) => {
    console.log("Toggling order tracking for prescription:", prescriptionId);
    setShowOrderTracking((prev) => ({
      ...prev,
      [prescriptionId]: !prev[prescriptionId],
    }));
  };

  // Handler when pharmacy is selected
  const handlePharmacySelected = (prescriptionId, pharmacyId) => {
    if (onPrescriptionUpdate) {
      onPrescriptionUpdate(prescriptionId, { status: "accepted", pharmacyId });
    }
    // Refresh the prescription data to show updated status
    window.location.reload(); // Simple refresh for now
  };

  // Handler to start chat
  const handleChatInit = (chatData) => {
    const prescription = prescriptions.find(
      (p) => p?.prescriptionId?._id === chatData?.prescriptionId
    );

    setChatModal({
      isOpen: true,
      threadId: chatData?.threadId,
      pharmacyName: chatData?.pharmacyName,
      prescriptionId: chatData?.prescriptionId,
      prescriptionDetails: prescription
        ? {
            status: prescription?.status,
            createdAt:
              prescription?.prescriptionId?.createdAt ||
              prescription?.createdAt,
            description:
              prescription?.prescriptionId?.description ||
              prescription?.description,
          }
        : null,
    });
  };

  // Handler to close chat
  const handleCloseChat = () => {
    setChatModal({
      isOpen: false,
      threadId: null,
      pharmacyName: "",
      prescriptionId: null,
      prescriptionDetails: null,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Pill className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">
              Track your prescription status and orders
            </p>
          </div>
        </div>
        <button className="text-blue-600 text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Prescriptions
            </h3>
            <p className="text-gray-600">
              Upload a prescription to get started
            </p>
          </div>
        ) : (
          prescriptions.map((prescription) => (
            <div
              key={prescription?.prescriptionId?._id || prescription?.id}
              className="p-6 hover:bg-gray-50 transition-all duration-200"
            >
              <div
                className={`cursor-pointer ${
                  showApprovals[prescription?.prescriptionId?._id]
                    ? "bg-blue-50 rounded-xl p-4"
                    : ""
                }`}
                onClick={() =>
                  handleToggleApprovals(prescription?.prescriptionId?._id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                        <Pill className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {prescription?.medication}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Activity className="w-4 h-4" />
                              <span className="font-medium">Dosage:</span>
                              <span>{prescription?.dosage}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span className="font-medium">
                                Prescribed by:
                              </span>
                              <span>{prescription?.doctor}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Package className="w-4 h-4" />
                              <span className="font-medium">Refills:</span>
                              <span>{prescription?.refills}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">Date:</span>
                              <span>
                                {new Date(
                                  prescription?.prescriptionId?.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Status Badge */}
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              prescription?.status
                            )}`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {prescription?.status?.toUpperCase()}
                          </span>

                          {prescription?.status === "processed" && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              Pharmacy approvals ready
                            </div>
                          )}

                          {prescription?.status === "pending_approval" && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                              Waiting for pharmacy responses
                            </div>
                          )}

                          {prescription?.status === "accepted" && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Ready for pickup/delivery
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPrescription(
                                prescription?.prescriptionId?._id
                              );
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            View File
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOCR(prescription?.prescriptionId?._id);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-all duration-200"
                          >
                            <FileText className="w-4 h-4" />
                            View OCR
                          </button>

                          {/* Pharmacy Approvals Button for Processed Prescriptions */}
                          {(prescription?.status === "processed" ||
                            prescription?.status === "pending_approval") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleApprovals(
                                  prescription?.prescriptionId?._id
                                );
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 text-sm font-medium rounded-xl hover:bg-purple-100 transition-all duration-200"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>
                                {prescription?.status === "processed"
                                  ? "Select Pharmacy"
                                  : "View Status"}
                              </span>
                            </button>
                          )}

                          {/* Order Tracking Button */}
                          {(prescription?.status === "accepted" ||
                            prescription?.status === "preparing" ||
                            prescription?.status === "ready" ||
                            prescription?.status === "delivered") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleOrderTracking(
                                  prescription?.prescriptionId?._id
                                );
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 text-sm font-medium rounded-xl hover:bg-orange-100 transition-all duration-200"
                            >
                              <Package className="w-4 h-4" />
                              Track Order
                            </button>
                          )}

                          {/* Chat Button */}
                          {(prescription?.status === "accepted" ||
                            prescription?.status === "preparing" ||
                            prescription?.status === "ready") && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChatInit({
                                  threadId: null,
                                  pharmacyName:
                                    prescription?.pharmacyName ||
                                    "Selected Pharmacy",
                                  prescriptionId:
                                    prescription?.prescriptionId?._id,
                                });
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-xl hover:bg-green-100 transition-all duration-200"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescription Approvals Section */}
                {showApprovals[prescription?.prescriptionId?._id] &&
                  (prescription?.status === "processed" ||
                    prescription?.status === "accepted" ||
                    prescription?.status === "pending_approval") && (
                    <div className="mt-4 border-t pt-4">
                      <PrescriptionApprovals
                        prescriptionId={prescription?.prescriptionId?._id}
                        onPharmacySelected={(pharmacyId) =>
                          handlePharmacySelected(
                            prescription?.prescriptionId?._id,
                            pharmacyId
                          )
                        }
                        onChatInit={handleChatInit}
                      />
                    </div>
                  )}

                {/* Order Tracking Section */}
                {showOrderTracking[prescription?.prescriptionId?._id] &&
                  (prescription?.status === "accepted" ||
                    prescription?.status === "preparing" ||
                    prescription?.status === "ready" ||
                    prescription?.status === "delivered") && (
                    <div className="mt-4 border-t pt-4">
                      <PatientOrderTracking
                        prescriptionId={prescription?.prescriptionId?._id}
                      />
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* OCR Text Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                OCR Extracted Text
              </h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border">
                {modalText || "No text extracted."}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatModal.isOpen && (
        <PrescriptionChatModal
          threadId={chatModal.threadId}
          pharmacyName={chatModal.pharmacyName}
          prescriptionId={chatModal.prescriptionId}
          prescriptionDetails={chatModal.prescriptionDetails}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default ActivePrescriptions;
