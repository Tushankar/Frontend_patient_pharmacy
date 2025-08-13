import React, { useState, useEffect } from "react";
import { useAuth } from "../Login";
import { 
  Building, 
  Package, 
  Users, 
  DollarSign, 
  LogOut, 
  Bell, 
  Settings, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  FileText, 
  User, 
  Check, 
  X, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Activity, 
  MessageCircle, 
  ExternalLink,
  ArrowUpRight,
  Pill, 
  AlertCircle, 
  Shield, 
  BarChart3, 
  HelpCircle, 
  Download, 
  Star 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import axiosInstance from "../../utils/axiosInstance";
import PharmacyChatModal from "./PharmacyChatModal";
import PharmacyOrderManagement from "./PharmacyOrderManagement";
import UnifiedNotificationCenter from "../Notifications/UnifiedNotificationCenter";
import PharmacySidebar from "./PharmacySidebar";

const PharmacyDashboard = () => {
  const { user, logout } = useAuth();
  console.log(user);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  // State for real data
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    activeCustomers: 0,
    revenueToday: 0,
    growth: 0,
    pendingOrders: 0,
    completedOrders: 0,
    monthlyRevenue: 0,
    prescriptionsProcessed: 0,
    averageOrderValue: 0,
    customerRetention: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(false);

  
  // Mock data for analytics charts
const salesTrendData = [
  { month: 'Jan', sales: 12000, orders: 45 },
  { month: 'Feb', sales: 15000, orders: 52 },
  { month: 'Mar', sales: 18000, orders: 63 },
  { month: 'Apr', sales: 22000, orders: 78 },
  { month: 'May', sales: 19000, orders: 69 },
  { month: 'Jun', sales: 25000, orders: 85 }
];

const topMedicinesData = [
  { name: 'Paracetamol', sales: 4500, percentage: 18 },
  { name: 'Amoxicillin', sales: 3200, percentage: 13 },
  { name: 'Ibuprofen', sales: 2800, percentage: 11 },
  { name: 'Omeprazole', sales: 2400, percentage: 10 },
  { name: 'Metformin', sales: 2100, percentage: 8 }
];

const customerAgeData = [
  { age: '18-25', count: 25 },
  { age: '26-35', count: 45 },
  { age: '36-45', count: 35 },
  { age: '46-55', count: 30 },
  { age: '56+', count: 20 }
];

  const stats = [
  {
    icon: Package,
    label: "Total Orders",
    value: orderStats.totalOrders.toString(),
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    change: "+12%",
    changeType: "positive",
    bgHover: "hover:bg-blue-900/20",
    borderColor: "border-blue-400/30",
    textColor: "text-blue-400",
    iconBg: "bg-blue-900/40",
    shadowColor: "hover:shadow-blue-500/20"
  },
  {
    icon: Users,
    label: "Active Customers",
    value: orderStats.activeCustomers.toString(),
    color: "bg-gradient-to-br from-green-500 to-green-600",
    change: "+8%",
    changeType: "positive",
    bgHover: "hover:bg-green-900/20",
    borderColor: "border-green-400/30",
    textColor: "text-green-400",
    iconBg: "bg-green-900/40",
    shadowColor: "hover:shadow-green-500/20"
  },
  {
    icon: DollarSign,
    label: "Revenue Today",
    value: `₹${orderStats.revenueToday.toFixed(0)}`,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    change: "+15%",
    changeType: "positive",
    bgHover: "hover:bg-purple-900/20",
    borderColor: "border-purple-400/30",
    textColor: "text-purple-400",
    iconBg: "bg-purple-900/40",
    shadowColor: "hover:shadow-purple-500/20"
  },
  {
    icon: TrendingUp,
    label: "Monthly Revenue",
    value: `₹${orderStats.monthlyRevenue.toFixed(0)}`,
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    change: `+${orderStats.growth}%`,
    changeType: "positive",
    bgHover: "hover:bg-orange-900/20",
    borderColor: "border-orange-400/30",
    textColor: "text-orange-400",
    iconBg: "bg-orange-900/40",
    shadowColor: "hover:shadow-orange-500/20"
  },
  {
    icon: Clock,
    label: "Pending Orders",
    value: orderStats.pendingOrders.toString(),
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    change: "-5%",
    changeType: "negative",
    bgHover: "hover:bg-yellow-900/20",
    borderColor: "border-yellow-400/30",
    textColor: "text-yellow-400",
    iconBg: "bg-yellow-900/40",
    shadowColor: "hover:shadow-yellow-500/20"
  },
  {
    icon: CheckCircle,
    label: "Completed Orders",
    value: orderStats.completedOrders.toString(),
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    change: "+18%",
    changeType: "positive",
    bgHover: "hover:bg-emerald-900/20",
    borderColor: "border-emerald-400/30",
    textColor: "text-emerald-400",
    iconBg: "bg-emerald-900/40",
    shadowColor: "hover:shadow-emerald-500/20"
  },
  {
    icon: FileText,
    label: "Prescriptions Processed",
    value: orderStats.prescriptionsProcessed.toString(),
    color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    change: "+10%",
    changeType: "positive",
    bgHover: "hover:bg-indigo-900/20",
    borderColor: "border-indigo-400/30",
    textColor: "text-indigo-400",
    iconBg: "bg-indigo-900/40",
    shadowColor: "hover:shadow-indigo-500/20"
  },
  {
    icon: Heart,
    label: "Avg. Order Value",
    value: `₹${orderStats.averageOrderValue.toFixed(0)}`,
    color: "bg-gradient-to-br from-rose-500 to-rose-600",
    change: "+7%",
    changeType: "positive",
    bgHover: "hover:bg-rose-900/20",
    borderColor: "border-rose-400/30",
    textColor: "text-rose-400",
    iconBg: "bg-rose-900/40",
    shadowColor: "hover:shadow-rose-500/20"
  },
];

// Dark theme Tailwind classes for better visibility
const cardClasses = "bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-2 hover:scale-105 cursor-pointer group hover:bg-gray-750";

const iconClasses = "p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110";

const valueClasses = "text-3xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors duration-300";

const labelClasses = "text-sm font-semibold text-gray-300 uppercase tracking-wide group-hover:text-gray-200 transition-colors duration-300";

const changeClasses = {
  positive: "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/30 shadow-sm backdrop-blur-sm",
  negative: "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-900/30 text-red-400 border border-red-500/30 shadow-sm backdrop-blur-sm"
};

// Dark grid container classes
const gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen";

// Additional Tailwind animation classes with dark theme
const animationClasses = {
  fadeInUp: "animate-bounce", // Using built-in Tailwind animation
  pulseFlow: "animate-pulse",
  glassEffect: "backdrop-blur-sm bg-gray-800/90 border border-gray-700/50"
};

  // CSV Upload state and handlers
  const [showUpload, setShowUpload] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: "", type: "" });

  // Inventory state and fetching
  const [inventory, setInventory] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedParticipantName, setSelectedParticipantName] = useState("");
  // Incoming prescription requests state
  const [incomingRequests, setIncomingRequests] = useState([]);
  // Health record approval requests state
  const [healthRecordRequests, setHealthRecordRequests] = useState([]);
  // Loading state for approvals
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [approvingHealthRecords, setApprovingHealthRecords] = useState(
    new Set()
  );
  // Active view state for navigation
  const [activeView, setActiveView] = useState("dashboard");

  // Health records state for PharmacyDashboard
  const [healthRecords, setHealthRecords] = useState(null);
  const [showHealthRecordsModal, setShowHealthRecordsModal] = useState(false);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Patient details modal state
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatientDetails, setLoadingPatientDetails] = useState(false);
  const [selectedPrescriptionDetails, setSelectedPrescriptionDetails] =
    useState(null);

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get(`pharmacies/${user._id}/inventory`);
      setInventory(res.data.data);
    } catch (error) {
      console.error("Failed to fetch inventory", error);
    }
  };

  const fetchChatThreads = async () => {
    try {
      const res = await axiosInstance.get("/chat/threads");
      console.log("Chat threads response:", res.data.data);

      // Debug: Log the structure of each thread
      if (res.data.data && res.data.data.length > 0) {
        console.log("First thread structure:", res.data.data[0]);
        console.log(
          "First thread participants:",
          res.data.data[0]?.participants
        );
      }

      setChatThreads(res.data.data);
    } catch (err) {
      console.error("Failed to fetch chat threads", err);
    }
  };

  // Fetch incoming prescription approval requests for pharmacy
  const fetchIncomingRequests = async () => {
    try {
      const res = await axiosInstance.get("/prescriptions/requests");
      setIncomingRequests(res.data.data.requests);
    } catch (err) {
      console.error("Failed to fetch incoming requests", err);
    }
  };

  // Fetch pending health record approval requests for pharmacy
  const fetchHealthRecordRequests = async () => {
    try {
      const res = await axiosInstance.get("/pharmacies/health-records/pending");
      setHealthRecordRequests(res.data.data);
    } catch (err) {
      console.error("Failed to fetch health record requests", err);
    }
  };

  // Fetch recent orders for pharmacy dashboard
  const fetchRecentOrders = async () => {
    try {
      setLoadingOrders(true);

      // Fetch recent orders with increased limit to get all orders
      const ordersRes = await axiosInstance.get("/orders?limit=100&page=1");
      const orders = ordersRes.data.data.orders || [];

      console.log(`[DASHBOARD_ORDERS] Fetched ${orders.length} total orders`);
      console.log(
        `[DASHBOARD_ORDERS] Total available:`,
        ordersRes.data.data.pagination?.total || "unknown"
      );

      // Transform backend data to frontend format
      const transformedOrders = orders.map((order) => {
        const patientName = order.patientId
          ? `${order.patientId.firstName || ""} ${
              order.patientId.lastName || ""
            }`.trim()
          : "Unknown Patient";

        // Get primary medication from order items
        const primaryMedication =
          order.items && order.items.length > 0
            ? order.items[0]
            : { medicationName: "No medication", dosage: "", notes: "" };

        // Calculate time difference
        const timeAgo = getTimeAgo(order.createdAt);

        // Map backend status to frontend status
        const statusMap = {
          placed: "Pending",
          confirmed: "Confirmed",
          preparing: "Processing",
          ready: "Ready",
          delivered: "Completed",
          cancelled: "Cancelled",
        };

        return {
          id: order._id,
          customer: patientName,
          medication: primaryMedication.medicationName,
          dosage: primaryMedication.dosage,
          details: primaryMedication.notes || "No additional details",
          instructions:
            primaryMedication.notes || "Follow prescription instructions",
          status: statusMap[order.status] || order.status,
          time: timeAgo,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          itemCount: order.items ? order.items.length : 0,
        };
      });

      // Show recent 10 orders in dashboard, but calculate stats from all orders
      setRecentOrders(transformedOrders.slice(0, 10));

      // Calculate stats from all orders
      const totalOrders = orders.length;
      const activeCustomers = new Set(
        orders.map((o) => o.patientId?._id).filter(Boolean)
      ).size;
      const revenueToday = orders
        .filter((o) => isToday(new Date(o.createdAt)))
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      // Calculate additional metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders
        .filter((o) => {
          const orderDate = new Date(o.createdAt);
          return (
            orderDate.getMonth() === currentMonth &&
            orderDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      const pendingOrders = orders.filter((o) =>
        ["placed", "confirmed", "preparing"].includes(o.status)
      ).length;

      const completedOrders = orders.filter(
        (o) => o.status === "delivered"
      ).length;

      const prescriptionsProcessed = orders.filter(
        (o) =>
          o.prescriptionId &&
          ["delivered", "ready", "preparing"].includes(o.status)
      ).length;

      const averageOrderValue =
        totalOrders > 0
          ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) /
            totalOrders
          : 0;

      setOrderStats({
        totalOrders,
        activeCustomers,
        revenueToday,
        growth: 12, // You can calculate this based on historical data
        monthlyRevenue,
        pendingOrders,
        completedOrders,
        prescriptionsProcessed,
        averageOrderValue,
        customerRetention: 85, // This would come from backend calculation
      });

      console.log(`[DASHBOARD_ORDERS] Stats updated:`, {
        totalOrders,
        activeCustomers,
        revenueToday,
      });
    } catch (err) {
      console.error("Failed to fetch recent orders", err);
      setRecentOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffMs = now - orderDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }
  };

  // Helper function to check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Load inventory when user changes
  useEffect(() => {
    if (user?._id) {
      fetchInventory();
      fetchChatThreads();
      fetchRecentOrders();
      if (user.role === "pharmacy") {
        fetchIncomingRequests();
        fetchHealthRecordRequests();
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    try {
      const res = await axiosInstance.post(
        `pharmacies/${user._id}/inventory/upload-csv`,
        formData
      );
      const data = res.data;
      setUploadStatus({
        message: data.message || "Upload successful",
        type: "success",
      });
      // Refresh inventory after upload
      fetchInventory();
    } catch (error) {
      setUploadStatus({ message: "Upload error", type: "error" });
    }
  };

  // Single product form state and handlers
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
    medicineName: "",
    batchNumber: "",
    dosageForm: "",
    strength: "",
    unitWeightOrVolume: "",
    unitMeasurement: "mg",
    quantityAvailable: "",
    pricePerUnit: "",
    expiryDate: "",
    manufacturer: "",
    requiresPrescription: true,
  });

  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const res = await axiosInstance.post(
        `pharmacies/${user._id}/inventory`,
        newProduct
      );
      const data = res.data;
      setUploadStatus({
        message: data.message || "Product added",
        type: "success",
      });
      // Refresh inventory after adding product
      fetchInventory();
      setNewProduct({
        medicineName: "",
        batchNumber: "",
        dosageForm: "",
        strength: "",
        unitWeightOrVolume: "",
        unitMeasurement: "mg",
        quantityAvailable: "",
        pricePerUnit: "",
        expiryDate: "",
        manufacturer: "",
        requiresPrescription: true,
      });
    } catch (error) {
      setUploadStatus({ message: "Add error", type: "error" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border border-yellow-400/30";
      case "Confirmed":
        return "bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-400/30";
      case "Processing":
        return "bg-purple-500/20 backdrop-blur-sm text-purple-200 border border-purple-400/30";
      case "Ready":
        return "bg-green-500/20 backdrop-blur-sm text-green-200 border border-green-400/30";
      case "Completed":
        return "bg-green-500/20 backdrop-blur-sm text-green-200 border border-green-400/30";
      case "Cancelled":
        return "bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-400/30";
      default:
        return "bg-gray-500/20 backdrop-blur-sm text-gray-200 border border-gray-400/30";
    }
  };

  // Handle approve/reject actions on requests
  const handleApproval = async (prescriptionId, status) => {
    // Prevent multiple clicks while processing
    if (approvingIds.has(prescriptionId)) return;

    try {
      // Add to loading state
      setApprovingIds((prev) => new Set(prev).add(prescriptionId));

      await axiosInstance.patch(`/prescriptions/${prescriptionId}/approval`, {
        status,
      });

      // Refresh the incoming requests list and wait for it to complete
      await fetchIncomingRequests();

      // Also refresh recent orders since a new order might have been created
      await fetchRecentOrders();

      // Show success message after data is refreshed
      alert(`Prescription ${status} successfully!`);
    } catch (err) {
      console.error("Failed to respond to approval", err);
      alert(`Failed to ${status} prescription. Please try again.`);
    } finally {
      // Remove from loading state
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prescriptionId);
        return newSet;
      });
    }
  };

  // Handle health record approval
  const handleHealthRecordApproval = async (patientId, recordId, status) => {
    const approvalKey = `${patientId}-${recordId}`;

    // Prevent multiple clicks while processing
    if (approvingHealthRecords.has(approvalKey)) return;

    try {
      // Add to loading state
      setApprovingHealthRecords((prev) => new Set(prev).add(approvalKey));

      await axiosInstance.put(
        `/pharmacies/patients/${patientId}/health-records/${recordId}/approve`,
        {
          approvalStatus: status,
        }
      );

      // Refresh the health record requests list
      await fetchHealthRecordRequests();

      // Show success message
      alert(`Health record access ${status} successfully!`);
    } catch (err) {
      console.error("Failed to respond to health record approval", err);
      alert(`Failed to ${status} health record access. Please try again.`);
    } finally {
      // Remove from loading state
      setApprovingHealthRecords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(approvalKey);
        return newSet;
      });
    }
  };

  // Function to view patient health records
  const viewPatientHealthRecords = async (patientId) => {
    console.log("🔍 [PHARMACY_DASHBOARD] viewPatientHealthRecords called with patientId:", patientId);
    
    if (!patientId) {
      console.error("❌ [PHARMACY_DASHBOARD] Patient ID not found");
      alert("Patient ID not found");
      return;
    }

    try {
      console.log("🚀 [PHARMACY_DASHBOARD] Starting health records fetch...");
      setLoadingHealthRecords(true);
      setSelectedPatientId(patientId);
      setShowHealthRecordsModal(true);

      console.log(
        `📡 [PHARMACY_DASHBOARD] Making API call to: /pharmacies/patients/${patientId}/shared-health-records`
      );

      const response = await axiosInstance.get(
        `/pharmacies/patients/${patientId}/shared-health-records`
      );

      console.log("✅ [PHARMACY_DASHBOARD] API Response received:", response.data);
      console.log("📊 [PHARMACY_DASHBOARD] Health records data:", response.data.data);
      console.log("📈 [PHARMACY_DASHBOARD] Record counts:", response.data.data?.recordCounts);
      console.log("🏥 [PHARMACY_DASHBOARD] Health records structure:", response.data.data?.healthRecords);
      
      setHealthRecords(response.data.data);
      console.log("💾 [PHARMACY_DASHBOARD] Health records state updated");
    } catch (err) {
      console.error("❌ [PHARMACY_DASHBOARD] Failed to fetch health records:", err);
      console.error("❌ [PHARMACY_DASHBOARD] Error response:", err.response?.data);
      alert(
        err.response?.data?.message ||
          "Failed to load health records. Records may not be shared yet or an error occurred."
      );
      setShowHealthRecordsModal(false);
    } finally {
      setLoadingHealthRecords(false);
      console.log("🏁 [PHARMACY_DASHBOARD] Health records fetch completed");
    }
  };

  // Function to view patient details with prescription information
  const viewPatientDetails = async (patientId, prescriptionId) => {
    if (!patientId) {
      alert("Patient ID not found");
      return;
    }

    try {
      setLoadingPatientDetails(true);
      setShowPatientDetailsModal(true);

      console.log(
        `[PATIENT_DETAILS] Fetching details for patient: ${patientId}, prescription: ${prescriptionId}`
      );

      // Fetch patient details
      const patientResponse = await axiosInstance.get(
        `/auth/users/${patientId}`
      );
      console.log("[PATIENT_DETAILS] Patient response:", patientResponse.data);

      if (patientResponse.data.success) {
        setPatientDetails(patientResponse.data.data);
      }

      // Fetch prescription details if prescriptionId is provided
      if (prescriptionId) {
        try {
          const prescriptionResponse = await axiosInstance.get(
            `/prescriptions/${prescriptionId}`
          );
          console.log(
            "[PATIENT_DETAILS] Prescription response:",
            prescriptionResponse.data
          );
          setSelectedPrescriptionDetails(prescriptionResponse.data.data);
        } catch (prescErr) {
          console.error("Failed to fetch prescription details:", prescErr);
          // Continue even if prescription fetch fails
        }
      }
    } catch (err) {
      console.error("Failed to fetch patient details:", err);
      alert(
        err.response?.data?.message ||
          "Failed to load patient details. Please try again."
      );
      setShowPatientDetailsModal(false);
    } finally {
      setLoadingPatientDetails(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#115E59",
        backgroundImage: "linear-gradient(135deg, #115E59 0%, #0F4C47 100%)",
      }}
    >
      {/* Sidebar */}
      <PharmacySidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen overflow-x-hidden">
        {/* Professional Header */}
        {/* Professional Header - Fully Responsive */}
<div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm lg:pl-12 mt-16 sm:mt-20 md:mt-0">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Top Row - Title, Description and Desktop Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          {/* Left Section - Title and Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {activeView === "dashboard" && "Pharmacy Dashboard"}
              {activeView === "prescriptions" && "Incoming Prescriptions"}
              {activeView === "orders" && "Order Management"}
              {activeView === "inventory" && "Inventory Management"}
              {activeView === "analytics" && "Analytics & Reports"}
              {activeView === "chat" && "Patient Messages"}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-yellow-100 mt-1 sm:mt-1.5 md:mt-2">
              {activeView === "dashboard" &&
                "Overview of your pharmacy operations"}
              {activeView === "prescriptions" &&
                "Review and approve prescription requests from patients"}
              {activeView === "orders" &&
                "Manage prescription orders and fulfillment"}
              {activeView === "inventory" &&
                "Track and manage your medication inventory"}
              {activeView === "analytics" &&
                "Business insights and performance metrics"}
              {activeView === "chat" && "Communicate with your patients"}
            </p>
          </div>
          
          {/* Right Section - Desktop Only Actions */}
          <div className="hidden sm:flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Notification Center */}
            <UnifiedNotificationCenter userRole="pharmacy" />
            
            {/* User Info - Desktop */}
            <div className="hidden md:block text-right">
              <p className="text-sm lg:text-base font-medium text-white truncate max-w-[150px] lg:max-w-[200px] xl:max-w-none">
                {user?.pharmacyName}
              </p>
              <p className="text-xs lg:text-sm text-yellow-200">Licensed Pharmacy</p>
            </div>
            
            {/* User Avatar/Icon */}
            <div className="w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-white/30 flex-shrink-0">
              <Building className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Row - User Info and Actions */}
        <div className="flex sm:hidden items-center justify-between gap-2">
          {/* Mobile User Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 flex-shrink-0">
              <Building className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.pharmacyName}
              </p>
              <p className="text-xs text-yellow-200">Licensed Pharmacy</p>
            </div>
          </div>
          
          {/* Mobile Actions - Only Notification */}
          <div className="flex items-center flex-shrink-0">
            {/* Notification Center */}
            <UnifiedNotificationCenter userRole="pharmacy" />
          </div>
        </div>
        
        {/* Tablet Only User Info (sm breakpoint) */}
        <div className="hidden sm:flex md:hidden items-center gap-2 pt-2 border-t border-white/10">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 flex-shrink-0">
            <Building className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate max-w-[250px]">
              {user?.pharmacyName}
            </p>
            <p className="text-xs text-yellow-200">Licensed Pharmacy</p>
          </div>
        </div>
      </div>
    </div>
  </div>

        <main className="p-4 sm:p-6 md:p-8 space-y-9 sm:space-y-8 max-w-7xl mx-auto overflow-x-hidden">
          {activeView === "dashboard" && (
            <>
              {/* Enhanced Stats Grid */}
              
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8">
  {stats.map((stat, index) => {
    const Icon = stat.icon;
    const gradientColors = [
      "from-blue-400/20 to-blue-600/20 border-blue-400/30",
      "from-green-400/20 to-green-600/20 border-green-400/30",
      "from-purple-400/20 to-purple-600/20 border-purple-400/30",
      "from-orange-400/20 to-orange-600/20 border-orange-400/30",
      "from-yellow-400/20 to-yellow-600/20 border-yellow-400/30",
      "from-emerald-400/20 to-emerald-600/20 border-emerald-400/30",
      "from-indigo-400/20 to-indigo-600/20 border-indigo-400/30",
      "from-rose-400/20 to-rose-600/20 border-rose-400/30",
    ];
    const iconColors = [
      "text-blue-300",
      "text-green-300",
      "text-purple-300",
      "text-orange-300",
      "text-yellow-300",
      "text-emerald-300",
      "text-indigo-300",
      "text-rose-300",
    ];
    return (
      <div
        key={index}
        className={`bg-gradient-to-br ${
          gradientColors[index % gradientColors.length]
        } backdrop-blur-sm rounded-lg sm:rounded-xl shadow-sm border p-4 sm:p-5 md:p-6 hover:shadow-lg hover:scale-105 transition-all duration-200`}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div
            className={`p-2 sm:p-2.5 md:p-3 rounded-lg bg-white/10 backdrop-blur-sm`}
          >
            <Icon
              className={`w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                iconColors[index % iconColors.length]
              }`}
            />
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            {stat.changeType === "positive" ? (
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 mr-0.5 sm:mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-300 mr-0.5 sm:mr-1" />
            )}
            <span
              className={`font-medium ${
                stat.changeType === "positive"
                  ? "text-green-300"
                  : "text-red-300"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-teal-200 uppercase tracking-wide">
            {stat.label}
          </p>
          <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mt-1 sm:mt-2">
            {stat.value}
          </p>
          <p className="text-xs sm:text-xs md:text-sm text-teal-300 mt-0.5 sm:mt-1">
            vs last period
          </p>
        </div>
      </div>
    );
  })}
</div>

              {/* Recent Orders */}
              
<div className="bg-[#256C5C] rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] overflow-hidden">
  {/* Header */}
  <div className="p-4 sm:p-5 md:p-6 border-b border-white/20 bg-[#1F5A4D]/50">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-xl font-bold text-white">Recent Orders</h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={fetchRecentOrders}
          disabled={loadingOrders}
          className="p-2 sm:p-2.5 bg-white/20 text-white hover:bg-white/30 rounded-lg border border-white/30 transition-all disabled:opacity-50"
          title="Refresh orders"
        >
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingOrders ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
        <button
          onClick={() => setActiveView("orders")}
          className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm sm:text-base font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1 sm:gap-2"
        >
          <span className="hidden xs:inline">View all</span> orders
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  </div>

  {/* Table Content - Mobile Card View / Desktop Table View */}
  <div className="bg-[#D8F3ED]/90">
    {loadingOrders ? (
      <div className="p-8 sm:p-10 md:p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#256C5C]"></div>
        <p className="mt-2 text-xs sm:text-sm text-black">
          Loading orders...
        </p>
      </div>
    ) : recentOrders.length === 0 ? (
      <div className="p-8 sm:p-10 md:p-12 text-center">
        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-[#256C5C] mx-auto mb-3" />
        <p className="text-base sm:text-lg text-black font-medium">
          No recent orders found
        </p>
        <p className="text-xs sm:text-sm text-black/70 mt-1">
          Orders will appear here once customers place them
        </p>
      </div>
    ) : (
      <>
        {/* Mobile Card View */}
        <div className="block lg:hidden p-4 sm:p-5 space-y-3 sm:space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/50 rounded-lg p-4 sm:p-5 border border-[#256C5C]/20 space-y-3"
            >
              {/* Customer & Time */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#256C5C]/20 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#256C5C]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-black">{order.customer}</p>
                    <p className="text-xs sm:text-sm text-black/70">{order.time}</p>
                  </div>
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold rounded-full ${
                    order.status === "Completed" 
                      ? "bg-green-200 text-green-800" 
                      : order.status === "Pending" 
                      ? "bg-yellow-200 text-black" 
                      : order.status === "Processing" 
                      ? "bg-orange-200 text-orange-700"
                      : order.status === "Cancelled"
                      ? "bg-red-200 text-black"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              
              {/* Medication & Order Info */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-black/70">Medication:</span>
                  <p className="font-medium text-black">{order.medication}</p>
                  {order.dosage && (
                    <p className="text-black/70">Dosage: {order.dosage}</p>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    {order.orderNumber && (
                      <span className="text-black/70">Order: </span>
                    )}
                    <span className="font-medium text-black">#{order.orderNumber?.slice(-6)}</span>
                  </div>
                  {order.totalAmount && (
                    <p className="font-bold text-black text-base sm:text-lg">₹{order.totalAmount.toFixed(0)}</p>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={() => setActiveView("orders")}
                className="w-full px-3 py-2 bg-[#256C5C]/20 text-black text-xs sm:text-sm font-medium rounded-lg hover:bg-[#256C5C]/30 transition-all border border-[#256C5C]/30"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1F5A4D] border-b border-white/20">
              <tr>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white">Customer</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white">Medication</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white">Order Info</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white">Amount</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-semibold text-white">Status</th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-center text-xs xl:text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#256C5C]/20">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-white/10 transition-colors"
                >
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <div className="flex items-center gap-2 xl:gap-3">
                      <div className="w-8 h-8 xl:w-10 xl:h-10 bg-[#256C5C]/20 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 xl:w-5 xl:h-5 text-[#256C5C]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm xl:text-base text-black">{order.customer}</p>
                        <p className="text-xs xl:text-sm text-black/70">{order.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <p className="text-sm xl:text-base text-black">{order.medication}</p>
                    {order.dosage && (
                      <p className="text-xs xl:text-sm text-black/70">Dosage: {order.dosage}</p>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    {order.orderNumber && (
                      <p className="text-sm xl:text-base text-black font-medium">#{order.orderNumber.slice(-6)}</p>
                    )}
                    {order.itemCount > 1 ? (
                      <p className="text-xs xl:text-sm text-black/70">{order.itemCount} items</p>
                    ) : (
                      <p className="text-xs xl:text-sm text-black/70">Single item</p>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    {order.totalAmount && (
                      <p className="font-semibold text-sm xl:text-base text-black">₹{order.totalAmount.toFixed(0)}</p>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5 text-center">
                    <span
                      className={`px-3 xl:px-4 py-1 xl:py-2 text-xs xl:text-sm font-bold rounded-full inline-flex items-center justify-center min-w-[80px] xl:min-w-[100px] ${
                        order.status === "Completed" 
                          ? "bg-green-200 text-green-800" 
                          : order.status === "Pending" 
                          ? "bg-yellow-200 text-black" 
                          : order.status === "Processing" 
                          ? "bg-orange-200 text-orange-700"
                          : order.status === "Cancelled"
                          ? "bg-red-200 text-black"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5 text-center">
                    <button
                      onClick={() => setActiveView("orders")}
                      className="px-3 xl:px-4 py-1.5 xl:py-2 bg-[#256C5C]/20 text-black text-xs xl:text-sm font-medium rounded-lg hover:bg-[#256C5C]/30 transition-all border border-[#256C5C]/30"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
</div>

              {/* Quick Actions */}
{/* Alternative Design with Arrow Icons */}
<div className="mt-6 sm:mt-8 bg-[#256C5C] rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] p-4 sm:p-6 md:p-8">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
    <div className="flex items-center">
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
        <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
      </div>
      <h2 className="text-lg sm:text-xl md:text-xl font-bold text-white">
        Quick Actions 
      </h2>
    </div>
  </div>
  
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
    {/* View Orders */}
    <button
      onClick={() => setActiveView("orders")}
      className="group relative p-4 sm:p-5 md:p-6 bg-[#D8F3ED]/90 backdrop-blur-sm border-2 border-yellow-600/70 rounded-lg sm:rounded-xl hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
    >
      {/* Arrow Icon - Top Right */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#256C5C]/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1">
        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#256C5C] group-hover:text-blue-600" />
      </div>
      
      {/* Centered Content */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-500/30 transition-colors">
          <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-black mb-0.5 sm:mb-1">View Orders</h3>
        <p className="text-xs sm:text-sm text-black/70 hidden sm:block">Manage prescriptions</p>
      </div>
    </button>

    {/* Manage Inventory */}
    <button
      onClick={() => setActiveView("inventory")}
      className="group relative p-4 sm:p-5 md:p-6 bg-[#D8F3ED]/90 backdrop-blur-sm border-2 border-yellow-600/70 rounded-lg sm:rounded-xl hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300"
    >
      {/* Arrow Icon - Top Right */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#256C5C]/20 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-all duration-300 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1">
        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#256C5C] group-hover:text-emerald-600" />
      </div>
      
      {/* Centered Content */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-emerald-500/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-emerald-500/30 transition-colors">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-black mb-0.5 sm:mb-1">Inventory</h3>
        <p className="text-xs sm:text-sm text-black/70 hidden sm:block">Stock management</p>
      </div>
    </button>

    {/* Analytics */}
    <button
      onClick={() => setActiveView("analytics")}
      className="group relative p-4 sm:p-5 md:p-6 bg-[#D8F3ED]/90 backdrop-blur-sm border-2 border-yellow-600/70 rounded-lg sm:rounded-xl hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
    >
      {/* Arrow Icon - Top Right */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#256C5C]/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-all duration-300 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1">
        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#256C5C] group-hover:text-purple-600" />
      </div>
      
      {/* Centered Content */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-purple-500/30 transition-colors">
          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-black mb-0.5 sm:mb-1">Analytics</h3>
        <p className="text-xs sm:text-sm text-black/70 hidden sm:block">View insights</p>
      </div>
    </button>

    {/* Messages */}
    <button
      onClick={() => setActiveView("chat")}
      className="group relative p-4 sm:p-5 md:p-6 bg-[#D8F3ED]/90 backdrop-blur-sm border-2 border-yellow-600/70 rounded-lg sm:rounded-xl hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300"
    >
      {/* Arrow Icon - Top Right */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#256C5C]/20 rounded-full flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1">
        <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#256C5C] group-hover:text-amber-600" />
      </div>
      
      {/* Centered Content */}
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-500/20 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-amber-500/30 transition-colors">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-black mb-0.5 sm:mb-1">Messages</h3>
        <p className="text-xs sm:text-sm text-black/70 hidden sm:block">Patient chat</p>
      </div>
    </button>
  </div>
</div>

{/* Make sure to import these icons: */}
{/* import { Activity, ShoppingBag, Package, TrendingUp, MessageCircle, ExternalLink, ArrowUpRight } from 'lucide-react'; */}

              {/* Chat Threads */}
<div className="bg-[#256C5C] rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
    <div className="flex items-center">
      <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
      </div>
      <div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
          Recent Conversations
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-white/80 mt-0.5 sm:mt-1">
          Patient messages and chat history
        </p>
      </div>
    </div>
    {chatThreads.length > 0 && (
      <span className="text-sm sm:text-base text-white/90 font-medium">
        {chatThreads.length} active chats
      </span>
    )}
  </div>
  
  <div className="space-y-2 sm:space-y-3">
    {chatThreads.length > 0 ? (
      chatThreads.slice(0, 5).map((thread) => {
        // Enhanced patient name resolution - backend now provides better data
        const patient = thread.participants?.find(
          (p) =>
            p.role === "patient" ||
            p.participantRole === "patient"
        );

        let patientName = "Unknown Patient";

        if (patient) {
          // Backend now provides the 'name' field directly
          patientName =
            patient.name ||
            `${patient.firstName || ""} ${
              patient.lastName || ""
            }`.trim() ||
            patient.email?.split("@")[0] ||
            `Patient ${patient._id?.slice(-4) || ""}`;
        } else {
          // Fallback: find any non-pharmacy participant
          const otherParticipant = thread.participants?.find(
            (p) => p.role !== "pharmacy" && p._id !== user._id
          );
          if (otherParticipant) {
            patientName =
              otherParticipant.name ||
              `${otherParticipant.firstName || ""} ${
                otherParticipant.lastName || ""
              }`.trim() ||
              otherParticipant.email?.split("@")[0] ||
              `Patient ${otherParticipant._id?.slice(-4) || ""}`;
          }
        }

        const lastMessage =
          thread.messages && thread.messages.length > 0
            ? thread.messages[thread.messages.length - 1]
            : null;

        return (
          <div
            key={thread._id}
            onClick={() => {
              setSelectedThread(thread._id);
              setSelectedParticipantName(patientName);
            }}
            className="group relative flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 md:p-5 bg-[#D8F3ED]/90 rounded-lg sm:rounded-xl hover:bg-[#D8F3ED] transition-all cursor-pointer border-2 border-yellow-600/70 hover:border-emerald-600"
          >
            {/* Notion-like hover accent */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-emerald-600 rounded-l-lg sm:rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start sm:items-center w-full">
              {/* Avatar with status indicator */}
              <div className="relative ml-2 sm:ml-3 mr-3 sm:mr-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-[#256C5C]/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#256C5C]" />
                </div>
                {thread.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full ring-1 sm:ring-2 ring-[#D8F3ED] animate-pulse"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-1 sm:gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <h3 className="font-semibold text-black text-sm sm:text-base truncate">
                      {patientName}
                    </h3>
                    <span className="text-xs bg-emerald-600/20 text-emerald-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg font-medium">
                      Patient
                    </span>
                  </div>
                  {lastMessage && (
                    <span className="text-xs sm:text-sm text-black/70">
                      {new Date(lastMessage.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                {lastMessage && (
                  <p className="text-xs sm:text-sm text-black/80 truncate">
                    <span className="font-medium text-emerald-700">
                      {lastMessage.senderRole === "patient"
                        ? patientName
                        : "You"}
                      :
                    </span>
                    <span className="ml-1 text-black/70">
                      {lastMessage.content}
                    </span>
                  </p>
                )}
                {!lastMessage && (
                  <p className="text-xs sm:text-sm text-black/60 italic">
                    No messages yet
                  </p>
                )}
              </div>
              
              {/* Right side indicators */}
              <div className="flex items-center ml-3 sm:ml-4 space-x-2 sm:space-x-3">
                {thread.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.5rem] sm:min-w-[2rem] h-5 sm:h-6 md:h-7 px-1.5 sm:px-2 md:px-2.5 bg-red-500 text-white text-xs sm:text-sm rounded-full font-bold">
                    {thread.unreadCount}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#256C5C] group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center py-12 sm:py-14 md:py-16 bg-[#D8F3ED]/90 rounded-lg sm:rounded-xl border-2 border-yellow-600/70">
        <div className="bg-[#256C5C]/20 rounded-full w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6">
          <MessageCircle className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-[#256C5C]" />
        </div>
        <p className="text-black font-semibold text-lg sm:text-xl mb-2 sm:mb-3">
          No patient conversations yet
        </p>
        <p className="text-black/70 text-sm sm:text-base px-4">
          Messages from patients will appear here
        </p>
      </div>
    )}

    {chatThreads.length > 5 && (
      <button
        onClick={() => setActiveView("chat")}
        className="w-full mt-4 sm:mt-5 md:mt-6 py-3 sm:py-4 text-white font-semibold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 border border-emerald-500 hover:border-emerald-600 rounded-lg sm:rounded-xl transition-all flex items-center justify-center space-x-2"
      >
        <span>View All Conversations ({chatThreads.length})</span>
      </button>
    )}
  </div>
</div>
</>
)}


          {/* Incoming Prescriptions View */}

{activeView === "prescriptions" && (
  <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 bg-[#256C5C] p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl">
    {/* Prescriptions Header */}
    <div className="bg-[#CAE7E1] backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-[#256C5C]/40 p-3 sm:p-4 md:p-5 lg:p-6">
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black mb-1.5 sm:mb-2 flex items-center">
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-2.5 md:mr-3 text-[#256C5C] flex-shrink-0" />
        <span className="line-clamp-1 sm:line-clamp-none">Incoming Prescription Requests</span>
      </h2>
      <p className="text-xs sm:text-sm md:text-sm lg:text-base text-black/80 leading-relaxed">
        Review and approve prescription requests from patients. Each
        request requires your professional evaluation.
      </p>
    </div>

    {/* Prescription Requests Container */}
    <div className="bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border-2 border-yellow-600/70 p-3 sm:p-4 md:p-5 lg:p-6">
      {/* Header with Refresh */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
        <div className="flex flex-col xs:flex-row xs:items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black">
            Pending Requests ({incomingRequests.length})
          </h3>
          {incomingRequests.length > 0 && (
            <span className="inline-block w-fit px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-[#B6BA72]/50 backdrop-blur-sm text-black text-xs sm:text-sm font-medium rounded-full border border-[#256C5C]/50">
              {incomingRequests.length} Awaiting Review
            </span>
          )}
        </div>
        <button
          onClick={fetchIncomingRequests}
          className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-[#CAE7E1] backdrop-blur-sm text-black text-xs sm:text-sm md:text-base rounded-lg hover:bg-[#B5D9D2] transition-colors flex items-center justify-center gap-1.5 sm:gap-2 border border-[#256C5C]/40 w-full xs:w-auto min-h-[36px] sm:min-h-[40px] md:min-h-[44px]"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {incomingRequests.length === 0 ? (
        /* Empty State */
        <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12">
          <div className="bg-[#256C5C]/20 rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-5 lg:mb-6 border border-[#256C5C]/50">
            <FileText className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#256C5C]" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-black mb-1.5 sm:mb-2 md:mb-3">
            No Pending Prescriptions
          </h3>
          <p className="text-xs sm:text-sm md:text-sm lg:text-base text-black/70 mb-3 sm:mb-4 md:mb-5 lg:mb-6 max-w-sm sm:max-w-md mx-auto px-2 sm:px-4">
            All prescription requests have been processed. New
            requests will appear here for your review.
          </p>
          <div className="bg-[#CAE7E1] backdrop-blur-sm border border-[#256C5C]/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <div className="flex items-start space-x-2 sm:space-x-2.5 md:space-x-3">
              <div className="bg-[#256C5C]/30 rounded-full p-1 sm:p-1.5 md:p-2 mt-0.5 flex-shrink-0">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-[#256C5C]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-black text-xs sm:text-sm md:text-sm lg:text-base font-medium mb-0.5 sm:mb-1">
                  Ready for Patient Requests
                </p>
                <p className="text-black/70 text-xs sm:text-xs md:text-xs lg:text-sm leading-relaxed">
                  Patients can submit prescription approval requests
                  through their portal. You'll receive notifications
                  for new submissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Prescription Request Cards */
        <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
          {incomingRequests.map((req) => (
            <div
              key={req.prescriptionId}
              className="bg-[#CAE7E1] backdrop-blur-sm border border-[#256C5C]/40 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:border-[#256C5C]/60 transition-all duration-200 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-4 lg:gap-6">
                {/* Patient Info Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start xs:items-center space-x-2 sm:space-x-2.5 md:space-x-3 mb-2 sm:mb-3 md:mb-4">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#256C5C]/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-[#256C5C]/50 flex-shrink-0">
                      <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#256C5C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-black text-sm sm:text-sm md:text-base lg:text-lg truncate mb-0.5 sm:mb-1">
                        {req.patientName || "Patient Name Not Available"}
                      </p>
                      <span className="inline-block px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 sm:py-0.5 md:py-1 bg-yellow-200 backdrop-blur-sm text-black text-xs sm:text-xs md:text-xs lg:text-sm font-medium rounded-full border border-yellow-600/50">
                        Pending Professional Review
                      </span>
                    </div>
                  </div>
                  
                  {/* Request Details */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 text-xs sm:text-xs md:text-sm text-black/70">
                    <div className="flex items-center min-w-0">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2 text-[#256C5C] flex-shrink-0" />
                      <span className="font-medium whitespace-nowrap">Requested:</span>
                      <span className="ml-0.5 sm:ml-1 truncate">
                        {new Date(req.requestedAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2 text-[#256C5C] flex-shrink-0" />
                      <span className="font-medium">ID:</span>
                      <span className="ml-0.5 sm:ml-1">#{req.prescriptionId.slice(-8)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section - Mobile Optimized */}
                <div className="flex flex-col space-y-2 sm:space-y-2.5 md:space-y-3 w-full">
                  {/* View Buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                    <button
                      onClick={() => viewPatientHealthRecords(req.patientId)}
                      disabled={!req.patientId}
                      className={`px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 text-xs sm:text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] ${
                        req.patientId
                          ? "bg-[#CAE7E1] backdrop-blur-sm text-black hover:bg-[#B5D9D2] border border-[#256C5C]/50"
                          : "bg-gray-200/40 backdrop-blur-sm text-gray-400 cursor-not-allowed border border-gray-300/40"
                      }`}
                      title={
                        req.patientId
                          ? "View patient health records"
                          : "Patient ID not available"
                      }
                    >
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span className="hidden xs:inline">Health</span>
                      <span>Records</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        viewPatientDetails(req.patientId, req.prescriptionId);
                      }}
                      className="px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 bg-[#256C5C]/20 backdrop-blur-sm text-black text-xs sm:text-xs md:text-sm font-medium rounded-lg hover:bg-[#256C5C]/30 transition-colors border border-[#256C5C]/50 flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2 min-h-[32px] sm:min-h-[36px] md:min-h-[40px]"
                    >
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span className="hidden xs:inline">View</span>
                      <span>Details</span>
                    </button>
                  </div>
                  
                  {/* Approve/Reject Buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                    <button
                      onClick={() => handleApproval(req.prescriptionId, "approved")}
                      disabled={approvingIds.has(req.prescriptionId)}
                      className={`px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 text-white text-xs sm:text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] ${
                        approvingIds.has(req.prescriptionId)
                          ? "bg-gray-400/50 backdrop-blur-sm cursor-not-allowed border border-gray-400/50"
                          : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border border-green-600/50 shadow-sm"
                      }`}
                    >
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span>
                        {approvingIds.has(req.prescriptionId)
                          ? "Processing..."
                          : "Approve"}
                      </span>
                    </button>
                    <button
                      onClick={() => handleApproval(req.prescriptionId, "rejected")}
                      disabled={approvingIds.has(req.prescriptionId)}
                      className={`px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 text-white text-xs sm:text-xs md:text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] ${
                        approvingIds.has(req.prescriptionId)
                          ? "bg-gray-400/50 backdrop-blur-sm cursor-not-allowed border border-gray-400/50"
                          : "bg-red-600/80 backdrop-blur-sm hover:bg-red-700 border border-red-500/50 shadow-sm"
                      }`}
                    >
                      <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                      <span>
                        {approvingIds.has(req.prescriptionId)
                          ? "Processing..."
                          : "Reject"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

          {/* Order Management View */}
          {activeView === "orders" && <PharmacyOrderManagement />}

          {/* Inventory View */}
          
{activeView === "inventory" && (
  <div className="space-y-4 sm:space-y-5 md:space-y-6">
    {/* Inventory Management Header */}
    <div className="bg-[#256C5C] backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
          Inventory Management
        </h2>
      </div>
      <p className="text-white/90 text-sm sm:text-base md:text-lg">
        Manage your pharmacy inventory, upload CSV files, and add individual products.
      </p>
    </div>

    {/* Inventory Table */}
    <div className="bg-[#256C5C] backdrop-blur-lg rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] overflow-hidden">
      <div className="p-3 sm:p-4 md:p-6 border-b border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Current Inventory</h3>
          </div>
          
          {/* Action Buttons Inside Table Header */}
          <div className="flex flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setShowUpload((prev) => !prev)}
              className="group flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 border border-teal-500/30 shadow-lg hover:shadow-teal-500/25 hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden xs:inline">{showUpload ? "Hide" : "Upload"}</span> CSV
            </button>
            <button
              onClick={() => setShowAdd((prev) => !prev)}
              className="group flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/25 hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden xs:inline">{showAdd ? "Hide" : "Add"}</span> Product
            </button>
          </div>
        </div>
      </div>
      
      {/* CSV Upload Section - Now inside table */}
      {showUpload && (
        <div className="p-3 sm:p-4 md:p-6 bg-[#D8F3ED]/90 border-b border-white/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1 sm:p-1.5 bg-[#256C5C] rounded-lg">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-black">Upload Inventory CSV</h4>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-xs sm:text-sm text-black file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-[#256C5C] file:text-white hover:file:bg-[#1F5A4D] file:transition-all file:duration-300 file:shadow-lg cursor-pointer bg-white/50 rounded-lg border-2 border-dashed border-[#256C5C]/50 hover:border-[#256C5C] transition-colors duration-300 p-2 sm:p-3"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button
                onClick={handleCsvUpload}
                disabled={!csvFile}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#256C5C] hover:bg-[#1F5A4D] disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none text-xs sm:text-sm"
              >
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Upload CSV
              </button>
              {uploadStatus.message && (
                <div
                  className={`p-2 sm:p-3 rounded-lg border-l-4 font-medium animate-in slide-in-from-left duration-300 flex-1 text-xs sm:text-sm ${
                    uploadStatus.type === "success"
                      ? "bg-emerald-50 text-black border-emerald-500 shadow-lg shadow-emerald-500/10"
                      : "bg-red-50 text-black border-red-500 shadow-lg shadow-red-500/10"
                  }`}
                >
                  {uploadStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Single Product Form - Now inside table */}
      {showAdd && (
        <div className="p-3 sm:p-4 md:p-6 bg-[#D8F3ED]/90 border-b border-white/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1 sm:p-1.5 bg-[#256C5C] rounded-lg">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-black">Add Single Product</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <input
              name="medicineName"
              value={newProduct.medicineName}
              onChange={handleNewChange}
              placeholder="Medicine Name"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="batchNumber"
              value={newProduct.batchNumber}
              onChange={handleNewChange}
              placeholder="Batch Number"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="dosageForm"
              value={newProduct.dosageForm}
              onChange={handleNewChange}
              placeholder="Dosage Form"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="strength"
              value={newProduct.strength}
              onChange={handleNewChange}
              placeholder="Strength"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="unitWeightOrVolume"
              type="number"
              value={newProduct.unitWeightOrVolume}
              onChange={handleNewChange}
              placeholder="Unit Weight/Volume"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <select
              name="unitMeasurement"
              value={newProduct.unitMeasurement}
              onChange={handleNewChange}
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            >
              <option value="mg" className="bg-white text-black">mg</option>
              <option value="ml" className="bg-white text-black">ml</option>
            </select>
            <input
              name="quantityAvailable"
              type="number"
              value={newProduct.quantityAvailable}
              onChange={handleNewChange}
              placeholder="Quantity Available"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="pricePerUnit"
              type="number"
              value={newProduct.pricePerUnit}
              onChange={handleNewChange}
              placeholder="Price per Unit"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="expiryDate"
              type="date"
              value={newProduct.expiryDate}
              onChange={handleNewChange}
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm"
            />
            <input
              name="manufacturer"
              value={newProduct.manufacturer}
              onChange={handleNewChange}
              placeholder="Manufacturer"
              className="p-2 sm:p-2.5 md:p-3 bg-white/70 border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] text-black placeholder-gray-600 transition-all duration-300 hover:bg-white/80 text-xs sm:text-sm sm:col-span-2 lg:col-span-2"
            />
            <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-white/50 rounded-lg hover:bg-white/60 transition-all duration-300 cursor-pointer">
              <input
                name="requiresPrescription"
                type="checkbox"
                checked={newProduct.requiresPrescription}
                onChange={handleNewChange}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded transition-all duration-300 focus:ring-2 focus:ring-[#256C5C] text-[#256C5C] bg-white border-[#256C5C]/50"
              />
              <span className="text-black font-medium text-xs sm:text-sm">Requires Prescription</span>
            </label>
            <button
              onClick={handleAddProduct}
              className="group px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 bg-[#256C5C] hover:bg-[#1F5A4D] text-white rounded-lg font-medium transition-all duration-300 col-span-1 sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-xs sm:text-sm"
            >
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
              Add Product
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile Card View for Inventory */}
      <div className="block lg:hidden">
        {inventory.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-[#D8F3ED]/90">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-[#256C5C]/20 rounded-full">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#256C5C]" />
              </div>
              <div>
                <p className="text-base sm:text-lg md:text-xl font-medium text-black mb-1 sm:mb-2">
                  No inventory items found
                </p>
                <p className="text-xs sm:text-sm text-black">
                  Add products using the buttons above
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#256C5C]/20 bg-[#D8F3ED]/90">
            {inventory.map((item, index) => (
              <div
                key={item._id}
                className="p-3 sm:p-4 space-y-2 sm:space-y-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-black">{item.medicineName}</p>
                    <p className="text-xs sm:text-sm text-black/70">{item.strength}</p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-bold rounded-full ${
                      item.quantityAvailable > 10
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-400"
                        : item.quantityAvailable > 0
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-400"
                        : "bg-red-100 text-red-700 border border-red-400"
                    }`}
                  >
                    {item.quantityAvailable > 10
                      ? "In Stock"
                      : item.quantityAvailable > 0
                      ? "Low Stock"
                      : "Out of Stock"}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-black/70">Batch:</span>
                    <span className="ml-1 font-medium text-black">{item.batchNumber}</span>
                  </div>
                  <div>
                    <span className="text-black/70">Form:</span>
                    <span className="ml-1 font-medium text-black">{item.dosageForm}</span>
                  </div>
                  <div>
                    <span className="text-black/70">Qty:</span>
                    <span className="ml-1 font-medium text-black">{item.quantityAvailable} {item.unitMeasurement}</span>
                  </div>
                  <div>
                    <span className="text-black/70">Price:</span>
                    <span className="ml-1 font-bold text-black">₹{item.pricePerUnit}</span>
                  </div>
                </div>
                
                {item.expiryDate && (
                  <div className="text-xs sm:text-sm">
                    <span className="text-black/70">Expiry:</span>
                    <span className="ml-1 font-medium text-black">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#1F5A4D]">
            <tr>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Medicine
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Batch Number
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Dosage Form
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left text-xs xl:text-sm font-semibold text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 bg-[#D8F3ED]/90">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 xl:py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-[#256C5C]/20 rounded-full">
                      <Package className="w-10 h-10 xl:w-12 xl:h-12 text-[#256C5C]" />
                    </div>
                    <div>
                      <p className="text-lg xl:text-xl font-medium text-black mb-2">
                        No inventory items found
                      </p>
                      <p className="text-sm text-black">
                        Add products using the buttons above
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              inventory.map((item, index) => (
                <tr
                  key={item._id}
                  className={`hover:bg-white/10 transition-all duration-300 ${
                    index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                  }`}
                >
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <div className="flex flex-col">
                      <div className="text-sm xl:text-base font-semibold text-black mb-1">
                        {item.medicineName}
                      </div>
                      <div className="text-xs xl:text-sm text-black font-medium">
                        {item.strength}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <span className="text-xs xl:text-sm font-medium text-black bg-white/50 px-2 xl:px-3 py-1 rounded-lg">
                      {item.batchNumber}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5 text-xs xl:text-sm font-medium text-black">
                    {item.dosageForm}
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <span className="text-xs xl:text-sm font-semibold text-black bg-[#B6BA72]/50 px-2 xl:px-3 py-1 rounded-lg border border-[#256C5C]/30">
                      {item.quantityAvailable} {item.unitMeasurement}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <span className="text-sm xl:text-base font-bold text-black">
                      ₹{item.pricePerUnit}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5 text-xs xl:text-sm font-medium text-black">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 xl:px-6 py-4 xl:py-5">
                    <span
                      className={`inline-flex px-2 xl:px-3 py-1 text-xs font-bold rounded-full border-2 ${
                        item.quantityAvailable > 10
                          ? "bg-emerald-100 text-emerald-700 border-emerald-400 shadow-lg shadow-emerald-500/10"
                          : item.quantityAvailable > 0
                          ? "bg-yellow-100 text-yellow-700 border-yellow-400 shadow-lg shadow-yellow-500/10"
                          : "bg-red-100 text-red-700 border-red-400 shadow-lg shadow-red-500/10"
                      }`}
                    >
                      {item.quantityAvailable > 10
                        ? "In Stock"
                        : item.quantityAvailable > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}



          {/* Analytics View */}


{activeView === "analytics" && (
  <div className="space-y-4 sm:space-y-6 md:space-y-8">
    <div className="bg-[#256C5C] rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
        <div className="flex items-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 md:mr-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              Pharmacy Analytics
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 mt-0.5 sm:mt-1">
              Track performance and business insights
            </p>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-white/70">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8 md:mb-10">
        {/* Total Orders */}
        <div className="relative bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 hover:border-blue-400/60 transition-all duration-300 group overflow-hidden shadow-lg">
          {/* Background Glow Effect */}
          <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-colors duration-500"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
              <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-lg sm:rounded-xl">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
                All Time
              </span>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 tracking-tight">
                {orderStats.totalOrders}
              </p>
              <p className="text-xs sm:text-sm text-black/80 font-medium mb-2 sm:mb-3 md:mb-4">Total Orders</p>
              
              {/* Trend */}
              <div className="flex items-center space-x-1 sm:space-x-2 pt-2 sm:pt-3 border-t border-[#256C5C]/20">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                  <span className="text-xs font-semibold">12%</span>
                </div>
                <span className="text-xs text-black/70">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="relative bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 hover:border-emerald-400/60 transition-all duration-300 group overflow-hidden shadow-lg">
          {/* Background Glow Effect */}
          <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/15 transition-colors duration-500"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
              <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 rounded-lg sm:rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-600" />
              </div>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
                Monthly
              </span>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 tracking-tight">
                {orderStats.activeCustomers}
              </p>
              <p className="text-xs sm:text-sm text-black/80 font-medium mb-2 sm:mb-3 md:mb-4">Active Customers</p>
              
              {/* Trend */}
              <div className="flex items-center space-x-1 sm:space-x-2 pt-2 sm:pt-3 border-t border-[#256C5C]/20">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                  <span className="text-xs font-semibold">+8</span>
                </div>
                <span className="text-xs text-black/70">new this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="relative bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 hover:border-amber-400/60 transition-all duration-300 group overflow-hidden shadow-lg">
          {/* Background Glow Effect */}
          <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-colors duration-500"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
              <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-amber-500/15 to-amber-600/10 rounded-lg sm:rounded-xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-amber-600" />
              </div>
              <span className="text-xs text-amber-600 bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
                Today
              </span>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 tracking-tight">
                ₹{orderStats.revenueToday}
              </p>
              <p className="text-xs sm:text-sm text-black/80 font-medium mb-2 sm:mb-3 md:mb-4">Today's Revenue</p>
              
              {/* Trend */}
              <div className="flex items-center space-x-1 sm:space-x-2 pt-2 sm:pt-3 border-t border-[#256C5C]/20">
                <div className="flex items-center text-red-600">
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                  <span className="text-xs font-semibold">5%</span>
                </div>
                <span className="text-xs text-black/70">vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="relative bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 hover:border-purple-400/60 transition-all duration-300 group overflow-hidden shadow-lg">
          {/* Background Glow Effect */}
          <div className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/15 transition-colors duration-500"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between mb-3 sm:mb-4 md:mb-6 gap-2">
              <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-purple-500/15 to-purple-600/10 rounded-lg sm:rounded-xl">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium">
                Monthly
              </span>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2 tracking-tight">
                {orderStats.growth}%
              </p>
              <p className="text-xs sm:text-sm text-black/80 font-medium mb-2 sm:mb-3 md:mb-4">Growth Rate</p>
              
              {/* Trend */}
              <div className="flex items-center space-x-1 sm:space-x-2 pt-2 sm:pt-3 border-t border-[#256C5C]/20">
                <div className="flex items-center text-green-600">
                  <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                  <span className="text-xs font-semibold">Target</span>
                </div>
                <span className="text-xs text-black/70">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* Sales Trend Chart */}
        <div className="bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 shadow-lg">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-3 sm:mb-4 md:mb-6">Sales Trend</h3>
          <div className="h-[200px] sm:h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#256C5C30" />
                <XAxis dataKey="month" stroke="#000000" tick={{ fontSize: 12 }} />
                <YAxis stroke="#000000" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#D8F3ED', 
                    border: '1px solid #256C5C',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#000000',
                    fontSize: '12px'
                  }} 
                />
                <Line type="monotone" dataKey="sales" stroke="#256C5C" strokeWidth={2} dot={{ fill: '#256C5C', strokeWidth: 2, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Medicines Chart */}
        <div className="bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 shadow-lg">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-3 sm:mb-4 md:mb-6">Top Selling Medicines</h3>
          <div className="h-[200px] sm:h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMedicinesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#256C5C30" />
                <XAxis dataKey="name" stroke="#000000" tick={{ fontSize: 12 }} />
                <YAxis stroke="#000000" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#D8F3ED', 
                    border: '1px solid #256C5C',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#000000',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="sales" fill="#256C5C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customer Demographics - Full Width */}
      <div className="bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border-2 border-yellow-600/70 shadow-lg">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-3 sm:mb-4 md:mb-6">Customer Age Demographics</h3>
        <div className="h-[200px] sm:h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerAgeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius="70%"
                fill="#8884d8"
                dataKey="count"
              >
                {customerAgeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#256C5C', '#4A9782', '#6AB5A4', '#8AD1C6', '#A8E6D5'][index % 5]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #256C5C',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#000000',
                  padding: '8px',
                  fontSize: '12px'
                }}
                formatter={(value, name) => [`Count: ${value}`, name]}
              />
              <Legend 
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => value}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
)}

          {/* Chat/Messages View */}
          
{activeView === "chat" && (
  <div className="space-y-4 sm:space-y-5 md:space-y-6">
    <div className="bg-[#266C5C] backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl sm:shadow-2xl border border-[#1F5A4D] p-4 sm:p-6 md:p-8">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 md:mb-8 flex items-center">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mr-2 sm:mr-3 md:mr-4 text-white/90 group-hover:text-white transition-colors duration-300" />
        Patient Conversations
      </h2>

      {/* Chat Threads */}
      {chatThreads.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {chatThreads.map((thread) => {
            const lastMessage =
              thread.messages && thread.messages.length > 0
                ? thread.messages[thread.messages.length - 1]
                : null;

            // Enhanced patient name resolution - backend now provides better data
            const patient = thread.participants?.find(
              (p) =>
                p.role === "patient" ||
                p.participantRole === "patient"
            );

            let patientName = "Unknown Patient";

            if (patient) {
              patientName =
                patient.name ||
                `${patient.firstName || ""} ${
                  patient.lastName || ""
                }`.trim() ||
                patient.email?.split("@")[0] ||
                `Patient ${patient._id?.slice(-4) || ""}`;
            } else {
              const otherParticipant = thread.participants?.find(
                (p) => p.role !== "pharmacy" && p._id !== user._id
              );
              if (otherParticipant) {
                patientName =
                  otherParticipant.name ||
                  `${otherParticipant.firstName || ""} ${
                    otherParticipant.lastName || ""
                  }`.trim() ||
                  otherParticipant.email?.split("@")[0] ||
                  `Patient ${otherParticipant._id?.slice(-4) || ""}`;
              }
            }

            return (
              <div
                key={thread._id}
                className="group bg-[#D8F3ED]/90 backdrop-blur-sm border-2 border-[#B5E5DB]/70 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:border-[#7DD3C0] hover:bg-[#D8F3ED]/95 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#5EEAD4]/30 transform hover:-translate-y-0.5 sm:hover:-translate-y-1"
                onClick={() => {
                  setSelectedThread(thread._id);
                  setSelectedParticipantName(patientName);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5 flex-1">
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-emerald-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-emerald-500/40 group-hover:border-emerald-600/70 transition-colors duration-300">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
                      </div>
                      {thread.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse ring-2 ring-red-400/50">
                          {thread.unreadCount > 99
                            ? "99+"
                            : thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black group-hover:text-black/90 transition-colors duration-300">
                          {patientName}
                        </h3>
                        <span className="bg-emerald-600/20 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-500/50 shadow-sm">
                          Patient
                        </span>
                        {(patient?.isOnline ||
                          thread.participants?.find(
                            (p) => p._id !== user._id
                          )?.isOnline) && (
                          <span className="flex items-center text-emerald-600 text-xs font-medium">
                            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full mr-1.5 sm:mr-2 animate-pulse shadow-sm shadow-emerald-500/50"></div>
                            Online
                          </span>
                        )}
                      </div>
                      {lastMessage ? (
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-xs sm:text-sm text-black/90 font-medium line-clamp-2">
                            <span className="text-emerald-700 font-semibold">
                              {lastMessage.senderRole === "patient"
                                ? `${patientName}:`
                                : "You:"}
                            </span>
                            <span className="ml-1 sm:ml-2 text-black/80">
                              {lastMessage.content}
                            </span>
                          </p>
                          <p className="text-xs text-black/70 font-medium">
                            {new Date(
                              lastMessage.timestamp
                            ).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-black/70 italic">
                          No messages yet • Ready to start
                          conversation
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                    <div className="text-right">
                      {lastMessage && (
                        <p className="text-xs text-black/70 font-medium mb-1">
                          {new Date(
                            lastMessage.timestamp
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      <p className="text-xs text-black bg-[#B6BA72]/50 px-2 py-1 rounded-md">
                        {thread.messages?.length || 0} messages
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300 transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 md:py-16">
          <div className="bg-[#D8F3ED]/90 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-[#B5E5DB]/70 p-6 sm:p-8 md:p-10 lg:p-12 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto shadow-lg">
            <div className="bg-emerald-600/20 rounded-full w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6 border-2 border-emerald-500/40">
              <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black mb-2 sm:mb-3">
              No conversations yet
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-black/80 mb-4 sm:mb-5 md:mb-6 leading-relaxed px-2">
              Patient messages will appear here when they reach out to
              your pharmacy for support
            </p>
            <div className="bg-emerald-600/10 backdrop-blur-sm border border-emerald-500/50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="bg-emerald-600/30 rounded-full p-1.5 sm:p-2 mt-0.5">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-700 group-hover:text-emerald-800 transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-black text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">
                    Ready for Patient Engagement
                  </p>
                  <p className="text-black/70 text-xs leading-relaxed">
                    Patients can initiate conversations for
                    prescription inquiries, medication guidance, and
                    pharmacy support services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

          {selectedThread && (
            <PharmacyChatModal
              threadId={selectedThread}
              participantName={selectedParticipantName}
              onClose={() => setSelectedThread(null)}
            />
          )}

          {/* Health Records Modal */}
          {showHealthRecordsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9998]">
              <div
                className="max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide m-4 rounded-xl shadow-2xl"
                style={{
                  backgroundColor: "#0F4C47",
                  backgroundImage:
                    "linear-gradient(135deg, #0F4C47 0%, #115E59 100%)",
                }}
              >
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      Patient Health Records
                      {healthRecords?.patientName && (
                        <span className="text-teal-200 font-normal ml-2">
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
                      className="text-teal-300 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {loadingHealthRecords ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
                      <p className="ml-2 text-teal-200">
                        Loading health records...
                      </p>
                    </div>
                  ) : healthRecords ? (
                    <div className="space-y-6">
                      {/* Record Counts Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {healthRecords.recordCounts?.medicalHistory || 0}
                          </div>
                          <div className="text-sm text-blue-800">
                            Medical History
                          </div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {healthRecords.recordCounts?.allergies || 0}
                          </div>
                          <div className="text-sm text-red-800">Allergies</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {healthRecords.recordCounts?.currentMedications ||
                              0}
                          </div>
                          <div className="text-sm text-green-800">
                            Current Medications
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {healthRecords.recordCounts?.vitalSigns || 0}
                          </div>
                          <div className="text-sm text-purple-800">
                            Vital Signs
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {healthRecords.recordCounts?.emergencyContacts || 0}
                          </div>
                          <div className="text-sm text-orange-800">
                            Emergency Contacts
                          </div>
                        </div>
                      </div>
                      
                      {/* Debug Information */}
                      {console.log("🔍 [PHARMACY_DASHBOARD_MODAL] Rendering health records:", healthRecords)}
                      {console.log("🔍 [PHARMACY_DASHBOARD_MODAL] Medical History Array:", healthRecords.healthRecords?.medicalHistory)}
                      {console.log("🔍 [PHARMACY_DASHBOARD_MODAL] Allergies Array:", healthRecords.healthRecords?.allergies)}
                      {console.log("🔍 [PHARMACY_DASHBOARD_MODAL] Vital Signs Array:", healthRecords.healthRecords?.vitalSigns)}

                      {/* Medical History */}
                      {healthRecords.healthRecords?.medicalHistory &&
                        Array.isArray(
                          healthRecords.healthRecords.medicalHistory
                        ) &&
                        healthRecords.healthRecords.medicalHistory.length >
                          0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-teal-100 mb-3 flex items-center">
                              <FileText className="w-5 h-5 mr-2 text-teal-300" />
                              Medical History
                            </h4>
                            <div className="space-y-3">
                              {healthRecords.healthRecords.medicalHistory.map(
                                (record, index) => (
                                  <div
                                    key={record._id || index}
                                    className="bg-gradient-to-r from-teal-800/30 to-teal-700/30 backdrop-blur-sm border border-teal-400/30 p-4 rounded-lg"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Condition
                                        </p>
                                        <p className="font-medium text-teal-100">
                                          {String(record.condition || "N/A")}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Diagnosed Date
                                        </p>
                                        <p className="font-medium text-teal-100">
                                          {record.diagnosedDate
                                            ? new Date(
                                                record.diagnosedDate
                                              ).toLocaleDateString()
                                            : "N/A"}
                                        </p>
                                      </div>
                                      {record.treatment && (
                                        <div className="md:col-span-2">
                                          <p className="text-sm text-teal-300">
                                            Treatment
                                          </p>
                                          <p className="font-medium text-teal-100">
                                            {String(record.treatment)}
                                          </p>
                                        </div>
                                      )}
                                      {record.notes && (
                                        <div className="md:col-span-2">
                                          <p className="text-sm text-teal-300">
                                            Notes
                                          </p>
                                          <p className="font-medium text-teal-100">
                                            {String(record.notes)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Allergies */}
                      {healthRecords.healthRecords?.allergies &&
                        Array.isArray(healthRecords.healthRecords.allergies) &&
                        healthRecords.healthRecords.allergies.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-teal-100 mb-3 flex items-center">
                              <Heart className="w-5 h-5 mr-2 text-teal-300" />
                              Allergies
                            </h4>
                            <div className="space-y-3">
                              {healthRecords.healthRecords.allergies.map(
                                (record, index) => (
                                  <div
                                    key={record._id || index}
                                    className="bg-gradient-to-r from-teal-800/30 to-teal-700/30 backdrop-blur-sm border border-teal-400/30 p-4 rounded-lg"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Allergen
                                        </p>
                                        <p className="font-medium text-teal-100">
                                          {String(record.allergen || "N/A")}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Severity
                                        </p>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            record.severity === "mild"
                                              ? "bg-yellow-500/20 text-yellow-200 border border-yellow-400/30"
                                              : record.severity === "moderate"
                                              ? "bg-orange-500/20 text-orange-200 border border-orange-400/30"
                                              : "bg-red-500/20 text-red-200 border border-red-400/30"
                                          }`}
                                        >
                                          {String(record.severity || "unknown")}
                                        </span>
                                      </div>
                                      {record.reaction && (
                                        <div className="md:col-span-2">
                                          <p className="text-sm text-teal-300">
                                            Reaction
                                          </p>
                                          <p className="font-medium text-teal-100">
                                            {String(record.reaction)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Current Medications */}
                      {healthRecords.healthRecords?.currentMedications &&
                        Array.isArray(
                          healthRecords.healthRecords.currentMedications
                        ) &&
                        healthRecords.healthRecords.currentMedications.length >
                          0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-teal-100 mb-3 flex items-center">
                              <Pill className="w-5 h-5 mr-2 text-teal-300" />
                              Current Medications
                            </h4>
                            <div className="space-y-3">
                              {healthRecords.healthRecords.currentMedications.map(
                                (record, index) => (
                                  <div
                                    key={record._id || index}
                                    className="bg-gradient-to-r from-teal-800/30 to-teal-700/30 backdrop-blur-sm border border-teal-400/30 p-4 rounded-lg"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Medication
                                        </p>
                                        <p className="font-medium text-teal-100">
                                          {String(
                                            record.medication || record.medicationName || "N/A"
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Dosage
                                        </p>
                                        <p className="font-medium text-teal-100">
                                          {String(record.dosage || "N/A")}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-teal-300">
                                          Frequency
                                        </p>
                                        <p className="font-medium text-teal-100">
                                          {String(record.frequency || "N/A")}
                                        </p>
                                      </div>
                                      {record.prescribedBy && (
                                        <div>
                                          <p className="text-sm text-teal-300">
                                            Prescribed By
                                          </p>
                                          <p className="font-medium text-teal-100">
                                            {String(record.prescribedBy)}
                                          </p>
                                        </div>
                                      )}
                                      {record.startDate && (
                                        <div>
                                          <p className="text-sm text-teal-300">
                                            Start Date
                                          </p>
                                          <p className="font-medium text-teal-100">
                                            {new Date(
                                              record.startDate
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      )}
                                      {record.notes && (
                                        <div className="md:col-span-3">
                                          <p className="text-sm text-teal-300">
                                            Notes
                                          </p>
                                          <p className="font-medium text-teal-100">
                                            {String(record.notes)}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Vital Signs */}
                      {healthRecords.healthRecords?.vitalSigns &&
                        Array.isArray(healthRecords.healthRecords.vitalSigns) &&
                        healthRecords.healthRecords.vitalSigns.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-teal-100 mb-3 flex items-center">
                              <Activity className="w-5 h-5 mr-2 text-teal-300" />
                              Vital Signs
                            </h4>
                            <div className="space-y-3">
                              {healthRecords.healthRecords.vitalSigns.map(
                                (record, index) => (
                                  <div
                                    key={record._id || index}
                                    className="bg-gradient-to-r from-teal-800/30 to-teal-700/30 backdrop-blur-sm border border-teal-400/30 p-4 rounded-lg"
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <h5 className="font-medium text-teal-100">Vital Signs Record</h5>
                                      <span className="text-sm text-teal-300">
                                        {record.recordedAt ? new Date(record.recordedAt).toLocaleString() : 'Date not available'}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      {record.weight && (
                                        <div>
                                          <p className="text-sm text-teal-300">Weight</p>
                                          <p className="font-medium text-teal-100">{record.weight} kg</p>
                                        </div>
                                      )}
                                      {record.heartRate && (
                                        <div>
                                          <p className="text-sm text-teal-300">Heart Rate</p>
                                          <p className="font-medium text-teal-100">{record.heartRate} bpm</p>
                                        </div>
                                      )}
                                      {record.temperature && (
                                        <div>
                                          <p className="text-sm text-teal-300">Temperature</p>
                                          <p className="font-medium text-teal-100">{record.temperature}°F</p>
                                        </div>
                                      )}
                                      {record.bloodPressure && (
                                        <div>
                                          <p className="text-sm text-teal-300">Blood Pressure</p>
                                          <p className="font-medium text-teal-100">
                                            {typeof record.bloodPressure === 'object' 
                                              ? `${record.bloodPressure.systolic || record.bloodPressure}/${record.bloodPressure.diastolic || ''} mmHg`
                                              : `${record.bloodPressure} mmHg`
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                    {record.notes && (
                                      <p className="text-sm text-teal-200 mt-3">Notes: {record.notes}</p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Emergency Contacts */}
                      {healthRecords.healthRecords?.emergencyContacts &&
                        Array.isArray(healthRecords.healthRecords.emergencyContacts) &&
                        healthRecords.healthRecords.emergencyContacts.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-teal-100 mb-3 flex items-center">
                              <Phone className="w-5 h-5 mr-2 text-teal-300" />
                              Emergency Contacts
                            </h4>
                            <div className="space-y-3">
                              {healthRecords.healthRecords.emergencyContacts.map(
                                (contact, index) => (
                                  <div
                                    key={contact._id || index}
                                    className="bg-gradient-to-r from-teal-800/30 to-teal-700/30 backdrop-blur-sm border border-teal-400/30 p-4 rounded-lg"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-teal-100">{contact.name}</h5>
                                      <span className="text-sm text-teal-300">{contact.relationship}</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="text-teal-300">Phone:</p>
                                        <p className="font-medium text-teal-100">{contact.phone}</p>
                                      </div>
                                      {contact.email && (
                                        <div>
                                          <p className="text-teal-300">Email:</p>
                                          <p className="font-medium text-teal-100">{contact.email}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* No Records Message */}
                      {(!healthRecords.healthRecords ||
                        Object.values(healthRecords.healthRecords).every(
                          (records) => records.length === 0
                        )) && (
                        <div className="text-center py-8">
                          <User className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                          <p className="text-teal-200">
                            No health records shared yet
                          </p>
                          <p className="text-sm text-teal-300 mt-2">
                            Health records will appear here when the patient
                            shares them with your pharmacy after prescription
                            approval.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                      <p className="text-teal-200">
                        Failed to load health records
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Please try again or contact support if the problem
                        persists.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-teal-400/30 bg-gradient-to-r from-teal-900/40 to-teal-800/40 backdrop-blur-sm flex justify-end">
                  <button
                    onClick={() => {
                      setShowHealthRecordsModal(false);
                      setHealthRecords(null);
                      setSelectedPatientId(null);
                    }}
                    className="px-4 py-2 text-teal-200 border border-teal-400/50 rounded-lg hover:bg-teal-700/50 backdrop-blur-sm transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Patient Details Modal */}
          {showPatientDetailsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-t-xl">
                  <h3 className="text-xl font-semibold">
                    Patient & Prescription Details
                  </h3>
                  <button
                    onClick={() => {
                      setShowPatientDetailsModal(false);
                      setPatientDetails(null);
                      setSelectedPrescriptionDetails(null);
                    }}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {loadingPatientDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                      <span className="ml-2 text-gray-600">
                        Loading patient details...
                      </span>
                    </div>
                  ) : patientDetails ? (
                    <div className="space-y-6">
                      {/* Patient Information */}
                      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <User className="w-5 h-5 mr-2 text-teal-600" />
                          Patient Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="font-medium text-gray-900">
                              {patientDetails.firstName}{" "}
                              {patientDetails.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900 flex items-center">
                              <Mail className="w-4 h-4 mr-1 text-gray-500" />
                              {patientDetails.email}
                            </p>
                          </div>
                          {patientDetails.phone && (
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium text-gray-900 flex items-center">
                                <Phone className="w-4 h-4 mr-1 text-gray-500" />
                                {patientDetails.phone}
                              </p>
                            </div>
                          )}
                          {patientDetails.dateOfBirth && (
                            <div>
                              <p className="text-sm text-gray-600">
                                Date of Birth
                              </p>
                              <p className="font-medium text-gray-900 flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                {new Date(
                                  patientDetails.dateOfBirth
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {patientDetails.address && (
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-600">Address</p>
                              <p className="font-medium text-gray-900 flex items-start">
                                <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-0.5" />
                                {[
                                  patientDetails.address.street,
                                  patientDetails.address.city,
                                  patientDetails.address.state,
                                  patientDetails.address.zipCode,
                                  patientDetails.address.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Prescription Information */}
                      {selectedPrescriptionDetails && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" />
                            Prescription Details
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-600">
                                Description
                              </p>
                              <p className="font-medium text-gray-900">
                                {selectedPrescriptionDetails.description ||
                                  "No description provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Submitted Date
                              </p>
                              <p className="font-medium text-gray-900">
                                {new Date(
                                  selectedPrescriptionDetails.createdAt
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {selectedPrescriptionDetails.status}
                              </span>
                            </div>
                            {selectedPrescriptionDetails.originalFile && (
                              <div>
                                <p className="text-sm text-gray-600 mb-2">
                                  Prescription Image
                                </p>
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={
                                      selectedPrescriptionDetails.originalFile
                                        .secureUrl
                                    }
                                    alt="Prescription"
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                  />
                                  <a
                                    href={
                                      selectedPrescriptionDetails.originalFile
                                        .secureUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline flex items-center"
                                  >
                                    <FileText className="w-4 h-4 mr-1" />
                                    View Full Size
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Failed to load patient details
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowPatientDetailsModal(false);
                        setPatientDetails(null);
                        setSelectedPrescriptionDetails(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
