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
  ChevronLeft,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Show 2 prescriptions per page to prevent overflow

  // Calculate pagination
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrescriptions = prescriptions.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

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
    window.location.reload();
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
    <div className="bg-[#256C5C] rounded-xl lg:rounded-2xl shadow-lg border-2 border-gray-400 shadow-gray-500/30 w-full">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-[#256C5C] rounded-t-xl lg:rounded-t-2xl border-b-2 border-gray-400 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-[#CAE7E1] rounded-xl flex-shrink-0">
            <Pill className="w-5 h-5 text-[#256C5C]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h2>
            <p className="text-sm text-white/80 hidden sm:block">
              Track your prescription status and orders
            </p>
          </div>
        </div>
        <button className="text-white hover:text-white/80 text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex-shrink-0 border border-white/30">
          <span className="hidden sm:inline">View all</span>
          <span className="sm:hidden">View</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-[#CAE7E1] divide-y divide-[#256C5C]/20 overflow-hidden">
        {prescriptions.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4 min-h-[300px] flex flex-col justify-center">
            <div className="p-3 sm:p-4 bg-[#256C5C]/20 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#256C5C]" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-[#256C5C] mb-2">
              No Active Prescriptions
            </h3>
            <p className="text-sm sm:text-base text-[#256C5C]/70">
              Upload a prescription to get started
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {currentPrescriptions.map((prescription, index) => (
              <div
                key={prescription?.prescriptionId?._id || prescription?.id}
                className={`p-4 sm:p-6 hover:bg-[#256C5C]/5 transition-all duration-200 border-2 border-gray-400 bg-white/10 shadow-inner ${
                  index === 0 ? 'shadow-sm' : 'border-t-0'
                }`}
              >
                <div
                  className={`cursor-pointer ${
                    showApprovals[prescription?.prescriptionId?._id]
                      ? "bg-white/30 rounded-xl p-3 sm:p-4 border border-gray-500 shadow-md"
                      : ""
                  }`}
                  onClick={() =>
                    handleToggleApprovals(prescription?.prescriptionId?._id)
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Left side - Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white flex-shrink-0 border border-gray-400 shadow-md">
                          <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="text-base sm:text-lg font-bold text-[#256C5C] mb-2 truncate drop-shadow-sm">
                            {prescription?.medication}
                          </h3>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-[#256C5C] font-medium">
                                <Activity className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="font-semibold">Dosage:</span>
                                <span className="truncate font-medium">{prescription?.dosage}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-[#256C5C] font-medium">
                                <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="font-semibold">Prescribed by:</span>
                                <span className="truncate font-medium">{prescription?.doctor}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-[#256C5C] font-medium">
                                <Package className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="font-semibold">Refills:</span>
                                <span className="font-medium">{prescription?.refills}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-[#256C5C] font-medium">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="font-semibold">Date:</span>
                                <span className="text-xs sm:text-sm font-medium">
                                  {new Date(
                                    prescription?.prescriptionId?.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Status Badge */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <span
                              className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
                                prescription?.status
                              )}`}
                            >
                              <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                              {prescription?.status?.toUpperCase()}
                            </span>

                            {prescription?.status === "processed" && (
                              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-[#256C5C]/30 text-[#256C5C] rounded-full text-xs sm:text-sm font-bold border border-[#256C5C]/40">
                                <div className="w-2 h-2 bg-[#256C5C] rounded-full animate-pulse"></div>
                                <span className="hidden sm:inline">Pharmacy approvals ready</span>
                                <span className="sm:hidden">Approvals ready</span>
                              </div>
                            )}

                            {prescription?.status === "pending_approval" && (
                              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-medium">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="hidden sm:inline">Waiting for pharmacy responses</span>
                                <span className="sm:hidden">Waiting for pharmacy</span>
                              </div>
                            )}

                            {prescription?.status === "accepted" && (
                              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="hidden sm:inline">Ready for pickup/delivery</span>
                                <span className="sm:hidden">Ready</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Action Buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0 w-[120px] sm:w-[140px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPrescription(
                            prescription?.prescriptionId?._id
                          );
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-[#256C5C]/20 text-[#256C5C] text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#256C5C]/30 transition-all duration-200 border border-[#256C5C]/50 shadow-sm w-full h-10"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View File</span>
                        <span className="sm:hidden">File</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOCR(prescription?.prescriptionId?._id);
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-2 bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-indigo-200 transition-all duration-200 border border-indigo-300 shadow-sm w-full h-10"
                      >
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View OCR</span>
                        <span className="sm:hidden">OCR</span>
                      </button>

                      {(prescription?.status === "processed" ||
                        prescription?.status === "pending_approval") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleApprovals(
                              prescription?.prescriptionId?._id
                            );
                          }}
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-purple-100 text-purple-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-purple-200 transition-all duration-200 border border-purple-300 shadow-sm w-full h-10"
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            {prescription?.status === "processed"
                              ? "Pharmacy"
                              : "Status"}
                          </span>
                          <span className="sm:hidden">
                            {prescription?.status === "processed"
                              ? "Pharmacy"
                              : "Status"}
                          </span>
                        </button>
                      )}

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
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-orange-200 transition-all duration-200 border border-orange-300 shadow-sm w-full h-10"
                        >
                          <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Track</span>
                          <span className="sm:hidden">Track</span>
                        </button>
                      )}

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
                          className="flex items-center justify-center gap-1 px-2 py-2 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-green-200 transition-all duration-200 border border-green-300 shadow-sm w-full h-10"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Chat</span>
                          <span className="sm:hidden">Chat</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prescription Approvals Section */}
                {showApprovals[prescription?.prescriptionId?._id] &&
                  (prescription?.status === "processed" ||
                    prescription?.status === "accepted" ||
                    prescription?.status === "pending_approval") && (
                    <div className="mt-3 sm:mt-4 p-3 bg-white/70 rounded-lg border-2 border-gray-400 max-h-40 sm:max-h-48 overflow-y-auto shadow-inner">
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
                    <div className="mt-3 sm:mt-4 p-3 bg-white/70 rounded-lg border-2 border-gray-400 max-h-40 sm:max-h-48 overflow-y-auto shadow-inner">
                      <PatientOrderTracking
                        prescriptionId={prescription?.prescriptionId?._id}
                        onChatInit={handleChatInit}
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {prescriptions.length > 0 && totalPages > 1 && (
        <div className="p-3 sm:p-4 bg-[#CAE7E1] rounded-b-xl lg:rounded-b-2xl border-t-2 border-gray-400 shadow-inner">
          <div className="flex flex-col xs:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-[#256C5C] font-semibold text-center xs:text-left">
              Showing {startIndex + 1} to {Math.min(endIndex, prescriptions.length)} of {prescriptions.length} prescriptions
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Previous Button */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 border ${
                  currentPage === 1
                    ? "text-[#256C5C]/40 cursor-not-allowed border-[#256C5C]/20 shadow-inner"
                    : "text-[#256C5C] hover:text-[#256C5C]/80 hover:bg-[#256C5C]/10 border-[#256C5C]/40 shadow-sm"
                }`}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 border shadow-sm ${
                      currentPage === page
                        ? "bg-[#256C5C] text-white border-[#256C5C] shadow-md"
                        : "text-[#256C5C] hover:text-[#256C5C]/80 hover:bg-[#256C5C]/10 border-[#256C5C]/40"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 border ${
                  currentPage === totalPages
                    ? "text-[#256C5C]/40 cursor-not-allowed border-[#256C5C]/20 shadow-inner"
                    : "text-[#256C5C] hover:text-[#256C5C]/80 hover:bg-[#256C5C]/10 border-[#256C5C]/40 shadow-sm"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OCR Text Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                OCR Extracted Text
              </h3>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-80 sm:max-h-96">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 sm:p-4 rounded-xl border">
                {modalText || "No text extracted."}
              </pre>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg sm:rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
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