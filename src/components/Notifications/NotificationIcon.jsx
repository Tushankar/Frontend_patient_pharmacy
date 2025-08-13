import React, { useState } from "react";
import {
  Bell,
  MessageCircle,
  FileCheck,
  Package,
  X,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";

const NotificationIcon = ({
  totalCount = 0,
  chatCount = 0,
  approvalCount = 0,
  orderStatusCount = 0,
  chatUnreadCounts = {},
  approvalNotifications = {},
  orderStatusNotifications = {},
  onChatClick,
  onApprovalClick,
  onOrderStatusClick,
  onMarkAsRead,
  className = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Format date/time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    if (onMarkAsRead) {
      await onMarkAsRead();
    }
    setShowDropdown(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg animate-pulse">
            {totalCount > 99 ? "99+" : totalCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <button
              onClick={() => setShowDropdown(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notification Content */}
          <div className="max-h-96 overflow-y-auto">
            {totalCount === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Chat Notifications - Detailed */}
                {Object.entries(chatUnreadCounts).map(([orderId, chatData]) => (
                  <div
                    key={`chat-${orderId}`}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      onChatClick && onChatClick(orderId);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <MessageCircle className="w-8 h-8 text-blue-500" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {chatData.count || 0}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            New Chat Messages
                          </p>
                          <span className="text-xs text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {chatData.lastMessage
                              ? formatTime(chatData.lastMessage.createdAt)
                              : "Now"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Order #{orderId.slice(-6)} - {chatData.count} unread
                          message{chatData.count !== 1 ? "s" : ""}
                        </p>
                        {chatData.lastMessage && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            "{chatData.lastMessage.content}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Approval Notifications - Detailed */}
                {Object.entries(approvalNotifications).map(
                  ([prescriptionId, approval]) => (
                    <div
                      key={`approval-${prescriptionId}`}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        onApprovalClick && onApprovalClick(prescriptionId);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <FileCheck className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              Prescription Approval
                            </p>
                            <span className="text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {approval.createdAt
                                ? formatTime(approval.createdAt)
                                : "Now"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            <User className="w-3 h-3 inline mr-1" />
                            Patient: {approval.patientName || "Unknown"}
                          </p>
                          {approval.doctorName && (
                            <p className="text-xs text-gray-500 mt-1">
                              Doctor: {approval.doctorName}
                            </p>
                          )}
                          <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Order Status Notifications - Detailed */}
                {Object.entries(orderStatusNotifications).map(
                  ([orderId, orderData]) => (
                    <div
                      key={`order-${orderId}`}
                      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        onOrderStatusClick && onOrderStatusClick(orderId);
                        setShowDropdown(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Package className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              Order Status Update
                            </p>
                            <span className="text-xs text-gray-500">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {orderData.updatedAt
                                ? formatTime(orderData.updatedAt)
                                : "Now"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Order #{orderData.orderNumber || orderId.slice(-6)}
                          </p>
                          {orderData.pharmacyName && (
                            <p className="text-xs text-gray-500 mt-1">
                              From: {orderData.pharmacyName}
                            </p>
                          )}
                          <span
                            className={`inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium ${
                              orderData.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : orderData.status === "ready"
                                ? "bg-blue-100 text-blue-800"
                                : orderData.status === "preparing"
                                ? "bg-yellow-100 text-yellow-800"
                                : orderData.status === "confirmed"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {orderData.status
                              ? orderData.status.charAt(0).toUpperCase() +
                                orderData.status.slice(1)
                              : "Updated"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {totalCount > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded transition-colors"
              >
                Mark All as Read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
