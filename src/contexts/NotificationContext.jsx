import React, { createContext, useContext, useState, useEffect } from "react";
import { Bell, MessageCircle, X } from "lucide-react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification,
    };

    console.log("Adding notification:", newNotification);
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after 5 seconds unless it's persistent
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    console.log("Removing notification:", id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addChatNotification = (message, orderNumber, senderName, orderId) => {
    addNotification({
      type: "chat",
      title: `New message from ${senderName}`,
      message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      orderNumber,
      orderId,
      icon: MessageCircle,
      color: "bg-blue-500",
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        addChatNotification,
      }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = ({ notifications, removeNotification }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onRemove }) => {
  const IconComponent = notification.icon || Bell;

  return (
    <div
      className={`${
        notification.color || "bg-gray-800"
      } text-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out animate-slide-in-right`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconComponent className="w-5 h-5 mt-0.5" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium">{notification.title}</div>
          {notification.message && (
            <div className="text-sm opacity-90 mt-1">
              {notification.message}
            </div>
          )}
          {notification.orderNumber && (
            <div className="text-xs opacity-75 mt-1">
              Order #{notification.orderNumber}
            </div>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onRemove}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add CSS for animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;
document.head.appendChild(style);
