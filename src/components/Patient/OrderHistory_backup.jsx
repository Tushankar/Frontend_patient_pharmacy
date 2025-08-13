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
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PatientOrderTracking from "./PatientOrderTracking";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showTracking, setShowTracking] = useState({});
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

      console.log("Order history API response:", response.data.data);

      // Filter to only include orders that have been placed with pharmacies
      const placedOrders = response.data.data.filter(
        (prescription) =>
          prescription.status === "accepted" ||
          prescription.status === "preparing" ||
          prescription.status === "ready" ||
          prescription.status === "delivered" ||
          prescription.status === "completed"
      );

      console.log("Filtered placed orders:", placedOrders);
      console.log("Sample order structure:", placedOrders[0]);

      setOrders(placedOrders);
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
        prescriptionInfo: {
          prescriptionId,
        },
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "preparing":
        return <Package className="w-5 h-5 text-yellow-600" />;
      case "ready":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "delivered":
      case "completed":
        return <Truck className="w-5 h-5 text-green-700" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-blue-50 text-blue-700 border-blue-200";
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

  // Filter and sort orders
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
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
            <p className="text-gray-600 mt-1">
              Track your prescription orders from pharmacies
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
          {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by pharmacy or prescription..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="accepted">Order Confirmed</option>
              <option value="preparing">Being Prepared</option>
              <option value="ready">Ready for Pickup</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="pharmacy">By Pharmacy Name</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "You haven't placed any orders yet. Upload a prescription to get started!"
                : "No orders match your current filters. Try adjusting your search criteria."}
            </p>
            {orders.length === 0 && (
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                Upload Prescription
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white">
                      {getStatusIcon(order.status)}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {order.fulfilledBy?.pharmacyName || "Pharmacy Name Not Available"}
                      </h3>
                      
                      {!order.fulfilledBy && (
                        <div className="flex items-center gap-2 mt-1 p-2 bg-red-50 text-red-600 rounded-lg text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Pharmacy information missing - please contact support
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                          {getStatusLabel(order.status)}
                        </span>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {order.fulfilledAt
                                ? new Date(
                                    order.fulfilledAt
                                  ).toLocaleDateString()
                                : new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prescription Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700">
                          Prescription Details
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.prescriptionId?.description ||
                          "Prescription description not available"}
                      </div>
                      {order.prescriptionId?.ocrData?.extractedText && (
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Medications:</strong>{" "}
                          {order.prescriptionId.ocrData.extractedText.slice(
                            0,
                            100
                          )}
                          ...
                        </div>
                      )}
                    </div>

                    {/* Pharmacy Contact Info */}
                    {order.fulfilledBy && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {order.fulfilledBy.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{order.fulfilledBy.phone}</span>
                          </div>
                        )}
                        {order.fulfilledBy.address && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {order.fulfilledBy.address.city},{" "}
                              {order.fulfilledBy.address.state}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() =>
                        handleViewPharmacyDetails(
                          order.fulfilledBy?._id,
                          order.prescriptionId?._id
                        )
                      }
                      disabled={!order.fulfilledBy?._id}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                        order.fulfilledBy?._id
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      title={
                        !order.fulfilledBy?._id
                          ? "Pharmacy information not available"
                          : "View pharmacy details"
                      }
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Pharmacy</span>
                    </button>

                    <button
                      onClick={() => handleToggleTracking(order._id)}
                      className="px-4 py-2 bg-purple-50 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Track Order</span>
                    </button>

                    {(order.status === "accepted" ||
                      order.status === "preparing" ||
                      order.status === "ready") && (
                      <button
                        onClick={() => {
                          // Handle chat with pharmacy
                          console.log(
                            "Start chat with pharmacy:",
                            order.fulfilledBy?._id
                          );
                        }}
                        disabled={!order.fulfilledBy?._id}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                          order.fulfilledBy?._id
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          !order.fulfilledBy?._id
                            ? "Pharmacy information not available"
                            : "Chat with pharmacy"
                        }
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <button className="px-4 py-2 bg-yellow-50 text-yellow-600 text-sm font-medium rounded-lg hover:bg-yellow-100 transition-colors flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Rate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Tracking */}
                {showTracking[order._id] && (
                  <div className="mt-4 border-t pt-4">
                    <PatientOrderTracking
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            Order Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {orders.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Total Orders</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {
                  orders.filter(
                    (o) => o.status === "completed" || o.status === "delivered"
                  ).length
                }
              </div>
              <div className="text-sm font-medium text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {
                  orders.filter(
                    (o) => o.status === "preparing" || o.status === "ready"
                  ).length
                }
              </div>
              <div className="text-sm font-medium text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {
                  new Set(orders.map((o) => o.fulfilledBy?._id).filter(Boolean))
                    .size
                }
              </div>
              <div className="text-sm font-medium text-gray-600">Unique Pharmacies</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
