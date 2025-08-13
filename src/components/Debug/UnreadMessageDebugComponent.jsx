import React, { useState } from "react";
import unreadMessageService from "../../services/unreadMessageService";

const UnreadMessageDebugComponent = ({ currentUser, orderId }) => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const testFetchUnreadCounts = async () => {
    setLoading(true);
    try {
      console.log("🔍 Debug: Testing unread message fetch...");
      console.log("🔍 Debug: Current user:", currentUser);
      console.log("🔍 Debug: Order ID:", orderId);

      const result = await unreadMessageService.fetchUnreadCounts();
      console.log("🔍 Debug: Fetch result:", result);

      setDebugInfo({
        success: true,
        result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("🔍 Debug: Error fetching unread counts:", error);
      setDebugInfo({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Unread Messages Debug</h3>
      <div className="space-y-2 text-xs">
        <div>
          <strong>User:</strong> {currentUser?.role} ({currentUser?.id})
        </div>
        <div>
          <strong>Order ID:</strong> {orderId}
        </div>
        <button
          onClick={testFetchUnreadCounts}
          disabled={loading}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Fetch Unread"}
        </button>
        {debugInfo.timestamp && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div>
              <strong>Time:</strong> {debugInfo.timestamp}
            </div>
            <div>
              <strong>Success:</strong> {debugInfo.success ? "✅" : "❌"}
            </div>
            {debugInfo.success ? (
              <div>
                <strong>Result:</strong>{" "}
                {JSON.stringify(debugInfo.result, null, 2)}
              </div>
            ) : (
              <div>
                <strong>Error:</strong> {debugInfo.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnreadMessageDebugComponent;
