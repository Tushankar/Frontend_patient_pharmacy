import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(
    initialLocation || { lat: 22.9734, lng: 88.4331 } // Default: Bankra, West Bengal
  );
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(newLocation);
    onLocationSelect(newLocation);

    // Reverse geocode to get address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: newLocation }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMarker(newLocation);
        setAddress(place.formatted_address || "");
        onLocationSelect(newLocation);

        if (map) {
          map.panTo(newLocation);
          map.setZoom(17);
        }
      }
    }
  };

  const onAutocompleteLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarker(newLocation);
          onLocationSelect(newLocation);
          if (map) {
            map.panTo(newLocation);
            map.setZoom(17);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please select manually.");
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "rgba(219, 245, 240, 0.6)" }}
              />
              <input
                type="text"
                placeholder="Search for your pharmacy location..."
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300 bg-transparent placeholder-gray-300"
                style={{
                  backgroundColor: "rgba(17, 94, 89, 0.3)",
                  color: "#DBF5F0",
                  borderColor: "#115E59",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#FDE047")}
                onBlur={(e) => (e.target.style.borderColor = "#115E59")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </Autocomplete>
        </div>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold"
          style={{
            backgroundColor: "#FDE047",
            color: "#115E59",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#FACC15";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#FDE047";
            e.target.style.transform = "translateY(0)";
          }}
        >
          <MapPin className="w-5 h-5" />
          Use Current Location
        </button>
      </div>

      <div
        className="border-2 rounded-lg overflow-hidden"
        style={{ borderColor: "#115E59" }}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={marker}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <Marker position={marker} />
        </GoogleMap>
      </div>

      <div
        className="border rounded-lg p-3"
        style={{
          backgroundColor: "rgba(17, 94, 89, 0.2)",
          borderColor: "#115E59",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#DBF5F0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <strong style={{ color: "#FDE047" }}>Selected Location:</strong>{" "}
          {address || "Click on the map to select location"}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(219, 245, 240, 0.8)",
            marginTop: "4px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Coordinates: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
