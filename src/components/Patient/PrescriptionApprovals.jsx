import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  MessageCircle,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  ShoppingCart,
  ChevronDown,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const PrescriptionApprovals = ({
  prescriptionId,
  onPharmacySelected,
  onChatInit,
}) => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [error, setError] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDropdownPharmacy, setSelectedDropdownPharmacy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovals();
  }, [prescriptionId]);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      // Get both approvals and order status
      const [approvalsRes, orderRes] = await Promise.all([
        axiosInstance.get(`/prescriptions/${prescriptionId}/approvals`),
        axiosInstance.get(`/prescriptions/${prescriptionId}/order-status`),
      ]);

      setApprovals(approvalsRes.data.data.approvals);
      setOrderStatus(orderRes.data.data);

      // Set selected pharmacy if already chosen
      if (orderRes.data.data.selectedPharmacy) {
        setSelectedPharmacy(orderRes.data.data.selectedPharmacy._id);
      }
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
      setError("Failed to load pharmacy approvals");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPharmacy = async (pharmacyId) => {
    try {
      const res = await axiosInstance.patch(
        `/prescriptions/${prescriptionId}/select-pharmacy`,
        {
          pharmacyId,
        }
      );
      setSelectedPharmacy(pharmacyId);
      setSelectedDropdownPharmacy(""); // Reset dropdown
      setShowDropdown(false);
      setOrderStatus((prev) => ({
        ...prev,
        selectedPharmacy: res.data.data.selectedPharmacy,
        orderStatus: res.data.data.status,
        canPlaceOrder: false,
        canChat: true,
      }));
      onPharmacySelected && onPharmacySelected(pharmacyId);
    } catch (err) {
      console.error("Failed to select pharmacy:", err);
      setError("Failed to select pharmacy");
    }
  };

  const handleDropdownSelection = () => {
    if (selectedDropdownPharmacy) {
      handleSelectPharmacy(selectedDropdownPharmacy);
    }
  };

  const handleStartChat = async (pharmacyId, pharmacyName) => {
    try {
      const res = await axiosInstance.post("/chat/init", {
        pharmacyId,
        prescriptionId,
      });
      onChatInit &&
        onChatInit({
          threadId: res.data.data.threadId,
          pharmacyName,
          prescriptionId,
        });
    } catch (err) {
      console.error("Failed to start chat:", err);
      setError("Failed to start chat");
    }
  };

  const handleViewPharmacyDetails = (pharmacyId) => {
    navigate(`/patient/pharmacy/${pharmacyId}`, {
      state: {
        prescriptionInfo: {
          prescriptionId,
        },
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "border-green-200 bg-green-50";
      case "rejected":
        return "border-red-200 bg-red-50";
      default:
        return "border-yellow-200 bg-yellow-50";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg shadow-sm p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  const approvedPharmacies = approvals.filter(
    (approval) => approval.status === "approved"
  );

  return (
    <div className=" rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Pharmacy Approvals ({approvedPharmacies.length} approved)
        </h2>
        {orderStatus?.selectedPharmacy && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">
              Order placed with {orderStatus.selectedPharmacy.pharmacyName}
            </span>
          </div>
        )}
      </div>

      {/* Pharmacy Selection Dropdown */}
      {approvedPharmacies.length > 0 && !orderStatus?.selectedPharmacy && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">
              Select Pharmacy to Place Order
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <select
                  value={selectedDropdownPharmacy}
                  onChange={(e) => setSelectedDropdownPharmacy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">Select a pharmacy...</option>
                  {approvedPharmacies.map((approval) => (
                    <option
                      key={approval.pharmacyId._id}
                      value={approval.pharmacyId._id}
                    >
                      {approval.pharmacyId.pharmacyName} -{" "}
                      {approval.pharmacyId.contactInfo?.phone || "No phone"}
                      {approval.pharmacyId.address?.city &&
                        ` (${approval.pharmacyId.address.city})`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {selectedDropdownPharmacy && (
                <button
                  onClick={() =>
                    handleViewPharmacyDetails(selectedDropdownPharmacy)
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              )}

              <button
                onClick={handleDropdownSelection}
                disabled={!selectedDropdownPharmacy}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedDropdownPharmacy
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Place Order</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {approvedPharmacies.length}{" "}
            {approvedPharmacies.length === 1
              ? "pharmacy has"
              : "pharmacies have"}{" "}
            approved your prescription.
          </p>
        </div>
      )}

      {/* Order Status Banner */}
      {orderStatus?.selectedPharmacy && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900">
                Order Status:{" "}
                {orderStatus.orderStatus.charAt(0).toUpperCase() +
                  orderStatus.orderStatus.slice(1)}
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Your prescription order has been placed with{" "}
                {orderStatus.selectedPharmacy.pharmacyName}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  handleViewPharmacyDetails(orderStatus.selectedPharmacy._id)
                }
                className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
              {orderStatus.canChat && (
                <button
                  onClick={() =>
                    handleStartChat(
                      orderStatus.selectedPharmacy._id,
                      orderStatus.selectedPharmacy.pharmacyName
                    )
                  }
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Pharmacy</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {approvals.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-300">Waiting for pharmacy responses...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            All Pharmacy Responses ({approvals.length} total)
          </h3>
          {approvals.map((approval) => (
            <div
              key={approval.pharmacyId._id}
              className={`border rounded-lg p-4 transition-all ${getStatusColor(
                approval.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(approval.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {approval.pharmacyId.pharmacyName}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      {approval.pharmacyId.contactInfo?.phone && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{approval.pharmacyId.contactInfo.phone}</span>
                        </div>
                      )}
                      {(approval.pharmacyId.address?.city ||
                        approval.pharmacyId.address?.state) && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {approval.pharmacyId.address?.city &&
                            approval.pharmacyId.address?.state
                              ? `${approval.pharmacyId.address.city}, ${approval.pharmacyId.address.state}`
                              : approval.pharmacyId.address?.city ||
                                approval.pharmacyId.address?.state ||
                                "Location not available"}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {approval.status === "pending"
                        ? "Waiting for response..."
                        : `${
                            approval.status.charAt(0).toUpperCase() +
                            approval.status.slice(1)
                          } ${
                            approval.respondedAt
                              ? `on ${new Date(
                                  approval.respondedAt
                                ).toLocaleDateString()}`
                              : ""
                          }`}
                    </p>
                  </div>
                </div>

                {approval.status === "approved" &&
                  !orderStatus?.selectedPharmacy && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleViewPharmacyDetails(approval.pharmacyId._id)
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() =>
                          handleSelectPharmacy(approval.pharmacyId._id)
                        }
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Place Order</span>
                      </button>
                    </div>
                  )}

                {/* Show View Details button for all other statuses */}
                {(approval.status !== "approved" ||
                  orderStatus?.selectedPharmacy) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleViewPharmacyDetails(approval.pharmacyId._id)
                      }
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                )}
              </div>

              {selectedPharmacy === approval.pharmacyId._id && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-800 font-medium">
                      ✓ Selected for fulfillment - Order placed successfully!
                    </p>
                    <button
                      onClick={() =>
                        handleViewPharmacyDetails(approval.pharmacyId._id)
                      }
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {approvedPharmacies.length > 0 && !orderStatus?.selectedPharmacy && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Ready to Order</h3>
          </div>
          <p className="text-sm text-blue-800">
            {approvedPharmacies.length}{" "}
            {approvedPharmacies.length === 1
              ? "pharmacy has"
              : "pharmacies have"}{" "}
            approved your prescription. Select your preferred pharmacy to place
            your order and start chatting with them about your prescription.
          </p>
        </div>
      )}

      {/* No approved pharmacies yet */}
      {approvedPharmacies.length === 0 && approvals.length > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-900">
              Waiting for Approvals
            </h3>
          </div>
          <p className="text-sm text-yellow-800">
            Your prescription has been sent to {approvals.length}{" "}
            {approvals.length === 1 ? "pharmacy" : "pharmacies"}. We'll notify
            you as soon as they respond to your request.
          </p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionApprovals;
