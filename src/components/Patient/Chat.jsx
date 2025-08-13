import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/patients/chats")
      .then((res) => setChats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading chats...</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Chat with Pharmacy</h2>
      {chats.map((chat) => (
        <div
          key={chat.pharmacyId}
          className="p-4 bg-white rounded shadow flex justify-between"
        >
          <div>{chat.pharmacyId.pharmacyName}</div>
          <div>Unread: {chat.unreadCount}</div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
