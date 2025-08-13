// utils/getStatusColor.js

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "ongoing":
      return "bg-purple-100 text-purple-800";
    case "managed":
      return "bg-green-100 text-green-800";
    case "seasonal":
      return "bg-orange-100 text-orange-800";
    // Prescription statuses
    case "uploaded":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "pending_approval":
      return "bg-yellow-100 text-yellow-800";
    case "processed":
      return "bg-indigo-100 text-indigo-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default getStatusColor;
