import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Globe,
  FileText,
  ShoppingCart,
  ArrowLeft,
  User,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Navigation,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const PharmacyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pharmacy, setPharmacy] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Search and filter states for advanced product search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterForm, setFilterForm] = useState("");

  // Get prescription info from state if available
  const prescriptionInfo = location.state?.prescriptionInfo || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, invRes] = await Promise.all([
          axiosInstance.get(`/pharmacies/${id}/details`),
          axiosInstance.get(`/pharmacies/${id}/inventory`),
        ]);

        console.log("Pharmacy details response:", detailRes.data.data);
        console.log(
          "Pharmacy approval status:",
          detailRes.data.data.approvalStatus
        );

        setPharmacy(detailRes.data.data);
        setInventory(invRes.data.data);
      } catch (err) {
        console.error("Error fetching pharmacy page data:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Filter inventory based on search and form filter
  const filteredInventory = inventory.filter(
    (item) =>
      item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterForm ? item.dosageForm === filterForm : true)
  );

  const handlePlaceOrder = async () => {
    if (prescriptionInfo?.prescriptionId) {
      try {
        const res = await axiosInstance.patch(
          `/prescriptions/${prescriptionInfo.prescriptionId}/select-pharmacy`,
          {
            pharmacyId: id,
          }
        );

        if (res.data.success) {
          alert(
            "Order placed successfully! You will be redirected to your dashboard."
          );
          navigate("/patient/dashboard");
        } else {
          throw new Error(res.data.message || "Failed to place order");
        }
      } catch (err) {
        console.error("Failed to place order:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again.";
        alert(errorMessage);
      }
    } else {
      alert(
        "No prescription information available for ordering. Please go back and select this pharmacy from the prescription approval page."
      );
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Address not available";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getCurrentDayStatus = () => {
    if (!pharmacy?.operatingHours) return null;

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const currentDay = days[new Date().getDay()];
    const currentTime = new Date().toTimeString().slice(0, 5);
    const todayHours = pharmacy.operatingHours[currentDay];

    if (todayHours?.closed) {
      return { isOpen: false, status: "Closed today" };
    }

    const isOpen =
      currentTime >= todayHours?.open && currentTime <= todayHours?.close;
    return {
      isOpen,
      status: isOpen
        ? `Open until ${todayHours.close}`
        : `Closed • Opens at ${todayHours?.open || "N/A"}`,
    };
  };

  // Distance calculation function (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#256C5C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CAE7E1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#CAE7E1]">Loading pharmacy details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#256C5C] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const dayStatus = getCurrentDayStatus();

  return (
    <div className="min-h-screen bg-[#256C5C]">
      {/* Header with back button */}
      <div className="bg-[#256C5C] border-b border-[#CAE7E1]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-3 bg-black text-white px-3 py-1 rounded-md shadow-md hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold">Back</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pharmacy Header */}
            <div className="bg-[#CAE7E1] border border-[#256C5C]/30 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-black mb-5">
                    {pharmacy.pharmacyName}
                  </h1>

                  {/* Pharmacist Information */}
                  {pharmacy.registeredPharmacist && (
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <User className="w-4 h-4 text-[#CAE7E1]" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Pharmacist &nbsp; </span>{" "}
                        <span className="bg-[#256C5C]/20 px-2 py-1 rounded-lg text-black">
                          {pharmacy.registeredPharmacist}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* License Information */}
                  {pharmacy.licenseNumber && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <Shield className="w-4 h-4 text-[#CAE7E1]" />
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">License</span>{" "}
                        <span className="bg-[#256C5C]/20 px-2 py-1 rounded-lg text-black">
                          {pharmacy.licenseNumber}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Approval Status */}
                  {pharmacy.approvalStatus && (
                    <div className="flex items-center space-x-2 mb-3">
                      {pharmacy.approvalStatus === "approved" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          pharmacy.approvalStatus === "approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {pharmacy.approvalStatus === "approved"
                          ? "Verified Pharmacy"
                          : `Status: ${pharmacy.approvalStatus}`}
                      </span>
                    </div>
                  )}

                  {/* Fallback message if no approval status */}
                  {!pharmacy.approvalStatus && (
                    <div className="flex items-center space-x-2 mb-3">
                      <XCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-600">
                        Verification status unavailable
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-sm">
                    {dayStatus && (
                      <div
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                          dayStatus.isOpen
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span>{dayStatus.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {prescriptionInfo && (
                  <button
                    onClick={handlePlaceOrder}
                    className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Place Order</span>
                  </button>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#256C5C]/20">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-[#256C5C] mt-1">
                    <MapPin className="w-4 h-4 text-[#CAE7E1]" />
                  </div>
                  <div>
                    <p className="font-medium text-black">Address</p>
                    <p className="text-gray-700 text-sm">
                      {formatAddress(pharmacy.address)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {pharmacy.contactInfo?.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <Phone className="w-4 h-4 text-[#CAE7E1]" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Phone</p>
                        <p className="text-gray-700 text-sm">
                          {pharmacy.contactInfo.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {pharmacy.contactInfo?.email && (
                    <div className="flex items-center space-x-3">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <Mail className="w-4 h-4 text-[#CAE7E1]" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Email</p>
                        <p className="text-gray-700 text-sm">
                          {pharmacy.contactInfo.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {pharmacy.contactInfo?.website && (
                    <div className="flex items-center space-x-3">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <Globe className="w-4 h-4 text-[#CAE7E1]" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Website</p>
                        <a
                          href={pharmacy.contactInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {pharmacy.contactInfo.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-[#CAE7E1] border border-[#256C5C]/30 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-black mb-4">
                Location & Directions
              </h2>
              {pharmacy.location?.coordinates ? (
                <div className="space-y-4">
                  {/* Location Display */}
                  <div className="bg-white border border-[#256C5C]/20 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#256C5C] p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-[#CAE7E1]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-1">
                          {pharmacy.pharmacyName}
                        </h3>
                        <p className="text-gray-700 text-sm mb-3">
                          {formatAddress(pharmacy.address)}
                        </p>

                        {/* Coordinates Display */}
                        <div className="mb-4">
                          <div className="flex gap-2 text-sm">
                            <div className="bg-[#256C5C]/10 p-3 border border-[#256C5C]/20 rounded-xl">
                              <span className="font-medium text-black">
                                Latitude :
                              </span>
                              <span className="ml-2 text-gray-700 font-mono">
                                {pharmacy.location.coordinates[1].toFixed(6)}
                              </span>
                            </div>
                            <div className="bg-[#256C5C]/10 p-3 border border-[#256C5C]/20 rounded-xl">
                              <span className="font-medium text-black">
                                Longitude :
                              </span>
                              <span className="ml-2 text-gray-700 font-mono">
                                {pharmacy.location.coordinates[0].toFixed(6)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`https://www.google.com/maps?q=${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Open in Google Maps
                          </a>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </a>

                          <button
                            onClick={() => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    const distance = calculateDistance(
                                      position.coords.latitude,
                                      position.coords.longitude,
                                      pharmacy.location.coordinates[1],
                                      pharmacy.location.coordinates[0]
                                    );
                                    alert(
                                      `Distance from your location: ${distance.toFixed(
                                        2
                                      )} km`
                                    );
                                  },
                                  () => {
                                    alert("Unable to get your location");
                                  }
                                );
                              } else {
                                alert(
                                  "Geolocation is not supported by this browser"
                                );
                              }
                            }}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Calculate Distance
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Embedded Map Alternative - Simple iframe */}
                  <div className="rounded-lg overflow-hidden border border-[#256C5C]/30">
                    <iframe
                      width="100%"
                      height="300"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = e.target.nextSibling;
                        if (fallback) {
                          fallback.className = fallback.className.replace('hidden', 'flex');
                        }
                      }}
                    ></iframe>

                    {/* Fallback if iframe fails */}
                    <div className="hidden bg-gray-100 h-[300px] items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2" />
                        <p>Map unavailable</p>
                        <p className="text-sm">
                          Use the buttons above for navigation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                  <p className="text-black">Location information not available</p>
                  <p className="text-sm text-gray-600">
                    Please contact the pharmacy for directions
                  </p>
                </div>
              )}
            </div>

            {/* Products/Inventory */}
            <div className="bg-[#CAE7E1] border border-[#256C5C]/30 rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black">
                  Available Products
                </h2>
                <span className="text-sm text-gray-700">
                  {filteredInventory.length} of {inventory.length} products
                </span>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C]"
                />
                <select
                  value={filterForm}
                  onChange={(e) => setFilterForm(e.target.value)}
                  className="px-4 py-2 bg-white border border-[#256C5C]/30 rounded-lg focus:ring-2 focus:ring-[#256C5C] focus:border-[#256C5C] md:w-48 text-black"
                >
                  <option value="">All Forms</option>
                  {Array.from(new Set(inventory.map((i) => i.dosageForm))).map(
                    (form) => (
                      <option key={form} value={form}>
                        {form}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Products Grid */}
              {filteredInventory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInventory.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-[#256C5C]/20 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-black">
                          {item.medicineName}{" "}
                          {item.brandName && `(${item.brandName})`}
                        </h3>
                        <span className="text-lg font-bold text-green-600">
                          ₹{item.pricePerUnit}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>Dosage :</strong> {item.strength} (
                        {item.dosageForm})
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <strong>Available :</strong> {item.quantityAvailable}{" "}
                        units
                      </p>
                      <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No products found matching your search criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pharmacy Details */}
            <div className="bg-[#CAE7E1] border border-[#256C5C]/30 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Pharmacy Information
              </h3>
              <div className="space-y-4">
                <div className="border-b border-[#256C5C]/20 pb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1 rounded-full bg-[#256C5C]">
                      <User className="w-3 h-3 text-[#CAE7E1]" />
                    </div>
                    <span className="font-medium text-black">
                      Registered Pharmacist
                    </span>
                  </div>
                  <p className="text-gray-700 text-base ml-6">
                    {pharmacy.registeredPharmacist || "Not specified"}
                  </p>
                </div>

                <div className="border-b border-[#256C5C]/20 pb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1 rounded-full bg-[#256C5C]">
                      <Shield className="w-3 h-3 text-[#CAE7E1]" />
                    </div>
                    <span className="font-medium text-black">
                      License Number
                    </span>
                  </div>
                  <p className="text-gray-700 ml-6 font-mono text-sm">
                    {pharmacy.licenseNumber || "Not provided"}
                  </p>
                </div>

                <div className="border-b border-[#256C5C]/20 pb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1 rounded-full bg-[#256C5C]">
                      <FileText className="w-3 h-3 text-[#CAE7E1]" />
                    </div>
                    <span className="font-medium text-black">
                      Pharmacy Type
                    </span>
                  </div>
                  <p className="text-gray-700 ml-6 capitalize text-base">
                    {pharmacy.typeOfPharmacy
                      ? pharmacy.typeOfPharmacy.replace("_", " ")
                      : "Not specified"}
                  </p>
                </div>

                <div className="border-b border-[#256C5C]/20 pb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {pharmacy.approvalStatus === "approved" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium text-black">
                      Verification Status
                    </span>
                  </div>
                  <div className="ml-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pharmacy.approvalStatus === "approved"
                          ? "bg-green-100 text-green-800"
                          : pharmacy.approvalStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pharmacy.approvalStatus === "approved"
                        ? "Verified"
                        : pharmacy.approvalStatus || "Unknown"}
                    </span>
                    {pharmacy.approvedAt &&
                      pharmacy.approvalStatus === "approved" && (
                        <p className="text-sm font-semibold text-gray-600 mt-1">
                          Verified on{" "}
                          {new Date(pharmacy.approvedAt).toLocaleDateString()}
                        </p>
                      )}
                    {pharmacy.approvalStatus === "pending" && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Pending admin approval
                      </p>
                    )}
                  </div>
                </div>

                {pharmacy.contactInfo?.fax && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <Phone className="w-3 h-3 text-[#CAE7E1]" />
                      </div>
                      <span className="font-medium text-black">Fax</span>
                    </div>
                    <p className="text-gray-700 ml-6">
                      {pharmacy.contactInfo.fax}
                    </p>
                  </div>
                )}

                {pharmacy.createdAt && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 rounded-full bg-[#256C5C]">
                        <Calendar className="w-3 h-3 text-[#CAE7E1]" />
                      </div>
                      <span className="font-medium text-black">
                        Established
                      </span>
                    </div>
                    <p className="text-gray-700 text-base ml-6">
                      Member since{" "}
                      {new Date(pharmacy.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#CAE7E1] border border-[#256C5C]/30 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Operating Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(pharmacy.operatingHours || {}).map(
                  ([day, hours]) => {
                    const isToday =
                      new Date().getDay() ===
                      [
                        "sunday",
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                      ].indexOf(day);
                    return (
                      <div
                        key={day}
                        className={`flex justify-between text-sm p-2 rounded ${
                          isToday
                            ? "bg-[#256C5C]/20 border border-[#256C5C]/30"
                            : ""
                        }`}
                      >
                        <span
                          className={`font-medium capitalize ${
                            isToday ? "text-[#256C5C]" : "text-gray-700"
                          }`}
                        >
                          {day}
                          {isToday && (
                            <span className="ml-1 text-xs">(Today)</span>
                          )}
                        </span>
                        <span
                          className={`${
                            hours.closed
                              ? "text-red-600 font-medium"
                              : isToday
                              ? "text-[#256C5C] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {hours.closed
                            ? "Closed"
                            : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Services */}
            {pharmacy.services && pharmacy.services.length > 0 && (
              <div className="bg-[#CAE7E1] border border-[#256C5C]/30 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-black mb-4">
                  Services
                </h3>
                <div className="space-y-2">
                  {pharmacy.services.map((service, idx) => (
                    <div key={idx} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-[#256C5C] rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="font-medium text-black">
                          {service.name.replace(/_/g, " ")}
                        </p>
                        {service.description && (
                          <p className="text-sm text-gray-600">
                            {service.description}
                          </p>
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
    </div>
  );
};

export default PharmacyPage;