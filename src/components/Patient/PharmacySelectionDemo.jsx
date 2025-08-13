import React, { useState } from "react";
import { ShoppingCart, ChevronDown, MapPin, Phone, Check } from "lucide-react";

// Demo component to show pharmacy selection dropdown functionality
const PharmacySelectionDemo = () => {
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Sample approved pharmacies data
  const approvedPharmacies = [
    {
      id: "1",
      name: "Apollo Pharmacy - MG Road",
      phone: "+91 80 2558 1234",
      address: { city: "Bangalore", state: "Karnataka" },
      distance: "2.3 km",
    },
    {
      id: "2",
      name: "MedPlus Health Services",
      phone: "+91 80 2669 5678",
      address: { city: "Bangalore", state: "Karnataka" },
      distance: "3.1 km",
    },
    {
      id: "3",
      name: "1mg Pharmacy",
      phone: "+91 80 4567 8901",
      address: { city: "Bangalore", state: "Karnataka" },
      distance: "1.8 km",
    },
  ];

  const handlePlaceOrder = () => {
    if (selectedPharmacy) {
      setOrderPlaced(true);
      console.log("Order placed with pharmacy:", selectedPharmacy);
    }
  };

  const selectedPharmacyData = approvedPharmacies.find(
    (p) => p.id === selectedPharmacy
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Prescription Order - Pharmacy Selection
      </h2>

      {!orderPlaced ? (
        <>
          {/* Pharmacy Selection Dropdown */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">
                Select Pharmacy to Place Order
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <select
                  value={selectedPharmacy}
                  onChange={(e) => setSelectedPharmacy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="">Choose your preferred pharmacy...</option>
                  {approvedPharmacies.map((pharmacy) => (
                    <option key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name} - {pharmacy.phone} ({pharmacy.distance})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedPharmacy}
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedPharmacy
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Place Order</span>
              </button>
            </div>

            <p className="text-sm text-blue-700 mt-3">
              {approvedPharmacies.length} pharmacies have approved your
              prescription.
            </p>
          </div>

          {/* Selected Pharmacy Preview */}
          {selectedPharmacy && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Selected Pharmacy Details:
              </h4>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  {selectedPharmacyData.name}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{selectedPharmacyData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {selectedPharmacyData.address.city},{" "}
                      {selectedPharmacyData.address.state}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Distance: {selectedPharmacyData.distance}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Order Confirmation */
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Order Placed Successfully!
          </h3>
          <p className="text-sm text-green-700 mb-4">
            Your prescription order has been placed with{" "}
            <strong>{selectedPharmacyData.name}</strong>
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
            <div className="flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>{selectedPharmacyData.phone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{selectedPharmacyData.address.city}</span>
            </div>
          </div>
          <button
            onClick={() => setOrderPlaced(false)}
            className="mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
          >
            Reset Demo
          </button>
        </div>
      )}

      {/* Pharmacy List */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-700">
          All Approved Pharmacies:
        </h4>
        {approvedPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className="p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">{pharmacy.name}</h5>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {pharmacy.address.city}, {pharmacy.address.state}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{pharmacy.distance}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacySelectionDemo;
