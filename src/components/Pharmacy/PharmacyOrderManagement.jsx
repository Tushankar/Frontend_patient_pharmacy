import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Eye,
  Edit3,
  XCircle,
  User,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Heart,
  MessageCircle,
  Bell,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Menu,
  X,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import OrderChatModal from "../Chat/OrderChatModal";
import ChatButtonWithNotification from "../Chat/ChatButtonWithNotification";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

const PharmacyOrderManagement = () => {
  const navigate = useNavigate();
  const { unreadCounts, getUnreadCount, markAsRead } = useUnreadMessages();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [healthRecords, setHealthRecords] = useState(null);
  const [showHealthRecordsModal, setShowHealthRecordsModal] = useState(false);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [refillRequests, setRefillRequests] = useState([]);
  const [refillRequestCount, setRefillRequestCount] = useState(0);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedRefillRequest, setSelectedRefillRequest] = useState(null);
  const [refillLoading, setRefillLoading] = useState({});
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const statusOptions = [
    {
      value: "placed",
      label: "New Orders",
      color: "bg-teal-100 text-teal-900",
      icon: Package,
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-green-100 text-green-900",
      icon: CheckCircle,
    },
    {
      value: "preparing",
      label: "Preparing",
      color: "bg-yellow-100 text-yellow-900",
      icon: Clock,
    },
    {
      value: "ready",
      label: "Ready",
      color: "bg-blue-100 text-blue-900",
      icon: Package,
    },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
      color: "bg-indigo-100 text-indigo-900",
      icon: Truck,
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-gray-100 text-gray-900",
      icon: CheckCircle,
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-200 text-green-900",
      icon: CheckCircle,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-900",
      icon: XCircle,
    },
    {
      value: "on_hold",
      label: "On Hold",
      color: "bg-orange-100 text-orange-900",
      icon: AlertCircle,
    },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const status = selectedStatus === "all" ? "" : selectedStatus;
      const response = await axiosInstance.get(
        `/orders?status=${status}&limit=100&page=1`
      );
      setOrders(response.data.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedStatus]);

  const handleStatusUpdate = async () => {
    try {
      await axiosInstance.patch(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        notes: statusNotes,
      });

      setUpdateStatusModal(false);
      setNewStatus("");
      setStatusNotes("");
      fetchOrders();

      if (selectedOrder) {
        const response = await axiosInstance.get(
          `/orders/${selectedOrder._id}`
        );
        setSelectedOrder(response.data.data);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-900";
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.icon : Package;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const canUpdateStatus = (currentStatus) => {
    return !["delivered", "completed", "cancelled"].includes(currentStatus);
  };

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      placed: ["confirmed", "cancelled", "on_hold"],
      confirmed: ["preparing", "cancelled", "on_hold"],
      preparing: ["ready", "cancelled", "on_hold"],
      ready: ["out_for_delivery", "delivered", "cancelled"],
      out_for_delivery: ["delivered", "cancelled"],
      delivered: ["completed"],
      on_hold: ["confirmed", "preparing", "cancelled"],
    };
    return transitions[currentStatus] || [];
  };

  const fetchRefillRequests = async () => {
    try {
      const response = await axiosInstance.get("/refills/pharmacy");
      if (response.data.success) {
        setRefillRequests(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch refill requests:", error);
    }
  };

  const fetchRefillRequestCount = async () => {
    try {
      const response = await axiosInstance.get("/refills/pharmacy/count");
      if (response.data.success) {
        setRefillRequestCount(response.data.data.count);
      }
    } catch (error) {
      console.error("Failed to fetch refill request count:", error);
    }
  };

  const handleRefillResponse = async (refillId, status, message = "") => {
    try {
      setRefillLoading((prev) => ({ ...prev, [refillId]: true }));

      const response = await axiosInstance.post(
        `/refills/${refillId}/respond`,
        {
          status,
          message,
        }
      );

      if (response.data.success) {
        fetchRefillRequests();
        fetchRefillRequestCount();
        setShowRefillModal(false);
        setSelectedRefillRequest(null);
        setSelectedOrder(null);
        alert(`Refill request ${status} successfully!`);
      }
    } catch (error) {
      console.error(`Failed to ${status} refill request:`, error);
      alert(`Failed to ${status} refill request. Please try again.`);
    } finally {
      setRefillLoading((prev) => ({ ...prev, [refillId]: false }));
    }
  };

  useEffect(() => {
    fetchRefillRequests();
    fetchRefillRequestCount();
    const interval = setInterval(() => {
      fetchRefillRequestCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getOrderRefillRequests = (orderId) => {
    return refillRequests.filter(
      (request) =>
        request.originalOrderId._id === orderId ||
        request.originalOrderId === orderId
    );
  };

  const hasUnreadRefillRequests = (orderId) => {
    const orderRefills = getOrderRefillRequests(orderId);
    return orderRefills.some((request) => request.status === "pending");
  };

  const handleViewOrderRefillRequests = (order) => {
    const orderRefills = getOrderRefillRequests(order._id);
    setRefillRequests(orderRefills);
    setSelectedOrder(order);
    setShowRefillModal(true);
    setSelectedOrderForChat(null);
    setShowChatModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#256C5C]"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#256C5C] border border-[#256C5C]/50 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          Order Management
        </h2>
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden absolute right-3 top-3 p-2 text-white hover:bg-white/10 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => {
              setShowRefillModal(true);
              fetchRefillRequests();
            }}
            className="relative px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-200 flex items-center gap-2 border border-orange-300/50 text-sm md:text-base"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">Refill Requests</span>
            {refillRequestCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
                {refillRequestCount}
              </span>
            )}
          </button>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-[#1A4B42] to-[#12362F] text-white rounded-lg hover:from-[#1A4B42] hover:to-[#12362F] transition-all duration-200 disabled:opacity-50 flex items-center gap-2 border border-[#256C5C]/50 text-sm md:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 md:px-4 py-2 border border-[#256C5C]/50 bg-white rounded-lg text-[#256C5C] focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-sm md:text-base"
          >
            <option value="all">All Orders</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Controls */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white/10 rounded-lg p-3 mb-4 space-y-3">
          <button
            onClick={() => {
              setShowRefillModal(true);
              fetchRefillRequests();
              setMobileMenuOpen(false);
            }}
            className="relative w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
          >
            <Bell className="w-4 h-4" />
            <span>Refill Requests</span>
            {refillRequestCount > 0 && (
              <span className="bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[20px]">
                {refillRequestCount}
              </span>
            )}
          </button>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="w-full px-3 py-2 bg-gradient-to-r from-[#1A4B42] to-[#12362F] text-white rounded-lg flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Orders</span>
          </button>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setMobileMenuOpen(false);
            }}
            className="w-full px-3 py-2 border border-[#256C5C]/50 bg-white rounded-lg text-[#256C5C] text-sm"
          >
            <option value="all">All Orders</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-300/50 rounded-lg text-red-800 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2 text-sm text-white">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-4" />
            <p className="text-white text-sm sm:text-base">No orders found</p>
            <p className="text-xs sm:text-sm text-gray-200 mt-2 px-4">
              {selectedStatus === "all"
                ? "Orders will appear here when patients approve prescriptions and place orders"
                : `No orders with status "${selectedStatus}" found`}
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const isExpanded = expandedOrderId === order._id;
            
            return (
              <div
                key={order._id}
                className="border border-[#CAE7E1] bg-[#CAE7E1] rounded-lg p-3 sm:p-4 md:p-6 hover:bg-[#B0D9D4] transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#256C5C]" />
                      <h3 className="font-semibold text-base sm:text-lg text-[#256C5C]">
                        Order #{order.orderNumber}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                        <span className="text-xs sm:text-sm text-gray-700 truncate">
                          {order.patientId?.firstName} {order.patientId?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                        <span className="text-xs sm:text-sm text-gray-700">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                        <span className="text-xs sm:text-sm text-gray-700">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                        <span className="text-xs sm:text-sm text-gray-700">
                          {order.items?.length || 0} medication(s)
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-[#256C5C]">•</span>
                      <span className="text-xs sm:text-sm text-gray-700 capitalize">
                        {order.orderType}
                      </span>
                      {order.prescriptionId?.ocrData?.medications?.length > 0 && (
                        <span className="text-xs bg-teal-100 text-[#256C5C] px-2 py-1 rounded-full flex items-center border border-[#256C5C]/50">
                          <FileText className="w-3 h-3 mr-1" />
                          OCR Data
                        </span>
                      )}
                      {order.isUrgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full border border-red-300/50">
                          URGENT
                        </span>
                      )}
                    </div>

                    {/* Prescribed Medications - Mobile Toggle */}
                    {order.prescriptionId?.ocrData?.medications?.length > 0 && (
                      <>
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                          className="sm:hidden text-xs text-[#256C5C] underline mb-2"
                        >
                          {isExpanded ? "Hide" : "Show"} Medications
                        </button>
                        
                        <div className={`${isExpanded ? "block" : "hidden"} sm:block bg-teal-50/50 border border-[#CAE7E1] rounded-lg p-2 sm:p-3 mb-3`}>
                          <div className="flex items-center mb-2">
                            <Pill className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C] mr-2" />
                            <span className="text-xs sm:text-sm font-medium text-[#256C5C]">
                              Prescribed Medications:
                            </span>
                          </div>
                          <div className="space-y-1">
                            {order.prescriptionId.ocrData.medications
                              .slice(0, 2)
                              .map((med, index) => (
                                <div key={index} className="text-xs text-gray-700">
                                  <span className="font-medium text-[#256C5C]">
                                    {med.name}
                                  </span>{" "}
                                  - {med.dosage} ({med.frequency})
                                </div>
                              ))}
                            {order.prescriptionId.ocrData.medications.length > 2 && (
                              <div className="text-xs text-[#256C5C] italic">
                                +{order.prescriptionId.ocrData.medications.length - 2}{" "}
                                more medication(s)
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
                    <button
                      onClick={() => navigate(`/pharmacy/orders/${order._id}`)}
                      className="flex-1 lg:flex-none px-3 py-1.5 sm:py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1 border border-blue-200/50 text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View</span>
                    </button>

                    <ChatButtonWithNotification
                      onClick={() => {
                        const unreadCount = getUnreadCount(order._id);
                        if (unreadCount > 0) {
                          const unreadData = unreadCounts[order._id];
                          if (unreadData && unreadData.threadId) {
                            markAsRead(unreadData.threadId, order._id);
                          }
                        }
                        setSelectedOrderForChat(order);
                        setShowChatModal(true);
                      }}
                      unreadCount={getUnreadCount(order._id)}
                      className="flex-1 lg:flex-none px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                    />

                    <button
                      onClick={() => handleViewOrderRefillRequests(order)}
                      className="relative flex-1 lg:flex-none px-3 py-1.5 sm:py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1 border border-blue-200/50 text-xs sm:text-sm"
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Refills</span>
                      {hasUnreadRefillRequests(order._id) && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse"></div>
                        </div>
                      )}
                      {getOrderRefillRequests(order._id).length > 0 && (
                        <span className="ml-1 px-1 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">
                          {getOrderRefillRequests(order._id).length}
                        </span>
                      )}
                    </button>

                    {canUpdateStatus(order.status) && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setUpdateStatusModal(true);
                        }}
                        className="flex-1 lg:flex-none px-3 py-1.5 sm:py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center space-x-1 border border-green-200/50 text-xs sm:text-sm"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Update</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Update Status Modal */}
      {updateStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-[#256C5C]/50 shadow-lg">
            <div className="p-4 sm:p-6 border-b border-[#256C5C]/50 bg-[#256C5C]">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Update Order Status
              </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#256C5C] mb-2">
                  Current Status:{" "}
                  <span className="capitalize text-[#256C5C]">
                    {selectedOrder.status.replace("_", " ")}
                  </span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#256C5C]/50 bg-white rounded-lg text-[#256C5C] focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-sm sm:text-base"
                >
                  <option value="">Select new status</option>
                  {getNextStatuses(selectedOrder.status).map((status) => {
                    const option = statusOptions.find(
                      (opt) => opt.value === status
                    );
                    return (
                      <option key={status} value={status}>
                        {option?.label || status}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#256C5C] mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status update..."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#256C5C]/50 bg-white rounded-lg text-[#256C5C] placeholder-gray-400 focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-[#256C5C]/50 bg-teal-50/50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setUpdateStatusModal(false);
                  setNewStatus("");
                  setStatusNotes("");
                }}
                className="px-3 sm:px-4 py-2 text-[#256C5C] border border-[#256C5C]/50 rounded-lg hover:bg-teal-100 transition-all duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#256C5C] to-[#1A4B42] text-white rounded-lg hover:from-[#1A4B42] hover:to-[#12362F] disabled:opacity-50 disabled:cursor-not-allowed border border-[#256C5C]/50 transition-all duration-200 text-sm sm:text-base"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refill Requests Modal */}
      {showRefillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[#256C5C]/50 shadow-lg">
            <div className="p-4 sm:p-6 border-b border-[#256C5C]/50 bg-[#256C5C]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <h3 className="text-base sm:text-xl font-semibold text-white">
                    {selectedOrder ? (
                      <span className="break-words">
                        Refill Requests for Order #{selectedOrder.orderNumber} (
                        {refillRequests.length})
                      </span>
                    ) : (
                      <>All Refill Requests ({refillRequests.length})</>
                    )}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowRefillModal(false);
                    setSelectedOrder(null);
                    fetchRefillRequests();
                    setSelectedOrderForChat(null);
                    setShowChatModal(false);
                  }}
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
              {refillRequests.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 text-[#256C5C] mx-auto mb-4" />
                  <p className="text-[#256C5C] text-sm sm:text-base">
                    {selectedOrder
                      ? `No refill requests for Order #${selectedOrder.orderNumber}`
                      : "No pending refill requests"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    {selectedOrder
                      ? "Refill requests for this specific order will appear here"
                      : "Refill requests from patients will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {refillRequests.map((request) => (
                    <div
                      key={request._id}
                      className="border border-[#256C5C]/50 bg-white rounded-lg p-3 sm:p-4 md:p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#256C5C]" />
                            <h4 className="text-base sm:text-lg font-semibold text-[#256C5C]">
                              {request.patientId?.firstName}{" "}
                              {request.patientId?.lastName}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm text-gray-700 mb-3 space-y-1">
                            <p className="break-all">
                              <strong>Original Order:</strong> #
                              {request.originalOrderId?._id}
                            </p>
                            <p>
                              <strong>Requested:</strong>{" "}
                              {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                            <p className="break-all">
                              <strong>Email:</strong> {request.patientId?.email}
                            </p>
                          </div>

                          {request.medications && request.medications.length > 0 && (
                            <div className="mb-4">
                              <h5 className="text-xs sm:text-sm font-semibold text-[#256C5C] mb-2">
                                Medications:
                              </h5>
                              <div className="space-y-2">
                                {request.medications.map((med, index) => (
                                  <div
                                    key={index}
                                    className="bg-teal-50 p-2 sm:p-3 rounded-lg border border-[#256C5C]/50"
                                  >
                                    <p className="text-[#256C5C] font-medium text-sm">
                                      {med.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-700">
                                      {med.dosage} - {med.frequency}
                                    </p>
                                    {med.instructions && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {med.instructions}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {request.notes && (
                            <div className="mb-4">
                              <h5 className="text-xs sm:text-sm font-semibold text-[#256C5C] mb-1">
                                Notes:
                              </h5>
                              <p className="text-xs sm:text-sm text-gray-700 bg-teal-50 p-2 rounded border border-[#256C5C]/50">
                                {request.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[#256C5C]/50">
                          <button
                            onClick={() => {
                              const message = prompt("Optional message for approval:");
                              if (message !== null) {
                                handleRefillResponse(request._id, "approved", message);
                              }
                            }}
                            disabled={refillLoading[request._id]}
                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                          >
                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            {refillLoading[request._id] ? "Processing..." : "Approve"}
                          </button>

                          <button
                            onClick={() => {
                              const message = prompt("Reason for rejection (required):");
                              if (message && message.trim()) {
                                handleRefillResponse(request._id, "rejected", message);
                              } else if (message !== null) {
                                alert("Please provide a reason for rejection.");
                              }
                            }}
                            disabled={refillLoading[request._id]}
                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                          >
                            <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            {refillLoading[request._id] ? "Processing..." : "Reject"}
                          </button>
                        </div>
                      )}

                      {request.pharmacyResponse && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#256C5C]/50">
                          <h5 className="text-xs sm:text-sm font-semibold text-[#256C5C] mb-2">
                            Pharmacy Response:
                          </h5>
                          <p className="text-xs sm:text-sm text-gray-700 bg-teal-50 p-2 rounded border border-[#256C5C]/50">
                            {request.pharmacyResponse.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Responded on:{" "}
                            {new Date(request.pharmacyResponse.respondedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showChatModal && selectedOrderForChat && currentUser && (
        <OrderChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedOrderForChat(null);
          }}
          order={selectedOrderForChat}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default PharmacyOrderManagement;