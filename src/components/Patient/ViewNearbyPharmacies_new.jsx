import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Clock, Star, Eye, Navigation, Activity, Shield, TrendingUp } from "lucide-react";

const containerStyle = { width: "100%", height: "450px" };

const ViewNearbyPharmacies = ({ onChat, sidebarOpen }) => {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lng: coords.longitude };
        console.log("User location:", loc);
        setLocation(loc);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    console.log("Fetching nearby pharmacies for location:", location);
    setLoading(true);
    setError(null);
    axiosInstance
      .get(`/pharmacies/nearby?lat=${location.lat}&lng=${location.lng}`)
      .then((res) => {
        console.log("Nearby pharmacies API response:", res);
        setPharmacies(res.data.data);
        console.log("Pharmacies data set:", res.data.data);
      })
      .catch((err) => {
        console.error("Fetch pharmacies error:", err);
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, [location]);

  const formatAddress = (addr) => {
    if (!addr) return "";
    const { street, city, state, zipCode, country } = addr;
    return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
  };

  const handleViewDetails = (id) => {
    navigate(`/patient/pharmacies/${id}`);
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}
    >
      {/* Enhanced Statistics Section */}
      <div className="bg-white shadow-lg p-4 sm:p-6 lg:p-8">
        <div className="max-w-full mx-auto">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
              Pharmacy Network Statistics
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Your local pharmacy network at a glance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Total Pharmacies */}
            <div className="bg-[#CAE7E1] rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#256C5C] bg-opacity-20 rounded-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: '#256C5C' }} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {pharmacies.length || 0}
                </div>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Nearby Pharmacies
              </p>
              <p className="text-xs sm:text-sm text-gray-700">Within 50km radius</p>
            </div>

            {/* Average Distance */}
            <div className="bg-[#CAE7E1] rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#256C5C] bg-opacity-20 rounded-lg">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: '#256C5C' }} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {pharmacies.length > 0
                    ? (
                        pharmacies.reduce((sum, ph) => sum + ph.distance, 0) /
                        pharmacies.length
                      ).toFixed(1)
                    : "0.0"}
                  <span className="text-xs sm:text-sm font-normal text-gray-700 ml-1">km</span>
                </div>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Average Distance
              </p>
              <p className="text-xs sm:text-sm text-gray-700">In kilometers</p>
            </div>

            {/* 24/7 Available */}
            <div className="bg-[#CAE7E1] rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#256C5C] bg-opacity-20 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: '#256C5C' }} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {Math.floor(pharmacies.length * 0.7) || 0}
                </div>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                24/7 Available
              </p>
              <p className="text-xs sm:text-sm text-gray-700">Always open</p>
            </div>

            {/* High Rated */}
            <div className="bg-[#CAE7E1] rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 bg-[#256C5C] bg-opacity-20 rounded-lg">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: '#256C5C' }} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {Math.floor(pharmacies.length * 0.85) || 0}
                </div>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                High Rated (4.5+)
              </p>
              <p className="text-xs sm:text-sm text-gray-700">Customer favorites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-3 sm:p-4 lg:p-6">
        {/* Enhanced Map Section */}
        {location && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-[#256C5C] bg-opacity-10 rounded-xl w-fit">
                <Navigation className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#256C5C]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Map View</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Interactive pharmacy locations</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
              <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                <div style={{ 
                  width: "100%", 
                  height: window.innerWidth < 640 ? "300px" : window.innerWidth < 1024 ? "400px" : "450px"
                }}>
                  <GoogleMap
                    mapContainerStyle={{ 
                      width: "100%", 
                      height: window.innerWidth < 640 ? "300px" : window.innerWidth < 1024 ? "400px" : "450px"
                    }}
                    center={location}
                    zoom={window.innerWidth < 640 ? 11 : 12}
                    options={{
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                      mapTypeControl: false,
                      streetViewControl: false,
                      zoomControl: window.innerWidth >= 640,
                      fullscreenControl: window.innerWidth >= 640,
                    }}
                  >
                    <Marker
                      position={location}
                      label="You"
                      icon={{
                        url:
                          "data:image/svg+xml;charset=UTF-8," +
                          encodeURIComponent(`
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15" cy="15" r="15" fill="#256C5C"/>
                            <circle cx="15" cy="15" r="8" fill="#ffffff"/>
                          </svg>
                        `),
                        scaledSize: new window.google.maps.Size(
                          window.innerWidth < 640 ? 25 : 30, 
                          window.innerWidth < 640 ? 25 : 30
                        ),
                      }}
                    />
                    {pharmacies.map((ph) => (
                      <Marker
                        key={ph._id}
                        position={{
                          lat: ph.location.coordinates[1],
                          lng: ph.location.coordinates[0],
                        }}
                        title={ph.name}
                        icon={{
                          url:
                            "data:image/svg+xml;charset=UTF-8," +
                            encodeURIComponent(`
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="15" cy="15" r="15" fill="#256C5C"/>
                              <path d="M15 8V22M8 15H22" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(
                            window.innerWidth < 640 ? 25 : 30, 
                            window.innerWidth < 640 ? 25 : 30
                          ),
                        }}
                      />
                    ))}
                  </GoogleMap>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#256C5C] rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#256C5C] rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-700">Pharmacies</span>
                  </div>
                </div>
                <button className="text-xs sm:text-sm text-[#256C5C] font-medium hover:underline text-left sm:text-right">
                  Fullscreen Map →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nearby Pharmacies Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mb-6 sm:mb-8">
            <div className="p-3 sm:p-4 bg-[#256C5C] bg-opacity-10 rounded-xl w-fit">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#256C5C]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                Nearby Pharmacies
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Find and connect with pharmacies in your area
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-red-800 font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="bg-gray-50 rounded-xl p-8 sm:p-10 lg:p-12">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#256C5C] border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Finding pharmacies near you...</p>
                </div>
              </div>
            </div>
          )}

          {!loading && pharmacies.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {pharmacies.map((ph) => (
                <div
                  key={ph._id}
                  className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {ph.name}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < 4 ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-700">
                          4.8 (124 reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#256C5C] text-white rounded-lg text-xs sm:text-sm font-medium w-fit">
                      <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                      {ph.distance.toFixed(1)} km
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg flex-shrink-0">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 leading-relaxed flex-1">
                        {formatAddress(ph.address)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700">
                        Open 24/7 • Accepts Insurance
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#256C5C]" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700">
                        +1 (555) 123-4567
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewDetails(ph._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#256C5C] text-white rounded-lg hover:bg-[#1e5648] transition-colors duration-200 font-medium shadow-sm hover:shadow-md text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNearbyPharmacies;