import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import getStatusColor from "../../utils/getStatusColor";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/patients/payments")
      .then((res) => setPayments(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading payments...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment History</h2>
      <div className="bg-white rounded shadow-sm divide-y divide-gray-200">
        {payments.map((p) => (
          <div
            key={p.transactionId || p._id}
            className="p-4 flex justify-between"
          >
            <div>
              <p>
                <strong>Amount:</strong> {p.amount} {p.currency}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    p.status
                  )}`}
                >
                  {p.status}
                </span>
              </p>
            </div>
            <div>
              <p>
                <strong>Transaction:</strong> {p.transactionId}
              </p>
              <p>
                <strong>Date:</strong> {new Date(p.paidAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
