import React from "react";

const DebugUnreadMessages = () => {
  const testEndpoint = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token exists:", !!token);

      if (!token) {
        console.log("No token found - user may not be logged in");
        return;
      }

      // Test the endpoint directly
      const response = await fetch("/api/v1/chat/unread-counts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const data = await response.text();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("✅ Endpoint is working!");
      } else {
        console.log("❌ Endpoint failed");
      }
    } catch (error) {
      console.error("Test error:", error);
    }
  };

  return (
    <div className="p-4 bg-yellow-100 rounded-lg">
      <h3 className="font-bold mb-2">Debug Unread Messages</h3>
      <button
        onClick={testEndpoint}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Unread Counts Endpoint
      </button>
    </div>
  );
};

export default DebugUnreadMessages;
