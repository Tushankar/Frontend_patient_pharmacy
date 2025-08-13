import React from "react";
import { MessageCircle, Bell } from "lucide-react";

const ChatButtonWithNotification = ({
  onClick,
  unreadCount = 0,
  className = "",
  orderId,
}) => {
  // Debug logging
  console.log("ChatButtonWithNotification props:", { orderId, unreadCount });

  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl hover:bg-indigo-100 transition-all duration-200 flex items-center gap-2 ${className}`}
      style={{ zIndex: 999990 }}
    >
      <MessageCircle className="w-4 h-4" />
      Chat
      {/* Bell icon with notification count */}
      {unreadCount > 0 && (
        <div className="relative" style={{ zIndex: 999991 }}>
          <Bell className="w-4 h-4 text-red-500 animate-pulse" />
          <span
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg"
            style={{ zIndex: 999992 }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </div>
      )}
    </button>
  );
};

export default ChatButtonWithNotification;
