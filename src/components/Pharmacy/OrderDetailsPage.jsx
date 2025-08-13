import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Edit3,
  XCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle2,
  Heart,
  ArrowLeft,
  MessageCircle,
  Image,
  Menu,
  X,
  Mail,
  Home,
  CreditCard,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import OrderChatModal from "../Chat/OrderChatModal";
import ChatButtonWithNotification from "../Chat/ChatButtonWithNotification";
import { useAuth } from "../Login";
import { useUnreadMessages } from "../../hooks/useUnreadMessages";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { unreadCounts } = useUnreadMessages();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Health records state
  const [healthRecords, setHealthRecords] = useState(null);
  const [showHealthRecordsModal, setShowHealthRecordsModal] = useState(false);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Chat state
  const [showChatModal, setShowChatModal] = useState(false);

  // Order status options for pharmacy
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

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!newStatus || !order) return;

    try {
      const response = await axiosInstance.patch(
        `/orders/${order._id}/status`,
        {
          status: newStatus,
          notes: statusNotes,
        }
      );

      setOrder(response.data.data);
      setUpdateStatusModal(false);
      setNewStatus("");
      setStatusNotes("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.icon || Package;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const canUpdateStatus = (currentStatus) => {
    const nonUpdatableStatuses = ["delivered", "cancelled"];
    return !nonUpdatableStatuses.includes(currentStatus);
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      placed: ["confirmed", "cancelled", "on_hold"],
      confirmed: ["preparing", "cancelled", "on_hold"],
      preparing: ["ready", "cancelled", "on_hold"],
      ready: ["out_for_delivery", "delivered", "cancelled"],
      out_for_delivery: ["delivered", "cancelled"],
      on_hold: ["confirmed", "cancelled"],
    };
    return statusFlow[currentStatus] || [];
  };

  // Function to view patient health records
  const viewPatientHealthRecords = async (patientId) => {
    if (!patientId) {
      setError("Patient ID not found");
      return;
    }

    try {
      setLoadingHealthRecords(true);
      setSelectedPatientId(patientId);
      setShowHealthRecordsModal(true);

      const response = await axiosInstance.get(
        `/pharmacies/patients/${patientId}/shared-health-records`
      );

      setHealthRecords(response.data.data);
    } catch (err) {
      console.error("Failed to fetch health records:", err);
      setError(err.response?.data?.message || "Failed to load health records");
      setShowHealthRecordsModal(false);
    } finally {
      setLoadingHealthRecords(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A4B42] to-[#256C5C] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-white">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A4B42] to-[#256C5C] flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-gray-200 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A4B42] to-[#256C5C] flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-200 mb-4 text-sm sm:text-base">
            The requested order could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A4B42] to-[#256C5C]">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-6 gap-3">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-sm text-gray-200">Order Details</p>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden ml-auto p-2 text-white hover:bg-white/10 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <ChatButtonWithNotification
                orderId={order._id}
                unreadCount={unreadCounts[order._id] || 0}
                onClick={() => setShowChatModal(true)}
                className="px-4 py-2.5 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
              />
              <button
                onClick={() => viewPatientHealthRecords(order.patientId?._id)}
                className="px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>Health Records</span>
              </button>
              {canUpdateStatus(order.status) && (
                <button
                  onClick={() => setUpdateStatusModal(true)}
                  className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Status</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile Actions Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-4 space-y-2">
              <ChatButtonWithNotification
                orderId={order._id}
                unreadCount={unreadCounts[order._id] || 0}
                onClick={() => {
                  setShowChatModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-white/20 backdrop-blur text-white rounded-lg"
              />
              <button
                onClick={() => {
                  viewPatientHealthRecords(order.patientId?._id);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>View Health Records</span>
              </button>
              {canUpdateStatus(order.status) && (
                <button
                  onClick={() => {
                    setUpdateStatusModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Update Status</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column - Other Sections (Desktop - 70% width) */}
          <div className="lg:w-[70%] space-y-6">
            {/* Prescription Original Image */}
            {order.prescriptionId && order.prescriptionId.originalFile && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#CAE7E1] px-6 py-4">
                  <h3 className="text-lg font-semibold text-[#1A4B42] flex items-center">
                    <Image className="w-5 h-5 mr-2" />
                    Original Prescription Image
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">File:</span>
                      <span className="font-semibold text-gray-900">
                        {order.prescriptionId.originalFile.originalName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Uploaded:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(order.prescriptionId.uploadedAt || order.prescriptionId.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <div className="relative max-w-md w-full">
                        <img
                          src={order.prescriptionId.originalFile.secureUrl}
                          alt="Original Prescription"
                          className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                          onClick={() => window.open(order.prescriptionId.originalFile.secureUrl, "_blank")}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <button
                        onClick={() => window.open(order.prescriptionId.originalFile.secureUrl, "_blank")}
                        className="text-[#1A4B42] hover:text-[#256C5C] text-sm font-medium underline"
                      >
                        Click to view full size
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Details from OCR */}
            {order.prescriptionId?.ocrData && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#CAE7E1] px-6 py-4">
                  <button
                    onClick={() => toggleSection('ocr')}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-[#1A4B42] flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Prescription Details (OCR)
                    </h3>
                    <span className="sm:hidden text-[#1A4B42]">
                      {expandedSection === 'ocr' ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </span>
                  </button>
                </div>
                
                <div className={`${expandedSection === 'ocr' || window.innerWidth >= 640 ? 'block' : 'hidden sm:block'} p-6`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Processing Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.prescriptionId.ocrData.processingStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.prescriptionId.ocrData.processingStatus === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.prescriptionId.ocrData.processingStatus?.toUpperCase()}
                      </span>
                    </div>

                    {order.prescriptionId.ocrData.medications?.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center mb-4">
                          <Pill className="w-5 h-5 mr-2 text-[#1A4B42]" />
                          <span className="font-semibold text-gray-900">
                            Extracted Medications ({order.prescriptionId.ocrData.medications.length})
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.prescriptionId.ocrData.medications.map((medication, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-lg text-gray-900 mb-2">
                                    {medication.name}
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Dosage:</span>
                                      <span className="ml-2 font-medium text-gray-900">{medication.dosage}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Frequency:</span>
                                      <span className="ml-2 font-medium text-gray-900">{medication.frequency}</span>
                                    </div>
                                    {medication.duration && (
                                      <div>
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="ml-2 font-medium text-gray-900">{medication.duration}</span>
                                      </div>
                                    )}
                                    {medication.instructions && (
                                      <div className="col-span-2">
                                        <span className="text-gray-500">Instructions:</span>
                                        <span className="ml-2 font-medium text-gray-900">{medication.instructions}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {medication.confidence !== undefined && (
                                  <div className="ml-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      medication.confidence >= 0.8
                                        ? "bg-green-100 text-green-800"
                                        : medication.confidence >= 0.6
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {(medication.confidence * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#CAE7E1] px-6 py-4">
                <h3 className="text-lg font-semibold text-[#1A4B42]">Order Items</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-lg text-gray-900">{item.medicationName}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.dosage}</p>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-2">{item.notes}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm text-gray-500">Qty: <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                          <p className="text-lg font-bold text-[#1A4B42] mt-1">{formatCurrency(item.totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Amount */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-[#1A4B42]">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(order.patientNotes || order.pharmacyNotes || order.specialInstructions) && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#CAE7E1] px-6 py-4">
                  <h3 className="text-lg font-semibold text-[#1A4B42]">Notes & Instructions</h3>
                </div>
                <div className="p-6 space-y-4">
                  {order.patientNotes && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Patient Notes:</p>
                      <p className="text-sm text-gray-700">{order.patientNotes}</p>
                    </div>
                  )}
                  {order.pharmacyNotes && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-semibold text-green-900 mb-2">Pharmacy Notes:</p>
                      <p className="text-sm text-gray-700">{order.pharmacyNotes}</p>
                    </div>
                  )}
                  {order.specialInstructions && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm font-semibold text-yellow-900 mb-2">Special Instructions:</p>
                      <p className="text-sm text-gray-700">{order.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Patient Information and Order Summary (Desktop - 30% width) */}
          <div className="lg:w-[30%] space-y-6 lg:order-last">
            {/* Patient Information Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#CAE7E1] px-6 py-4">
                <h3 className="text-lg font-semibold text-[#1A4B42] flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Patient Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {order.patientId?.firstName} {order.patientId?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900 break-all">{order.patientId?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">{order.patientId?.phone}</p>
                    </div>
                  </div>
                  
                  {order.patientId?.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-semibold text-gray-900">
                          {order.patientId.address.street && <>{order.patientId.address.street}<br /></>}
                          {order.patientId.address.city}, {order.patientId.address.state} {order.patientId.address.zipCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-[#CAE7E1] px-6 py-4">
                <h3 className="text-lg font-semibold text-[#1A4B42]">Order Summary</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="font-semibold text-gray-900">
                        {order.patientId?.address?.street || "Not provided"}
                        {order.patientId?.address?.city && (
                          <>, {order.patientId.address.city}</>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Tracking ID</p>
                      <p className="font-semibold text-gray-900">{order._id.slice(-12)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Estimated Delivery Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Order Type</p>
                      <p className="font-semibold text-gray-900 capitalize">{order.orderType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-[#1A4B42]">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {updateStatusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1A4B42] to-[#256C5C] px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Update Order Status</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status: <span className="capitalize font-semibold">{order.status.replace("_", " ")}</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4B42] focus:border-[#1A4B42]"
                >
                  <option value="">Select new status</option>
                  {getNextStatuses(order.status).map((status) => {
                    const option = statusOptions.find((opt) => opt.value === status);
                    return (
                      <option key={status} value={status}>
                        {option?.label || status}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status update..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A4B42] focus:border-[#1A4B42]"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setUpdateStatusModal(false);
                  setNewStatus("");
                  setStatusNotes("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus}
                className="px-4 py-2 bg-[#1A4B42] text-white rounded-lg hover:bg-[#256C5C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Records Modal */}
      {showHealthRecordsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-[#1A4B42] to-[#256C5C] px-6 py-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  Patient Health Records
                  {healthRecords?.patientName && (
                    <span className="text-gray-200 font-normal ml-2">
                      - {healthRecords.patientName}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setShowHealthRecordsModal(false);
                    setHealthRecords(null);
                    setSelectedPatientId(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingHealthRecords ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A4B42]"></div>
                  <p className="ml-3 text-gray-600">Loading health records...</p>
                </div>
              ) : healthRecords ? (
                <div className="space-y-6">
                  {/* Record Counts Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    <div className="bg-teal-50 p-4 rounded-lg text-center border border-teal-200">
                      <div className="text-2xl font-bold text-teal-600">
                        {healthRecords.recordCounts?.medicalHistory || 0}
                      </div>
                      <div className="text-sm text-gray-700">Medical History</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                      <div className="text-2xl font-bold text-red-600">
                        {healthRecords.recordCounts?.allergies || 0}
                      </div>
                      <div className="text-sm text-gray-700">Allergies</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {healthRecords.recordCounts?.currentMedications || 0}
                      </div>
                      <div className="text-sm text-gray-700">Medications</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {healthRecords.recordCounts?.vitalSigns || 0}
                      </div>
                      <div className="text-sm text-gray-700">Vital Signs</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">
                        {healthRecords.recordCounts?.emergencyContacts || 0}
                      </div>
                      <div className="text-sm text-gray-700">Emergency</div>
                    </div>
                  </div>

                  {/* Medical History */}
                  {healthRecords.healthRecords?.medicalHistory?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-teal-600" />
                        Medical History
                      </h4>
                      <div className="space-y-3">
                        {healthRecords.healthRecords.medicalHistory.map((history, index) => (
                          <div key={history._id || index} className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{history.condition}</h5>
                              <span className="text-sm text-gray-500">
                                {new Date(history.diagnosedDate).toLocaleDateString()}
                              </span>
                            </div>
                            {history.notes && (
                              <p className="text-sm text-gray-600">{history.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {healthRecords.healthRecords?.allergies?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                        Allergies
                      </h4>
                      <div className="space-y-3">
                        {healthRecords.healthRecords.allergies.map((allergy, index) => (
                          <div key={allergy._id || index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{allergy.allergen}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                allergy.severity === 'severe' ? 'bg-red-200 text-red-800' :
                                allergy.severity === 'moderate' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                {allergy.severity}
                              </span>
                            </div>
                            {allergy.reaction && (
                              <p className="text-sm text-gray-600">Reaction: {allergy.reaction}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Medications */}
                  {healthRecords.healthRecords?.currentMedications?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Pill className="w-5 h-5 mr-2 text-green-600" />
                        Current Medications
                      </h4>
                      <div className="space-y-3">
                        {healthRecords.healthRecords.currentMedications.map((medication, index) => (
                          <div key={medication._id || index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{medication.medication}</h5>
                              <span className="text-sm text-gray-500">
                                Started: {new Date(medication.startDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Dosage:</p>
                                <p className="font-medium">{medication.dosage}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Frequency:</p>
                                <p className="font-medium">{medication.frequency}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vital Signs */}
                  {healthRecords.healthRecords?.vitalSigns?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-blue-600" />
                        Vital Signs
                      </h4>
                      <div className="space-y-3">
                        {healthRecords.healthRecords.vitalSigns.map((vital, index) => (
                          <div key={vital._id || index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-start mb-3">
                              <h5 className="font-medium text-gray-900">Vital Signs Record</h5>
                              <span className="text-sm text-gray-500">
                                {new Date(vital.recordedAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {vital.weight && (
                                <div>
                                  <p className="text-sm text-gray-500">Weight</p>
                                  <p className="font-medium">{vital.weight} kg</p>
                                </div>
                              )}
                              {vital.heartRate && (
                                <div>
                                  <p className="text-sm text-gray-500">Heart Rate</p>
                                  <p className="font-medium">{vital.heartRate} bpm</p>
                                </div>
                              )}
                              {vital.temperature && (
                                <div>
                                  <p className="text-sm text-gray-500">Temperature</p>
                                  <p className="font-medium">{vital.temperature}°F</p>
                                </div>
                              )}
                              {vital.bloodPressure && (
                                <div>
                                  <p className="text-sm text-gray-500">Blood Pressure</p>
                                  <p className="font-medium">
                                    {vital.bloodPressure.systolic || vital.bloodPressure}/{vital.bloodPressure.diastolic || ''} mmHg
                                  </p>
                                </div>
                              )}
                            </div>
                            {vital.notes && (
                              <p className="text-sm text-gray-600 mt-3">Notes: {vital.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency Contacts */}
                  {healthRecords.healthRecords?.emergencyContacts?.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-orange-600" />
                        Emergency Contacts
                      </h4>
                      <div className="space-y-3">
                        {healthRecords.healthRecords.emergencyContacts.map((contact, index) => (
                          <div key={contact._id || index} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-900">{contact.name}</h5>
                              <span className="text-sm text-gray-500">{contact.relationship}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-500">Phone:</p>
                                <p className="font-medium">{contact.phone}</p>
                              </div>
                              {contact.email && (
                                <div>
                                  <p className="text-gray-500">Email:</p>
                                  <p className="font-medium">{contact.email}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!healthRecords.healthRecords ||
                    Object.values(healthRecords.healthRecords).every(
                      (records) => !records || records.length === 0
                    )) && (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No health records shared yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Health records will appear here when the patient shares them with your pharmacy.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No health records found for this patient.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Chat Modal */}
      {showChatModal && (
        <OrderChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          order={order}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;