import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import getStatusColor from "../../utils/getStatusColor";
import { MapPin } from "lucide-react";

const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/patients/pharmacies/nearby")
      .then((res) => {
        console.log(res);
        setPharmacies(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading nearby pharmacies...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nearby Pharmacies</h2>
      <div className="divide-y divide-gray-200">
        {pharmacies.map((pharmacy) => (
          <div
            key={pharmacy._id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  {pharmacy.pharmacyName}
                </p>
                <p className="text-sm text-gray-500">
                  {pharmacy.address.city}, {pharmacy.address.state}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                pharmacy.isCurrentlyOpen
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {pharmacy.isCurrentlyOpen ? "Open" : "Closed"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPharmacies;
