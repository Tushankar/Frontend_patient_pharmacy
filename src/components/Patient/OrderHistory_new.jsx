import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
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

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
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

      const placedOrders = response.data.data.filter(
        (prescription) =>
          prescription.status === "accepted" ||
          prescription.status === "preparing" ||
          prescription.status === "ready" ||
          prescription.status === "delivered" ||
          prescription.status === "completed"
      );

      console.log("Filtered placed orders:", placedOrders);
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
        prescriptionInfo: { prescriptionId },
        fromOrderHistory: true,
      },
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <Clock className="w-5 h-5" />;
      case "preparing":
        return <Package className="w-5 h-5" />;
      case "ready":
        return <CheckCircle className="w-5 h-5" />;
      case "delivered":
      case "completed":
        return <Truck className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="rounded-2xl shadow-lg border p-6"
        style={{
          backgroundColor: "rgba(15, 76, 71, 0.95)",
          borderColor: "rgba(253, 224, 71, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
              }}
            >
              <Package className="w-6 h-6" style={{ color: "#115E59" }} />
            </div>
            <div>
              <h2
                className="text-3xl font-bold font-sans"
                style={{
                  color: "#DBF5F0",
                }}
              >
                Order History
              </h2>
              <p
                className="mt-1 font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.7)",
                }}
              >
                Track your prescription orders from pharmacies
              </p>
            </div>
          </div>
          <div
            className="text-sm font-medium px-4 py-2 rounded-full font-sans"
            style={{
              backgroundColor: "rgba(253, 224, 71, 0.1)",
              color: "#DBF5F0",
            }}
          >
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="rounded-2xl shadow-lg p-6 border"
        style={{
          backgroundColor: "rgba(15, 76, 71, 0.95)",
          borderColor: "rgba(253, 224, 71, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
            />
            <input
              type="text"
              placeholder="Search by pharmacy or prescription..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 transition-all duration-200 font-sans"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.1)",
                borderColor: "rgba(253, 224, 71, 0.3)",
                color: "#DBF5F0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FDE047";
                e.target.style.boxShadow = "0 0 0 2px rgba(253, 224, 71, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(253, 224, 71, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border rounded-xl focus:ring-2 appearance-none transition-all duration-200 font-sans"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.1)",
                borderColor: "rgba(253, 224, 71, 0.3)",
                color: "#DBF5F0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FDE047";
                e.target.style.boxShadow = "0 0 0 2px rgba(253, 224, 71, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(253, 224, 71, 0.3)";
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
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
            />
          </div>

          <div className="relative">
            <Calendar
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-12 pr-10 py-3 border rounded-xl focus:ring-2 appearance-none transition-all duration-200 font-sans"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.1)",
                borderColor: "rgba(253, 224, 71, 0.3)",
                color: "#DBF5F0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FDE047";
                e.target.style.boxShadow = "0 0 0 2px rgba(253, 224, 71, 0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(253, 224, 71, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="pharmacy">By Pharmacy Name</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div
            className="rounded-2xl shadow-lg p-12 border text-center"
            style={{
              backgroundColor: "rgba(15, 76, 71, 0.95)",
              borderColor: "rgba(253, 224, 71, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              className="p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.1)",
              }}
            >
              <Package
                className="w-10 h-10"
                style={{ color: "rgba(253, 224, 71, 0.6)" }}
              />
            </div>
            <h3
              className="text-xl font-bold mb-2 font-sans"
              style={{
                color: "#DBF5F0",
              }}
            >
              No orders found
            </h3>
            <p
              className="mb-6 font-sans"
              style={{
                color: "rgba(219, 245, 240, 0.7)",
              }}
            >
              {orders.length === 0
                ? "You haven't placed any orders yet. Upload a prescription to get started!"
                : "No orders match your current filters. Try adjusting your search criteria."}
            </p>
            {orders.length === 0 && (
              <button
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 font-sans"
                style={{
                  background:
                    "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                  color: "#115E59",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)";
                  e.target.style.transform = "translateY(0)";
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
              className="rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 group"
              style={{
                backgroundColor: "rgba(15, 76, 71, 0.95)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="p-3 rounded-xl text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                        color: "#115E59",
                      }}
                    >
                      {getStatusIcon(order.status)}
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold transition-colors font-sans"
                        style={{
                          color: "#DBF5F0",
                        }}
                      >
                        {order.fulfilledBy?.pharmacyName ||
                          "Pharmacy Name Not Available"}
                      </h3>

                      {!order.fulfilledBy && (
                        <div
                          className="flex items-center gap-2 mt-1 p-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            color: "#F87171",
                          }}
                        >
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
                        <div
                          className="flex items-center space-x-1 text-sm"
                          style={{ color: "rgba(219, 245, 240, 0.7)" }}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>
                            {order.fulfilledAt
                              ? new Date(order.fulfilledAt).toLocaleDateString()
                              : new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div
                        className="rounded-lg p-4 mt-4"
                        style={{
                          backgroundColor: "rgba(253, 224, 71, 0.1)",
                          border: "1px solid rgba(253, 224, 71, 0.2)",
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText
                            className="w-4 h-4"
                            style={{ color: "rgba(219, 245, 240, 0.7)" }}
                          />
                          <span
                            className="font-medium font-sans"
                            style={{
                              color: "#DBF5F0",
                            }}
                          >
                            Prescription Details
                          </span>
                        </div>
                        <div
                          className="text-sm font-sans"
                          style={{
                            color: "rgba(219, 245, 240, 0.8)",
                          }}
                        >
                          {order.prescriptionId?.description ||
                            "Prescription description not available"}
                        </div>
                      </div>

                      {order.fulfilledBy && (
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm"
                          style={{ color: "rgba(219, 245, 240, 0.8)" }}
                        >
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
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div
          className="rounded-2xl shadow-lg p-6 border"
          style={{
            backgroundColor: "rgba(15, 76, 71, 0.95)",
            borderColor: "rgba(253, 224, 71, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3
            className="text-xl font-bold mb-6 flex items-center gap-3 font-sans"
            style={{
              color: "#DBF5F0",
            }}
          >
            <div
              className="p-2 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
              }}
            >
              <Package className="w-5 h-5" style={{ color: "#115E59" }} />
            </div>
            Order Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              className="text-center p-6 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                border: "2px solid rgba(59, 130, 246, 0.2)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="text-3xl font-bold mb-2 font-sans"
                style={{
                  color: "#60A5FA",
                }}
              >
                {orders.length}
              </div>
              <div
                className="text-sm font-medium font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                }}
              >
                Total Orders
              </div>
            </div>
            <div
              className="text-center p-6 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                border: "2px solid rgba(34, 197, 94, 0.2)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="text-3xl font-bold mb-2 font-sans"
                style={{
                  color: "#4ADE80",
                }}
              >
                {
                  orders.filter(
                    (o) => o.status === "completed" || o.status === "delivered"
                  ).length
                }
              </div>
              <div
                className="text-sm font-medium font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                }}
              >
                Completed
              </div>
            </div>
            <div
              className="text-center p-6 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)",
                border: "2px solid rgba(245, 158, 11, 0.2)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="text-3xl font-bold mb-2 font-sans"
                style={{
                  color: "#FBBF24",
                }}
              >
                {
                  orders.filter(
                    (o) => o.status === "preparing" || o.status === "ready"
                  ).length
                }
              </div>
              <div
                className="text-sm font-medium font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                }}
              >
                In Progress
              </div>
            </div>
            <div
              className="text-center p-6 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
                border: "2px solid rgba(168, 85, 247, 0.2)",
                backdropFilter: "blur(5px)",
              }}
            >
              <div
                className="text-3xl font-bold mb-2 font-sans"
                style={{
                  color: "#A78BFA",
                }}
              >
                {
                  new Set(orders.map((o) => o.fulfilledBy?._id).filter(Boolean))
                    .size
                }
              </div>
              <div
                className="text-sm font-medium font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                }}
              >
                Unique Pharmacies
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
