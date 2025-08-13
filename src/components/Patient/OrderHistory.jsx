import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Eye,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Search,
  Filter,
  ChevronDown,
  Star,
  MessageCircle,
  ShoppingCart,
  Heart,
  User,
  Share,
  X,
  AlertTriangle,
  Pill,
  Activity,
  RefreshCw,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PatientOrderTracking from "./PatientOrderTracking";
import OrderChatModal from "../Chat/OrderChatModal";
import ChatButtonWithNotification from "../Chat/ChatButtonWithNotification";
import { useAuth } from "../Login";
import { useNotifications } from "../../hooks/useNotifications";

const OrderHistory = () => {
  const { user: currentUser } = useAuth(); // Get current user from auth context
  const { chatUnreadCounts, getChatUnreadCount, markChatAsRead } =
    useNotifications(); // Use chat notifications
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showTracking, setShowTracking] = useState({});
  const [showHealthRecords, setShowHealthRecords] = useState({});
  const [healthRecords, setHealthRecords] = useState({});
  const [sharedHealthRecords, setSharedHealthRecords] = useState({});

  // Refill state
  const [refillRequests, setRefillRequests] = useState({});
  const [refillLoading, setRefillLoading] = useState({});

  // Chat state
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderIdMapping, setOrderIdMapping] = useState({}); // Map prescription orders to actual orders

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/patients/prescriptions/history"
      );
      console.log("Filtered placed orders:", response);

      console.log("Order history API response:", response.data.data);

      const placedOrders = response.data.data.filter(
        (prescription) =>
          prescription.status === "accepted" ||
          prescription.status === "preparing" ||
          prescription.status === "ready" ||
          prescription.status === "delivered" ||
          prescription.status === "completed"
      );

      setOrders(placedOrders);

      // Fetch actual order IDs for each prescription
      const mappings = {};
      for (const order of placedOrders) {
        if (order.prescriptionId?._id) {
          try {
            const orderResponse = await axiosInstance.get(
              `/orders/by-prescription/${order.prescriptionId._id}`
            );
            const actualOrder = orderResponse.data.data;
            mappings[order._id] = actualOrder._id;
          } catch (error) {
            console.error(
              `Failed to fetch order for prescription ${order.prescriptionId._id}:`,
              error
            );
          }
        }
      }
      setOrderIdMapping(mappings);
    } catch (err) {
      console.error("Failed to fetch order history:", err);
      setError("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPharmacyDetails = (pharmacyId, prescriptionId) => {
    if (!pharmacyId) {
      console.error("Pharmacy ID is missing for order:", prescriptionId);
      alert("Pharmacy details are not available for this order.");
      return;
    }

    navigate(`/patient/pharmacy/${pharmacyId}`, {
      state: {
        prescriptionInfo: { prescriptionId },
        fromOrderHistory: true,
      },
    });
  };

  const handleToggleTracking = (orderId) => {
    setShowTracking((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleToggleHealthRecords = async (orderId, pharmacyId) => {
    setShowHealthRecords((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));

    // Fetch health records if not already loaded and showing
    if (!showHealthRecords[orderId] && pharmacyId && !healthRecords[orderId]) {
      try {
        const response = await axiosInstance.get(
          `/patients/health-records/shared/${pharmacyId}`
        );
        const sharedRecords = response.data.data;

        setHealthRecords((prev) => ({
          ...prev,
          [orderId]: sharedRecords,
        }));
      } catch (error) {
        console.error("Error fetching shared health records:", error);
        // Set empty records on error to show appropriate message
        setHealthRecords((prev) => ({
          ...prev,
          [orderId]: {
            medicalHistory: [],
            allergies: [],
            currentMedications: [],
            vitalSigns: [],
          },
        }));
      }
    }
  };

  const handleOpenChat = async (order) => {
    console.log("=== ORDER HISTORY CHAT INIT ===");
    console.log("OrderHistory: Opening chat for order:", order);
    console.log("OrderHistory: Raw order structure:", {
      _id: order._id,
      prescriptionId: order.prescriptionId,
      fulfilledBy: order.fulfilledBy,
      status: order.status,
      patientId: order.patientId,
    });

    try {
      // First, get the actual order by prescription ID
      console.log(
        "OrderHistory: Fetching actual order for prescription ID:",
        order.prescriptionId?._id
      );
      const orderResponse = await axiosInstance.get(
        `/orders/by-prescription/${order.prescriptionId?._id}`
      );
      const actualOrder = orderResponse.data.data;

      console.log("OrderHistory: Actual order fetched:", actualOrder);

      // Transform the order object to match what OrderChatModal expects
      const transformedOrder = {
        _id: actualOrder._id, // Use actual order ID
        orderNumber: actualOrder.orderNumber,
        status: actualOrder.status,
        pharmacyId: {
          _id: actualOrder.pharmacyId._id,
          profile: {
            name:
              actualOrder.pharmacyId?.profile?.name ||
              order.fulfilledBy?.pharmacyName ||
              "Pharmacy",
          },
        },
        patientId: {
          _id: actualOrder.patientId._id,
          firstName:
            actualOrder.patientId?.firstName ||
            currentUser?.firstName ||
            "Patient",
          lastName:
            actualOrder.patientId?.lastName || currentUser?.lastName || "",
        },
      };

      console.log(
        "OrderHistory: Transformed order for chat:",
        transformedOrder
      );
      console.log("OrderHistory: Current user details:", {
        _id: currentUser?._id,
        role: currentUser?.role,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
      });

      // Check if there are unread messages and get thread ID
      const orderId = actualOrder._id;
      const unreadCount = getChatUnreadCount(orderId);

      if (unreadCount > 0) {
        const unreadData = chatUnreadCounts[orderId];
        if (unreadData && unreadData.threadId) {
          // Mark messages as read when opening chat
          await markChatAsRead(orderId);
        }
      }

      setSelectedOrder(transformedOrder);
      setShowChatModal(true);
    } catch (error) {
      console.error("OrderHistory: Failed to fetch actual order:", error);
      alert("Failed to open chat. Please try again.");
    }
  };

  const handleCloseChat = () => {
    console.log("OrderHistory: Closing chat modal");
    setShowChatModal(false);
    setSelectedOrder(null);
  };

  // Handle refill request
  const handleRefillRequest = async (order) => {
    try {
      setRefillLoading((prev) => ({ ...prev, [order._id]: true }));

      console.log("Order for refill:", order);
      console.log("Order ID mapping:", orderIdMapping);
      console.log(
        "Original order ID will be:",
        orderIdMapping[order._id] || order._id
      );

      const originalOrderId = orderIdMapping[order._id] || order._id;

      // First, check if there's already a pending refill request for this order
      try {
        const existingRefillsResponse = await axiosInstance.get(
          "/refills/patient"
        );
        if (existingRefillsResponse.data.success) {
          const existingPendingRefill = existingRefillsResponse.data.data.find(
            (refill) =>
              refill.originalOrderId._id === originalOrderId &&
              refill.status === "pending"
          );

          if (existingPendingRefill) {
            alert(
              "A refill request for this order is already pending. Please wait for the pharmacy's response."
            );
            return;
          }
        }
      } catch (checkError) {
        console.warn("Could not check existing refill requests:", checkError);
        // Continue with the request anyway
      }

      const refillData = {
        originalOrderId,
        prescriptionId: order.prescriptionId?._id,
        pharmacyId: order.fulfilledBy?._id,
        medications: order.prescriptionId?.ocrResult?.medications || [],
        notes: `Refill request for order ${order._id}`,
      };

      console.log("Refill request data:", refillData);

      const response = await axiosInstance.post("/refills/request", refillData);

      if (response.data.success) {
        // Update refill request state
        setRefillRequests((prev) => ({
          ...prev,
          [order._id]: {
            status: "pending",
            requestId: response.data.data._id,
            requestedAt: new Date(),
          },
        }));

        alert(
          "Refill request sent successfully! The pharmacy will review your request."
        );
      }
    } catch (error) {
      console.error("Failed to send refill request:", error);
      alert("Failed to send refill request. Please try again.");
    } finally {
      setRefillLoading((prev) => ({ ...prev, [order._id]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <Clock className="w-5 h-5 font-sans" />;
      case "preparing":
        return <Package className="w-5 h-5 font-sans" />;
      case "ready":
        return <CheckCircle className="w-5 h-5 font-sans" />;
      case "delivered":
      case "completed":
        return <Truck className="w-5 h-5 font-sans" />;
      default:
        return <Clock className="w-5 h-5 font-sans" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "preparing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "ready":
        return "bg-green-50 text-green-700 border-green-200";
      case "delivered":
      case "completed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "accepted":
        return "Order Confirmed";
      case "preparing":
        return "Being Prepared";
      case "ready":
        return "Ready for Pickup";
      case "delivered":
        return "Delivered";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };
  console.log(orders, "orders in OrderHistory");

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.fulfilledBy?.pharmacyName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.prescriptionId?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.fulfilledAt || b.createdAt) -
            new Date(a.fulfilledAt || a.createdAt)
          );
        case "oldest":
          return (
            new Date(a.fulfilledAt || a.createdAt) -
            new Date(b.fulfilledAt || b.createdAt)
          );
        case "pharmacy":
          return (a.fulfilledBy?.pharmacyName || "").localeCompare(
            b.fulfilledBy?.pharmacyName || ""
          );
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="space-y-6 font-sans">
        <div
          className="rounded-2xl shadow-lg p-8 border font-sans"
          style={{
            backgroundColor: "#256C5C",
            borderColor: "rgba(202, 231, 225, 0.2)",
            backdropFilter: "blur(10px)"
          }}
        >
          <div className="animate-pulse font-sans">
            <div className="flex items-center gap-3 mb-6 font-sans">
              <div
                className="w-12 h-12 rounded-xl font-sans"
                style={{ backgroundColor: "rgba(202, 231, 225, 0.2)" }}
              ></div>
              <div className="space-y-2 font-sans">
                <div
                  className="h-6 rounded w-40 font-sans"
                  style={{ backgroundColor: "rgba(202, 231, 225, 0.2)" }}
                ></div>
                <div
                  className="h-4 rounded w-32 font-sans"
                  style={{ backgroundColor: "rgba(202, 231, 225, 0.2)" }}
                ></div>
              </div>
            </div>
            <div className="space-y-4 font-sans">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl font-sans"
                  style={{ backgroundColor: "rgba(202, 231, 225, 0.2)" }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl shadow-lg p-8 border font-sans"
        style={{
          backgroundColor: "#256C5C",
          borderColor: "rgba(202, 231, 225, 0.2)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="text-center font-sans">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center font-sans">
            <Package className="w-8 h-8 text-red-500 font-sans" />
          </div>
          <h3 className="text-lg font-medium mb-2 font-sans" style={{ color: "#CAE7E1" }}>
            Error Loading Orders
          </h3>
          <p className="text-red-300 font-sans">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 font-sans px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3 sm:gap-4 font-sans">
          <div
            className="p-2 sm:p-3 rounded-xl font-sans flex-shrink-0"
            style={{
              backgroundColor: "#CAE7E1"
            }}
          >
            <Package
              className="w-5 h-5 sm:w-6 sm:h-6 font-sans"
              style={{ color: "#256C5C" }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              className="text-2xl sm:text-3xl font-bold font-sans truncate"
              style={{
                color: "#CAE7E1"
              }}
            >
              Order History
            </h2>
            <p
              className="mt-1 text-sm sm:text-base font-sans"
              style={{
                color: "rgba(202, 231, 225, 0.7)"
              }}
            >
              Track your prescription orders from pharmacies
            </p>
          </div>
        </div>
        <div
          className="text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium font-sans flex-shrink-0 text-center"
          style={{
            color: "#256C5C",
            backgroundColor: "rgba(202, 231, 225, 0.8)"
          }}
        >
          {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border font-sans"
        style={{
          backgroundColor: "#256C5C",
          borderColor: "rgba(202, 231, 225, 0.2)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 font-sans">
          <div className="relative font-sans sm:col-span-2 lg:col-span-1">
            <Search
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 font-sans"
              style={{ color: "#256C5C" }}
            />
            <input
              type="text"
              placeholder="Search by pharmacy or prescription..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl transition-all duration-200 font-sans text-sm sm:text-base"
              style={{
                borderColor: "rgba(202, 231, 225, 0.3)",
                backgroundColor: "#CAE7E1",
                color: "#256C5C"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#CAE7E1";
                e.target.style.boxShadow = "0 0 0 2px rgba(202, 231, 225, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(202, 231, 225, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="relative font-sans">
            <Filter
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 font-sans"
              style={{ color: "#256C5C" }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl appearance-none transition-all duration-200 font-sans text-sm sm:text-base"
              style={{
                borderColor: "rgba(202, 231, 225, 0.3)",
                backgroundColor: "#CAE7E1",
                color: "#256C5C"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#CAE7E1";
                e.target.style.boxShadow = "0 0 0 2px rgba(202, 231, 225, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(202, 231, 225, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">All Statuses</option>
              <option value="accepted">Order Confirmed</option>
              <option value="preparing">Being Prepared</option>
              <option value="ready">Ready for Pickup</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none font-sans"
              style={{ color: "#256C5C" }}
            />
          </div>

          <div className="relative font-sans">
            <Calendar
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 font-sans"
              style={{ color: "#256C5C" }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl appearance-none transition-all duration-200 font-sans text-sm sm:text-base"
              style={{
                borderColor: "rgba(202, 231, 225, 0.3)",
                backgroundColor: "#CAE7E1",
                color: "#256C5C"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#CAE7E1";
                e.target.style.boxShadow = "0 0 0 2px rgba(202, 231, 225, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(202, 231, 225, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="pharmacy">By Pharmacy Name</option>
            </select>
            <ChevronDown
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none font-sans"
              style={{ color: "#256C5C" }}
            />
          </div>
        </div>
      </div>

      {/* Order Statistics - MOVED HERE */}
      {orders.length > 0 && (
        <div
          className="rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border font-sans"
          style={{
            backgroundColor: "#CAE7E1",
            borderColor: "rgba(202, 231, 225, 0.2)",
            backdropFilter: "blur(10px)"
          }}
        >
          <h3
            className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2 sm:gap-3 font-sans"
            style={{
              color: "#256C5C"
            }}
          >
            <div
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl font-sans"
              style={{
                backgroundColor: "#256C5C"
              }}
            >
              <Package
                className="w-4 h-4 sm:w-5 sm:h-5 font-sans"
                style={{ color: "#CAE7E1" }}
              />
            </div>
            Order Statistics
          </h3>
          <p
            className="text-sm sm:text-base mb-4 sm:mb-6 font-sans ml-12 sm:ml-14"
            style={{
              color: "rgba(202, 231, 225, 0.8)"
            }}
          >
            Overview of your prescription order activity and fulfillment status
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 font-sans">
            <div
              className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl font-sans"
              style={{ backgroundColor: "#256C5C", borderColor: "rgba(202, 231, 225, 0.3)" }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-sans"
                style={{ color: "#CAE7E1" }}
              >
                {orders.length}
              </div>
              <div
                className="text-xs sm:text-sm font-medium font-sans"
                style={{ color: "rgba(202, 231, 225, 0.8)" }}
              >
                Total Orders
              </div>
            </div>
            <div
              className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl font-sans"
              style={{ backgroundColor: "#256C5C", borderColor: "rgba(202, 231, 225, 0.3)" }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-sans"
                style={{ color: "#CAE7E1" }}
              >
                {
                  orders.filter(
                    (o) => o.status === "completed" || o.status === "delivered"
                  ).length
                }
              </div>
              <div
                className="text-xs sm:text-sm font-medium font-sans"
                style={{ color: "rgba(202, 231, 225, 0.8)" }}
              >
                Completed
              </div>
            </div>
            <div
              className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl font-sans"
              style={{ backgroundColor: "#256C5C", borderColor: "rgba(202, 231, 225, 0.3)" }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-sans"
                style={{ color: "#CAE7E1" }}
              >
                {
                  orders.filter(
                    (o) => o.status === "preparing" || o.status === "ready"
                  ).length
                }
              </div>
              <div
                className="text-xs sm:text-sm font-medium font-sans"
                style={{ color: "rgba(202, 231, 225, 0.8)" }}
              >
                In Progress
              </div>
            </div>
            <div
              className="text-center p-3 sm:p-4 rounded-lg sm:rounded-xl font-sans"
              style={{ backgroundColor: "#256C5C", borderColor: "rgba(202, 231, 225, 0.3)" }}
            >
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 font-sans"
                style={{ color: "#CAE7E1" }}
              >
                {
                  new Set(orders.map((o) => o.fulfilledBy?._id).filter(Boolean))
                    .size
                }
              </div>
              <div
                className="text-xs sm:text-sm font-medium font-sans"
                style={{ color: "rgba(202, 231, 225, 0.8)" }}
              >
                Unique Pharmacies
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3 sm:space-y-4 font-sans">
        {filteredOrders.length === 0 ? (
          <div
            className="rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-12 border text-center font-sans"
            style={{
              backgroundColor: "#256C5C",
              borderColor: "rgba(202, 231, 225, 0.2)",
              backdropFilter: "blur(10px)"
            }}
          >
            <div className="p-3 sm:p-4 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center font-sans" style={{ backgroundColor: "rgba(202, 231, 225, 0.2)" }}>
              <Package className="w-8 h-8 sm:w-10 sm:h-10 font-sans" style={{ color: "#CAE7E1" }} />
            </div>
            <h3
              className="text-lg sm:text-xl font-bold mb-2 font-sans"
              style={{
                color: "#CAE7E1"
              }}
            >
              No orders found
            </h3>
            <p
              className="mb-4 sm:mb-6 text-sm sm:text-base font-sans"
              style={{
                color: "rgba(202, 231, 225, 0.7)"
              }}
            >
              {orders.length === 0
                ? "You haven't placed any orders yet. Upload a prescription to get started!"
                : "No orders match your current filters. Try adjusting your search criteria."}
            </p>
            {orders.length === 0 && (
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium font-sans text-sm sm:text-base"
                style={{
                  backgroundColor: "#CAE7E1",
                  color: "#256C5C"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(202, 231, 225, 0.8)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#CAE7E1";
                }}
              >
                Upload Prescription
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl sm:rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 group font-sans"
              style={{
                backgroundColor: "#256C5C",
                borderColor: "rgba(202, 231, 225, 0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <div className="p-4 sm:p-6 font-sans" style={{ backgroundColor: "#CAE7E1" }}>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4 sm:mb-6 gap-4 font-sans">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 font-sans">
                    <div
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl text-white font-sans flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #256C5C 0%, #1a4f48 100%)"
                      }}
                    >
                      {getStatusIcon(order.status)}
                    </div>

                    <div className="flex-1 min-w-0 font-sans">
                      <h3
                        className="text-lg sm:text-xl font-bold group-hover:text-blue-600 transition-colors font-sans truncate"
                        style={{
                          color: "#256C5C"
                        }}
                      >
                        {order.fulfilledBy?.pharmacyName ||
                          "Pharmacy Name Not Available"}
                      </h3>

                      {!order.fulfilledBy && (
                        <div className="flex items-center gap-2 mt-1 p-2 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm font-sans">
                          <span className="w-2 h-2 bg-red-500 rounded-full font-sans flex-shrink-0"></span>
                          <span className="truncate">Pharmacy information missing - please contact support</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 font-sans">
                        <span
                          className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(
                            order.status
                          )} flex-shrink-0 max-w-full`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-2 font-sans flex-shrink-0"></div>
                          <span className="truncate">{getStatusLabel(order.status)}</span>
                        </span>
                        <div className="flex items-center space-x-1 text-xs sm:text-sm font-sans" style={{ color: "rgba(37, 108, 92, 0.7)" }}>
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 font-sans flex-shrink-0" />
                          <span className="truncate">
                            {order.fulfilledAt
                              ? new Date(order.fulfilledAt).toLocaleDateString()
                              : new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div
                        className="rounded-lg p-3 sm:p-4 mt-3 sm:mt-4 border font-sans"
                        style={{
                          borderColor: "rgba(37, 108, 92, 0.3)",
                          backgroundColor: "rgba(255, 255, 255, 0.5)"
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2 font-sans">
                          <FileText
                            className="w-3 h-3 sm:w-4 sm:h-4 font-sans flex-shrink-0"
                            style={{ color: "#256C5C" }}
                          />
                          <span
                            className="font-medium font-sans text-sm sm:text-base"
                            style={{
                              color: "#256C5C"
                            }}
                          >
                            Prescription Details
                          </span>
                        </div>
                        <div
                          className="text-xs sm:text-sm font-sans break-words"
                          style={{
                            color: "rgba(37, 108, 92, 0.8)"
                          }}
                        >
                          {order.prescriptionId?.description ||
                            "Prescription description not available"}
                        </div>
                      </div>

                      {order.fulfilledBy && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm font-sans">
                          {order.fulfilledBy.phone && (
                            <div className="flex items-center space-x-2 font-sans min-w-0">
                              <Phone
                                className="w-3 h-3 sm:w-4 sm:h-4 font-sans flex-shrink-0"
                                style={{ color: "#256C5C" }}
                              />
                              <span
                                className="truncate"
                                style={{
                                  color: "rgba(37, 108, 92, 0.8)"
                                }}
                              >
                                {order.fulfilledBy.phone}
                              </span>
                            </div>
                          )}
                          {order.fulfilledBy.address && (
                            <div className="flex items-center space-x-2 font-sans min-w-0">
                              <MapPin
                                className="w-3 h-3 sm:w-4 sm:h-4 font-sans flex-shrink-0"
                                style={{ color: "#256C5C" }}
                              />
                              <span
                                className="truncate"
                                style={{
                                  color: "rgba(37, 108, 92, 0.8)"
                                }}
                              >
                                {order.fulfilledBy.address.city},{" "}
                                {order.fulfilledBy.address.state}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 lg:ml-4 font-sans">
                    {order.fulfilledBy?._id && (
                      <>
                        <button
                          onClick={() =>
                            handleViewPharmacyDetails(
                              order.fulfilledBy._id,
                              order.prescriptionId?._id
                            )
                          }
                          className="flex-1 lg:flex-none px-3 sm:px-4 py-2 bg-green-50 text-green-600 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:bg-green-100 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 font-sans whitespace-nowrap"
                        >
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 font-sans" />
                          <span className="hidden sm:inline">View Pharmacy</span>
                          <span className="sm:hidden">Pharmacy</span>
                        </button>

                        {console.log(
                          `Order ${order._id} status: "${
                            order.status
                          }" - Refill eligible: ${
                            order.status === "delivered" ||
                            order.status === "completed" ||
                            order.status === "ready"
                          }`
                        )}
                        {(order.status === "delivered" ||
                          order.status === "completed" ||
                          order.status === "ready") && (
                          <button
                            onClick={() => handleRefillRequest(order)}
                            disabled={
                              refillLoading[order._id] ||
                              refillRequests[order._id]?.status === "pending"
                            }
                            className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 font-sans whitespace-nowrap ${
                              refillRequests[order._id]?.status === "pending"
                                ? "bg-yellow-50 text-yellow-600 cursor-not-allowed"
                                : refillLoading[order._id]
                                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "bg-teal-50 text-teal-600 hover:bg-teal-100"
                            }`}
                          >
                            <RefreshCw
                              className={`w-3 h-3 sm:w-4 sm:h-4 font-sans ${
                                refillLoading[order._id] ? "animate-spin" : ""
                              }`}
                            />
                            <span className="hidden sm:inline">
                              {refillLoading[order._id]
                                ? "Requesting..."
                                : refillRequests[order._id]?.status === "pending"
                                ? "Refill Pending"
                                : "Request Refill"}
                            </span>
                            <span className="sm:hidden">
                              {refillLoading[order._id]
                                ? "..."
                                : refillRequests[order._id]?.status === "pending"
                                ? "Pending"
                                : "Refill"}
                            </span>
                          </button>
                        )}

                        {order.fulfilledBy?._id && (
                          <ChatButtonWithNotification
                            onClick={() => handleOpenChat(order)}
                            unreadCount={getChatUnreadCount(
                              orderIdMapping[order._id] || order._id
                            )}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {showTracking[order._id] && (
                  <div
                    className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border font-sans"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderColor: "rgba(37, 108, 92, 0.3)"
                    }}
                  >
                    <PatientOrderTracking
                      prescriptionId={order.prescriptionId?._id}
                      compact={true}
                    />
                  </div>
                )}

                {showHealthRecords[order._id] && (
                  <div
                    className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg sm:rounded-xl border font-sans"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      borderColor: "rgba(37, 108, 92, 0.3)",
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2 font-sans">
                      <h4
                        className="text-base sm:text-lg font-semibold flex items-center gap-2 font-sans"
                        style={{
                          color: "#256C5C"
                        }}
                      >
                        <Heart
                          className="w-4 h-4 sm:w-5 sm:h-5 font-sans"
                          style={{ color: "#256C5C" }}
                        />
                        Shared Health Records
                      </h4>
                      <div
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-sans"
                        style={{
                          color: "#256C5C",
                          backgroundColor: "rgba(37, 108, 92, 0.2)"
                        }}
                      >
                        <span className="hidden sm:inline">Shared with </span>
                        {order.fulfilledBy?.pharmacyName}
                      </div>
                    </div>

                    {healthRecords[order._id] ? (
                      <div className="space-y-3 sm:space-y-4 font-sans">
                        {/* Medical History */}
                        {healthRecords[order._id].medicalHistory?.length >
                          0 && (
                          <div
                            className="rounded-lg p-3 sm:p-4 border font-sans"
                            style={{
                              backgroundColor: "rgba(37, 108, 92, 0.1)",
                              borderColor: "rgba(37, 108, 92, 0.3)"
                            }}
                          >
                            <h5
                              className="font-medium mb-2 sm:mb-3 flex items-center gap-2 font-sans text-sm sm:text-base"
                              style={{
                                color: "#256C5C"
                              }}
                            >
                              <FileText
                                className="w-3 h-3 sm:w-4 sm:h-4 font-sans"
                                style={{ color: "#256C5C" }}
                              />
                              Medical History
                            </h5>
                            <div className="space-y-2 font-sans">
                              {healthRecords[order._id].medicalHistory.map(
                                (history, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded border gap-2 font-sans"
                                    style={{
                                      backgroundColor: "rgba(37, 108, 92, 0.05)",
                                      borderColor: "rgba(37, 108, 92, 0.2)"
                                    }}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span
                                        className="font-medium font-sans text-sm block"
                                        style={{
                                          color: "#256C5C"
                                        }}
                                      >
                                        {history.condition}
                                      </span>
                                      <span
                                        className="text-xs font-sans block sm:inline sm:ml-2"
                                        style={{
                                          color: "rgba(37, 108, 92, 0.7)"
                                        }}
                                      >
                                        (Diagnosed:{" "}
                                        {new Date(
                                          history.diagnosedDate
                                        ).toLocaleDateString()}
                                        )
                                      </span>
                                    </div>
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full self-start ${
                                        history.status === "active"
                                          ? "bg-red-100 text-red-800"
                                          : history.status === "resolved"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {history.status}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Allergies */}
                        {healthRecords[order._id].allergies?.length > 0 && (
                          <div
                            className="rounded-lg p-3 sm:p-4 border font-sans"
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              borderColor: "rgba(239, 68, 68, 0.3)"
                            }}
                          >
                            <h5
                              className="font-medium mb-2 sm:mb-3 flex items-center gap-2 font-sans text-sm sm:text-base"
                              style={{
                                color: "#256C5C"
                              }}
                            >
                              <AlertTriangle
                                className="w-3 h-3 sm:w-4 sm:h-4 font-sans"
                                style={{ color: "#EF4444" }}
                              />
                              Allergies & Intolerances
                            </h5>
                            <div className="flex flex-wrap gap-2 font-sans">
                              {healthRecords[order._id].allergies.map(
                                (allergy, index) => (
                                  <span
                                    key={index}
                                    className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium font-sans"
                                  >
                                    {allergy}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Current Medications */}
                        {healthRecords[order._id].currentMedications?.length >
                          0 && (
                          <div
                            className="rounded-lg p-3 sm:p-4 border font-sans"
                            style={{
                              backgroundColor: "rgba(34, 197, 94, 0.1)",
                              borderColor: "rgba(34, 197, 94, 0.3)"
                            }}
                          >
                            <h5
                              className="font-medium mb-2 sm:mb-3 flex items-center gap-2 font-sans text-sm sm:text-base"
                              style={{
                                color: "#256C5C"
                              }}
                            >
                              <Pill
                                className="w-3 h-3 sm:w-4 sm:h-4 font-sans"
                                style={{ color: "#22C55E" }}
                              />
                              Current Medications
                            </h5>
                            <div className="space-y-2 font-sans">
                              {healthRecords[order._id].currentMedications.map(
                                (medication, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded border gap-2 font-sans"
                                    style={{
                                      backgroundColor: "rgba(37, 108, 92, 0.05)",
                                      borderColor: "rgba(37, 108, 92, 0.2)"
                                    }}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <span
                                        className="font-medium font-sans text-sm block"
                                        style={{
                                          color: "#256C5C"
                                        }}
                                      >
                                        {medication.name}
                                      </span>
                                      <span
                                        className="text-xs font-sans block"
                                        style={{
                                          color: "rgba(37, 108, 92, 0.7)"
                                        }}
                                      >
                                        {medication.dosage} -{" "}
                                        {medication.frequency}
                                      </span>
                                    </div>
                                    <span
                                      className="text-xs font-sans self-start"
                                      style={{
                                        color: "rgba(37, 108, 92, 0.6)"
                                      }}
                                    >
                                      Since:{" "}
                                      {new Date(
                                        medication.startDate
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Vital Signs */}
                        {healthRecords[order._id].vitalSigns?.length > 0 && (
                          <div
                            className="rounded-lg p-3 sm:p-4 border font-sans"
                            style={{
                              backgroundColor: "rgba(37, 108, 92, 0.1)",
                              borderColor: "rgba(37, 108, 92, 0.3)"
                            }}
                          >
                            <h5
                              className="font-medium mb-2 sm:mb-3 flex items-center gap-2 font-sans text-sm sm:text-base"
                              style={{
                                color: "#256C5C"
                              }}
                            >
                              <Activity
                                className="w-3 h-3 sm:w-4 sm:h-4 font-sans"
                                style={{ color: "#256C5C" }}
                              />
                              Recent Vital Signs
                            </h5>
                            <div className="space-y-2 font-sans">
                              {healthRecords[order._id].vitalSigns.map(
                                (vital, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-2 rounded text-xs sm:text-sm border font-sans"
                                    style={{
                                      backgroundColor: "rgba(37, 108, 92, 0.05)",
                                      borderColor: "rgba(37, 108, 92, 0.2)"
                                    }}
                                  >
                                    <div>
                                      <span
                                        style={{
                                          color: "rgba(37, 108, 92, 0.7)"
                                        }}
                                      >
                                        BP:
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "#256C5C"
                                        }}
                                        className="block sm:inline"
                                      >
                                        {vital.bloodPressure || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        style={{
                                          color: "rgba(37, 108, 92, 0.7)"
                                        }}
                                      >
                                        HR:
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "#256C5C"
                                        }}
                                        className="block sm:inline"
                                      >
                                        {vital.heartRate || "N/A"} bpm
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        style={{
                                          color: "rgba(37, 108, 92, 0.7)"
                                        }}
                                      >
                                        Temp:
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "#256C5C"
                                        }}
                                        className="block sm:inline"
                                      >
                                        {vital.temperature || "N/A"}°F
                                      </span>
                                    </div>
                                    <div>
                                      <span
                                        style={{
                                          color: "rgba(37, 108, 92, 0.7)"
                                        }}
                                      >
                                        Date:
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "#256C5C"
                                        }}
                                        className="block sm:inline truncate"
                                      >
                                        {new Date(
                                          vital.recordedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* No shared records message */}
                        {!healthRecords[order._id].medicalHistory?.length &&
                          !healthRecords[order._id].allergies?.length &&
                          !healthRecords[order._id].currentMedications
                            ?.length &&
                          !healthRecords[order._id].vitalSigns?.length && (
                            <div
                              className="rounded-lg p-4 sm:p-6 text-center border font-sans"
                              style={{
                                backgroundColor: "rgba(37, 108, 92, 0.1)",
                                borderColor: "rgba(37, 108, 92, 0.3)"
                              }}
                            >
                              <Heart
                                className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 font-sans"
                                style={{ color: "rgba(37, 108, 92, 0.4)" }}
                              />
                              <p
                                className="text-sm sm:text-base"
                                style={{
                                  color: "#256C5C"
                                }}
                              >
                                No health records have been shared with this
                                pharmacy yet.
                              </p>
                              <p
                                className="text-xs sm:text-sm mt-1 font-sans"
                                style={{
                                  color: "rgba(37, 108, 92, 0.7)"
                                }}
                              >
                                Go to Health Records section to share your
                                medical information.
                              </p>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div
                        className="rounded-lg p-4 sm:p-6 text-center border font-sans"
                        style={{
                          backgroundColor: "rgba(37, 108, 92, 0.1)",
                          borderColor: "rgba(37, 108, 92, 0.3)"
                        }}
                      >
                        <div className="animate-pulse font-sans">
                          <div
                            className="h-3 sm:h-4 rounded w-3/4 mx-auto mb-2 font-sans"
                            style={{
                              backgroundColor: "rgba(37, 108, 92, 0.3)"
                            }}
                          ></div>
                          <div
                            className="h-3 sm:h-4 rounded w-1/2 mx-auto font-sans"
                            style={{
                              backgroundColor: "rgba(37, 108, 92, 0.3)"
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Chat Modal */}
      {showChatModal && selectedOrder && (
        <OrderChatModal
          isOpen={showChatModal}
          onClose={handleCloseChat}
          order={selectedOrder}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default OrderHistory;