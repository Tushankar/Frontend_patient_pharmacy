import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import getStatusColor from "../../utils/getStatusColor";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/patients/consultations")
      .then((res) => setConsultations(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading consultations...</div>;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Virtual Pharmacy Consultations</h2>
      {consultations.map((c) => (
        <div
          key={c._id}
          className="p-4 bg-white rounded shadow flex justify-between"
        >
          <div>
            <p>
              <strong>Pharmacy:</strong> {c.pharmacyId.pharmacyName}
            </p>
            <p>
              <strong>Scheduled At:</strong>{" "}
              {new Date(c.scheduledAt).toLocaleString()}
            </p>
            {c.meetingLink && (
              <p>
                <a
                  href={c.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  Join Meeting
                </a>
              </p>
            )}
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              c.status
            )}`}
          >
            {c.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Consultations;
