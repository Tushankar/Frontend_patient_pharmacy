import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const PharmacyDetailsModal = ({ pharmacyId, onClose }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `/pharmacies/${pharmacyId}/details`
        );
        setDetails(res.data.data);
      } catch (err) {
        console.error("Error fetching pharmacy details:", err);
      }
    };
    fetchDetails();
  }, [pharmacyId]);

  if (!details) return null;

  const {
    pharmacyName,
    address,
    contactInfo,
    operatingHours,
    services,
    rating,
    reviewCount,
    isCurrentlyOpen,
    nextOpeningTime,
  } = details;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{pharmacyName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            X
          </button>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Address:</strong> {address.street}, {address.city},{" "}
            {address.state} {address.zipCode}, {address.country}
          </p>
          <p>
            <strong>Phone:</strong> {contactInfo.phone}
          </p>
          <p>
            <strong>Email:</strong> {contactInfo.email}
          </p>
          {contactInfo.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactInfo.website}
              </a>
            </p>
          )}
          <p>
            <strong>Open Now:</strong> {isCurrentlyOpen ? "Yes" : "No"}
          </p>
          {nextOpeningTime && (
            <p>
              <strong>Next Opening:</strong> {nextOpeningTime.day} at{" "}
              {nextOpeningTime.time}
            </p>
          )}
          <p>
            <strong>Services:</strong> {services.map((s) => s.name).join(", ")}
          </p>
          {rating && (
            <p>
              <strong>Rating:</strong> {rating} ({reviewCount} reviews)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsModal;
