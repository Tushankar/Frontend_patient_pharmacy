import React from "react";
import { MapPin } from "lucide-react";

const LocationMap = ({ location }) => {
  if (!location || !location.coordinates || location.coordinates[0] === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No location data available</p>
      </div>
    );
  }

  const lat = location.coordinates[1];
  const lng = location.coordinates[0];

  // Using Google Maps Embed API
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div
      className="relative rounded-lg overflow-hidden border border-gray-200"
      style={{ height: "300px" }}
    >
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default LocationMap;
