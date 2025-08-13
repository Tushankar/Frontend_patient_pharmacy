import React, { useState } from "react";
import {
  Bell,
  MessageCircle,
  Package,
  CheckCircle,
  FileText,
  Info,
  Activity,
  Filter,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Menu,
  X,
} from "lucide-react";

// Enhanced Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems 
}) => {
  const [goToPage, setGoToPage] = useState(currentPage);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
    }
    setGoToPage(currentPage);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 mt-6 p-4 rounded-lg" 
         style={{
           background: "linear-gradient(135deg, rgba(219, 245, 240, 0.05) 0%, rgba(219, 245, 240, 0.02) 100%)",
           border: "1px solid rgba(253, 224, 71, 0.1)"
         }}>
      
      {/* Items info */}
      <div className="text-sm text-center lg:text-left" style={{ color: "#A7F3D0", opacity: 0.8 }}>
        Showing {startItem}-{endItem} of {totalItems} notifications
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        {/* Mobile page info */}
        <div className="text-center text-sm sm:hidden" style={{ color: "#A7F3D0" }}>
          Page {currentPage} of {totalPages}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: currentPage === 1 
                ? "rgba(219, 245, 240, 0.05)" 
                : "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
              color: "#DBF5F0",
              border: "1px solid rgba(253, 224, 71, 0.2)"
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers - hidden on mobile */}
          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              page === '...' ? (
                <span 
                  key={`ellipsis-${index}`} 
                  className="px-3 py-2 text-sm"
                  style={{ color: "#A7F3D0", opacity: 0.6 }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === page ? 'shadow-lg' : ''
                  }`}
                  style={{
                    background: currentPage === page
                      ? "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
                    color: currentPage === page ? "#FDE047" : "#DBF5F0",
                    border: currentPage === page 
                      ? "1px solid rgba(253, 224, 71, 0.4)" 
                      : "1px solid rgba(253, 224, 71, 0.2)"
                  }}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: currentPage === totalPages 
                ? "rgba(219, 245, 240, 0.05)" 
                : "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
              color: "#DBF5F0",
              border: "1px solid rgba(253, 224, 71, 0.2)"
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Go to page - hidden on mobile */}
        <div className="hidden lg:flex items-center space-x-2">
          <span className="text-sm whitespace-nowrap" style={{ color: "#A7F3D0" }}>
            Go to page:
          </span>
          <div className="flex items-center space-x-1">
            <input
              type="number"
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleGoToPage();
                }
              }}
              min="1"
              max={totalPages}
              className="w-16 px-2 py-1 text-sm rounded border-0 focus:outline-none focus:ring-1"
              style={{
                background: "rgba(219, 245, 240, 0.1)",
                color: "#DBF5F0",
                focusRingColor: "#FDE047"
              }}
            />
            <button
              onClick={handleGoToPage}
              className="px-3 py-1 text-xs font-medium rounded transition-colors"
              style={{
                background: "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)",
                color: "#FDE047",
                border: "1px solid rgba(253, 224, 71, 0.3)"
              }}
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsSection = ({
  notifications = [],
  notificationFilter = "all",
  setNotificationFilter = () => {},
  notificationAnalytics,
  loading = false,
  onMarkAsRead = () => {},
  onDismissNotification = () => {},
  onRefreshNotifications = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemsPerPage = 5;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await onRefreshNotifications();
      setCurrentPage(1); // Reset to first page after refresh
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "chat":
        return <MessageCircle className="w-5 h-5" style={{ color: "#000000" }} />;
      case "order_status":
        return <Package className="w-5 h-5" style={{ color: "#000000" }} />;
      case "approval":
        return <CheckCircle className="w-5 h-5" style={{ color: "#000000" }} />;
      case "health_record":
        return <FileText className="w-5 h-5" style={{ color: "#000000" }} />;
      case "system":
        return <Info className="w-5 h-5" style={{ color: "#000000" }} />;
      default:
        return <Bell className="w-5 h-5" style={{ color: "#000000" }} />;
    }
  };

  const allNotifications = notifications || [];
  
  const filteredNotifications = allNotifications.filter((notification) => {
    if (notificationFilter === "all") return true;
    if (notificationFilter === "unread") return !notification.read;
    if (notificationFilter === "urgent") return notification.priority === "urgent";
    return notification.type === notificationFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (newFilter) => {
    setNotificationFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  const handleRefreshClick = () => {
    handleRefresh();
    setMobileMenuOpen(false); // Close mobile menu after refresh
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 rounded-xl" 
      style={{ background: "#256C5C" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
          <div className="flex-1">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              All System Notifications
            </h2>
            <div className="mt-2">
              <p
                className="text-sm lg:text-base"
                style={{
                  color: "#A7F3D0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Admin access - viewing all notifications across the entire platform
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className="inline-block px-2 py-1 rounded text-xs font-medium"
                  style={{
                    background: "rgba(253, 224, 71, 0.2)",
                    color: "#FDE047",
                    border: "1px solid rgba(253, 224, 71, 0.3)",
                  }}
                >
                  {allNotifications.length} total notifications loaded
                </span>
                {filteredNotifications.length !== allNotifications.length && (
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-medium"
                    style={{
                      background: "rgba(251, 191, 36, 0.2)",
                      color: "#FDE047",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                    }}
                  >
                    {filteredNotifications.length} filtered
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop Controls */}
          <div className="hidden lg:flex flex-col space-y-3 xl:flex-row xl:space-y-0 xl:space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)",
                color: "#FDE047",
                border: "1px solid rgba(253, 224, 71, 0.3)",
              }}
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            
            <select
              value={notificationFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                background: "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
                color: "#DBF5F0",
                border: "1px solid rgba(253, 224, 71, 0.2)",
              }}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="urgent">Urgent</option>
              <option value="chat">Chat Messages</option>
              <option value="order_status">Order Updates</option>
              <option value="approval">Approvals</option>
              <option value="health_record">Health Records</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
                color: "#DBF5F0",
                border: "1px solid rgba(253, 224, 71, 0.2)",
              }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div
                className="absolute right-0 top-12 w-64 rounded-lg shadow-lg p-4 z-50"
                style={{
                  background: "linear-gradient(135deg, rgba(219, 245, 240, 0.95) 0%, rgba(219, 245, 240, 0.9) 100%)",
                  border: "1px solid rgba(253, 224, 71, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="space-y-4">
                  <button
                    onClick={handleRefreshClick}
                    disabled={isRefreshing || loading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)",
                      color: "#FDE047",
                      border: "1px solid rgba(253, 224, 71, 0.3)",
                    }}
                  >
                    <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                  
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "#256C5C" }}
                    >
                      Filter Notifications
                    </label>
                    <select
                      value={notificationFilter}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "#256C5C",
                        border: "1px solid rgba(253, 224, 71, 0.3)",
                      }}
                    >
                      <option value="all">All Notifications</option>
                      <option value="unread">Unread Only</option>
                      <option value="urgent">Urgent</option>
                      <option value="chat">Chat Messages</option>
                      <option value="order_status">Order Updates</option>
                      <option value="approval">Approvals</option>
                      <option value="health_record">Health Records</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {loading || isRefreshing ? (
          <div className="flex justify-center items-center py-12">
            <div
              className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#FDE047", borderTopColor: "transparent" }}
            />
          </div>
        ) : allNotifications.length > 0 ? (
          <div className="space-y-4">
            {currentNotifications.map((notification) => (
              <div
                key={notification._id}
                className="rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300"
                style={{
                  background: "#CAE7E1",
                  border: !notification.read
                    ? "1px solid rgba(253, 224, 71, 0.3)"
                    : "1px solid rgba(219, 245, 240, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                  <div className="flex flex-1 space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3
                          className="text-sm sm:text-base font-semibold"
                          style={{
                            color: "#000000",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {notification.title}
                        </h3>
                        <span
                          className="px-2 py-0.5 text-xs font-medium rounded-full"
                          style={{
                            background:
                              notification.priority === "urgent"
                                ? "rgba(239, 68, 68, 0.2)"
                                : notification.priority === "high"
                                ? "rgba(251, 146, 60, 0.2)"
                                : notification.priority === "medium"
                                ? "rgba(251, 191, 36, 0.2)"
                                : notification.priority === "low"
                                ? "rgba(34, 197, 94, 0.2)"
                                : "rgba(156, 163, 175, 0.2)",
                            color: "#000000",
                            border:
                              notification.priority === "urgent"
                                ? "1px solid rgba(239, 68, 68, 0.3)"
                                : notification.priority === "high"
                                ? "1px solid rgba(251, 146, 60, 0.3)"
                                : notification.priority === "medium"
                                ? "1px solid rgba(251, 191, 36, 0.3)"
                                : notification.priority === "low"
                                ? "1px solid rgba(34, 197, 94, 0.3)"
                                : "1px solid rgba(156, 163, 175, 0.3)",
                          }}
                        >
                          {notification.priority?.toUpperCase() || "NORMAL"}
                        </span>
                        {!notification.read && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#FDE047" }}
                          />
                        )}
                      </div>
                      <p
                        className="text-sm sm:text-base mb-3"
                        style={{
                          color: "#000000",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {notification.message}
                      </p>
                      <div
                        className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs"
                        style={{ color: "#000000", opacity: 0.8 }}
                      >
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          <span className="sm:hidden">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </span>
                        {notification.recipient && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{notification.recipient.firstName} {notification.recipient.lastName}</span>
                          </span>
                        )}
                        <span
                          className="capitalize px-2 py-0.5 rounded text-xs"
                          style={{
                            background: "rgba(0, 0, 0, 0.1)",
                            color: "#000000",
                          }}
                        >
                          {notification.type?.replace(/_/g, " ")}
                        </span>
                        {notification.adminView && (
                          <>
                            <span
                              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                              style={{
                                background: "rgba(0, 0, 0, 0.1)",
                                color: "#000000",
                              }}
                            >
                              <Eye className="w-3 h-3" />
                              {notification.adminView.totalRecipients} recipients
                            </span>
                            {notification.adminView.unreadCount > 0 && (
                              <span
                                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                                style={{
                                  background: "rgba(0, 0, 0, 0.1)",
                                  color: "#000000",
                                }}
                              >
                                <AlertTriangle className="w-3 h-3" />
                                {notification.adminView.unreadCount} unread
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification._id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                          color: "#22C55E",
                          background: "rgba(34, 197, 94, 0.1)",
                        }}
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDismissNotification(notification._id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        color: "#EF4444",
                        background: "rgba(239, 68, 68, 0.1)",
                      }}
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced Pagination Component */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredNotifications.length}
              />
            )}
          </div>
        ) : (
          <div
            className="rounded-xl p-8 sm:p-12 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(219, 245, 240, 0.1) 0%, rgba(219, 245, 240, 0.05) 100%)",
              border: "1px solid rgba(253, 224, 71, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Bell
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
              style={{ color: "#A7F3D0", opacity: 0.6 }}
            />
            <p
              className="text-lg sm:text-xl"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              {notificationFilter === "all"
                ? "No notifications found"
                : `No ${notificationFilter} notifications`}
            </p>
            <p
              className="text-sm mt-2"
              style={{
                color: "#A7F3D0",
                opacity: 0.8,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {notificationFilter === "all"
                ? "Notifications will appear here when they are created"
                : "Try changing the filter to see more notifications"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsSection;