import React from "react";
import { useNotification } from "../contexts/NotificationContext";
import { MessageCircle, Bell } from "lucide-react";

const NotificationTestButton = () => {
  const { addNotification, addChatNotification } = useNotification();

  const testGeneralNotification = () => {
    addNotification({
      type: "info",
      title: "Test Notification",
      message: "This is a test notification to verify the system works!",
      icon: Bell,
      color: "bg-green-500",
    });
  };

  const testChatNotification = () => {
    addChatNotification(
      "Hello! This is a test chat message notification.",
      "ORD123456",
      "Test Pharmacy",
      "test-order-id"
    );
  };

  return (
    <div className="fixed bottom-4 left-4 space-y-2 z-40">
      <button
        onClick={testGeneralNotification}
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2"
      >
        <Bell className="w-4 h-4" />
        Test General Notification
      </button>
      <button
        onClick={testChatNotification}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Test Chat Notification
      </button>
    </div>
  );
};

export default NotificationTestButton;
