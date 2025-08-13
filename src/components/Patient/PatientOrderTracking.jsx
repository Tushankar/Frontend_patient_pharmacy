import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Phone
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import OrderChatModal from "../Chat/OrderChatModal";
import { useAuth } from "../Login";

const PatientOrderTracking = ({
  prescriptionId,
  onChatInit,
  compact = false
}) => {
  const { user: currentUser } = useAuth(); // Use the auth context instead of local state
  const [order, setOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Chat state
  const [showChatModal, setShowChatModal] = useState(false);

  const statusConfig = {
    placed: {
      label: "Order Placed",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    preparing: {
      label: "Preparing",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    ready: {
      label: "Ready",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    out_for_delivery: {
      label: "Out for Delivery",
      icon: Truck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    on_hold: {
      label: "On Hold",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      // First, get the prescription to find the order
      const prescriptionResponse = await axiosInstance.get(
        `/prescriptions/${prescriptionId}/order-status`
      );
      const prescriptionData = prescriptionResponse.data.data;

      if (
        prescriptionData.prescription.status === "accepted" &&
        prescriptionData.selectedPharmacy
      ) {
        // Get orders for this prescription
        const ordersResponse = await axiosInstance.get(
          `/orders?prescriptionId=${prescriptionId}`
        );
        const orders = ordersResponse.data.data.orders;

        if (orders.length > 0) {
          const currentOrder = orders[0]; // Should be only one order per prescription
          setOrder(currentOrder);

          // Get order history
          const historyResponse = await axiosInstance.get(
            `/orders/${currentOrder._id}/history`
          );
          setOrderHistory(historyResponse.data.data.timeline);
        }
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prescriptionId) {
      fetchOrderDetails();
    }
  }, [prescriptionId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getStatusInfo = (status) => {
    return statusConfig[status] || statusConfig.placed;
  };

  const getCurrentStatusStep = () => {
    if (!order) return 0;
    const statusOrder = [
      "placed",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
    ];
    return statusOrder.indexOf(order.status) + 1;
  };

  const handleChatWithPharmacy = () => {
    console.log("PatientOrderTracking: handleChatWithPharmacy called");
    console.log("PatientOrderTracking: Order:", order);
    console.log("PatientOrderTracking: Current user:", currentUser);
    console.log("PatientOrderTracking: Order pharmacyId:", order?.pharmacyId);
    console.log(
      "PatientOrderTracking: ShowChatModal state before:",
      showChatModal
    );

    if (order?.pharmacyId) {
      console.log(
        "PatientOrderTracking: PharmacyId found, setting showChatModal to true"
      );
      setShowChatModal(true);
      console.log("PatientOrderTracking: setShowChatModal(true) called");
    } else {
      console.log("PatientOrderTracking: No pharmacyId found in order");
      console.log(
        "PatientOrderTracking: Order structure:",
        JSON.stringify(order, null, 2)
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 font-sans">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#256C5C] font-sans"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-sans">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg font-sans">
        <p className="text-yellow-700 font-sans">
          No active order found for this prescription.
        </p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const currentStep = getCurrentStatusStep();

  return (
    <div className="space-y-6 font-sans">
      {/* Order Header */}
      <div className="border border-[#256C5C]/30 rounded-lg p-6 font-sans bg-[#CAE7E1]">
        <div className="flex items-start justify-between mb-4 font-sans">
          <div>
            <h3 className="text-lg font-semibold font-sans text-black">
              Order #{order.orderNumber}
            </h3>
            <div className="flex items-center space-x-2 mt-1 font-sans">
              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
              {order.isUrgent && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full font-sans">
                  URGENT
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 font-sans">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-1 font-sans"
            >
              <Eye className="w-4 h-4 font-sans" />
              <span>View History</span>
            </button>

            {order.pharmacyId && !compact && (
              <button
                onClick={handleChatWithPharmacy}
                className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-1 font-sans"
              >
                <MessageCircle className="w-4 h-4 font-sans" />
                <span>Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Order Progress Bar */}
        <div className="mb-6 font-sans">
          <div className="flex items-center justify-between mb-2 font-sans">
            <span className="text-sm font-sans text-gray-600">
              Order Progress
            </span>
            <span className="text-sm font-sans text-gray-600">
              {currentStep}/6 steps
            </span>
          </div>
          <div className="w-full rounded-full h-2 font-sans bg-[#256C5C]/20">
            <div
              className="h-2 rounded-full transition-all duration-300 font-sans bg-gradient-to-r from-[#256C5C] to-[#1a4f48]"
              style={{
                width: `${(currentStep / 6) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <div className="flex items-center space-x-2 font-sans">
            <div className="p-2 rounded-full bg-[#256C5C]">
              <Calendar className="w-4 h-4 font-sans text-[#CAE7E1]" />
            </div>
            <div>
              <p className="text-sm font-sans text-gray-600">
                Order Date
              </p>
              <p className="font-medium font-sans text-black">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-sans">
            <div className="p-2 rounded-full bg-[#256C5C]">
              <DollarSign className="w-4 h-4 font-sans text-[#CAE7E1]" />
            </div>
            <div>
              <p className="text-sm font-sans text-gray-600">
                Total Amount
              </p>
              <p className="font-medium font-sans text-black">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-sans">
            <div className="p-2 rounded-full bg-[#256C5C]">
              <Package className="w-4 h-4 font-sans text-[#CAE7E1]" />
            </div>
            <div>
              <p className="text-sm font-sans text-gray-600">
                Order Type
              </p>
              <p className="font-medium capitalize font-sans text-black">
                {order.orderType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacy Information */}
      {order.pharmacyId && (
        <div className="border border-[#256C5C]/30 rounded-lg p-6 font-sans bg-[#CAE7E1]">
          <h4 className="font-medium mb-3 font-sans text-black">
            Pharmacy Information
          </h4>
          <div className="flex items-start justify-between font-sans">
            <div className="space-y-2 font-sans">
              <p className="font-medium font-sans text-black">
                {order.pharmacyId.pharmacyName}
              </p>
              {order.pharmacyId.contactInfo?.phone && (
                <div className="flex items-center space-x-2 font-sans">
                  <div className="p-1 rounded-full bg-[#256C5C]">
                    <Phone className="w-3 h-3 font-sans text-[#CAE7E1]" />
                  </div>
                  <span className="text-sm font-sans text-gray-700">
                    {order.pharmacyId.contactInfo.phone}
                  </span>
                </div>
              )}
              {order.pharmacyId.address && (
                <div className="flex items-center space-x-2 font-sans">
                  <div className="p-1 rounded-full bg-[#256C5C]">
                    <MapPin className="w-3 h-3 font-sans text-[#CAE7E1]" />
                  </div>
                  <span className="text-sm font-sans text-gray-700">
                    {order.pharmacyId.address.city},{" "}
                    {order.pharmacyId.address.state}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="border border-[#256C5C]/30 rounded-lg p-6 font-sans bg-[#CAE7E1]">
        <h4 className="font-medium mb-3 font-sans text-black">
          Order Items
        </h4>
        <div className="space-y-3 font-sans">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 rounded-lg border border-[#256C5C]/20 font-sans bg-white"
            >
              <div>
                <p className="font-medium font-sans text-black">
                  {item.medicationName}
                </p>
                <p className="text-sm font-sans text-gray-600">
                  {item.dosage}
                </p>
                <p className="text-sm font-sans text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right font-sans">
                <p className="font-medium font-sans text-black">
                  {formatCurrency(item.totalPrice)}
                </p>
                {item.unitPrice > 0 && (
                  <p className="text-sm font-sans text-gray-500">
                    {formatCurrency(item.unitPrice)} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery/Pickup Information */}
      {order.orderType === "delivery" && order.deliveryInfo && (
        <div className="border border-[#256C5C]/30 rounded-lg p-6 font-sans bg-[#CAE7E1]">
          <h4 className="font-medium mb-3 font-sans text-black">
            Delivery Information
          </h4>
          <div className="space-y-2 font-sans">
            {order.deliveryInfo.address && (
              <div>
                <p className="text-sm text-gray-600 font-sans">Delivery Address:</p>
                <p className="font-medium font-sans text-black">
                  {order.deliveryInfo.address.street},{" "}
                  {order.deliveryInfo.address.city},{" "}
                  {order.deliveryInfo.address.state}{" "}
                  {order.deliveryInfo.address.zipCode}
                </p>
              </div>
            )}
            {order.deliveryInfo.estimatedDeliveryTime && (
              <div>
                <p className="text-sm text-gray-600 font-sans">Estimated Delivery:</p>
                <p className="font-medium font-sans text-black">
                  {formatDate(order.deliveryInfo.estimatedDeliveryTime)}
                </p>
              </div>
            )}
            {order.deliveryInfo.deliveryInstructions && (
              <div>
                <p className="text-sm text-gray-600 font-sans">Delivery Instructions:</p>
                <p className="font-medium font-sans text-black">
                  {order.deliveryInfo.deliveryInstructions}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {order.orderType === "pickup" && order.pickupInfo && (
        <div className="border border-[#256C5C]/30 rounded-lg p-6 font-sans bg-[#CAE7E1]">
          <h4 className="font-medium mb-3 font-sans text-black">Pickup Information</h4>
          <div className="space-y-2 font-sans">
            {order.pickupInfo.estimatedPickupTime && (
              <div>
                <p className="text-sm text-gray-600 font-sans">Estimated Ready Time:</p>
                <p className="font-medium font-sans text-black">
                  {formatDate(order.pickupInfo.estimatedPickupTime)}
                </p>
              </div>
            )}
            {order.pickupInfo.pickupInstructions && (
              <div>
                <p className="text-sm text-gray-600 font-sans">Pickup Instructions:</p>
                <p className="font-medium font-sans text-black">
                  {order.pickupInfo.pickupInstructions}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-sans">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4 font-sans">
            <div className="p-6 border-b font-sans">
              <div className="flex items-center justify-between font-sans">
                <h3 className="text-lg font-semibold font-sans text-black">Order History</h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-sans"
                >
                  <XCircle className="w-6 h-6 font-sans" />
                </button>
              </div>
            </div>

            <div className="p-6 font-sans">
              <div className="space-y-4 font-sans">
                {orderHistory.map((item, index) => {
                  const itemStatusInfo = getStatusInfo(item.status);
                  const ItemIcon = itemStatusInfo.icon;

                  return (
                    <div key={index} className="flex items-start space-x-3 font-sans">
                      <div
                        className={`p-2 rounded-full ${itemStatusInfo.bgColor}`}
                      >
                        <ItemIcon
                          className={`w-4 h-4 ${itemStatusInfo.color}`}
                        />
                      </div>
                      <div className="flex-1 font-sans">
                        <div className="flex items-center justify-between font-sans">
                          <p className="font-medium font-sans text-black">{item.label}</p>
                          <span className="text-sm text-gray-500 font-sans">
                            {formatDate(item.timestamp)}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-1 font-sans">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Chat Modal */}
      {console.log(
        "PatientOrderTracking: OrderChatModal render check - showChatModal:",
        showChatModal,
        "order:",
        !!order,
        "currentUser:",
        !!currentUser
      )}
      {showChatModal && order && (
        <OrderChatModal
          isOpen={showChatModal}
          onClose={() => {
            console.log("PatientOrderTracking: OrderChatModal onClose called");
            setShowChatModal(false);
          }}
          order={order}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default PatientOrderTracking;