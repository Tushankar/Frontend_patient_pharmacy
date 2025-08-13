import React, { useState, useEffect } from "react";
import {
  Eye,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const NearbyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/pharmacies/prescriptions/incoming");
      setPrescriptions(res.data.data);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleResponse = async (id, action) => {
    try {
      await axiosInstance.post(`/pharmacies/prescriptions/${id}/respond`, {
        action,
      });
      setPrescriptions((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(`Failed to ${action} prescription:`, err);
      setError(`Could not ${action} prescription`);
    }
  };

  const handleViewDetails = async (prescription) => {
    console.log("View details clicked for prescription:", prescription);

    try {
      setLoadingPatient(true);
      setSelectedPrescription(prescription);

      console.log("Fetching patient details for ID:", prescription.patientId);

      // Fetch patient details
      const response = await axiosInstance.get(
        `/auth/users/${prescription.patientId}`
      );

      console.log("Patient details response:", response.data);

      if (response.data.success) {
        setPatientDetails(response.data.data);
        setShowDetailsModal(true);
      } else {
        console.error("API returned error:", response.data.message);
        setError(
          "Failed to load patient details: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error fetching patient details:", err);
      setError(
        "Failed to load patient details: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoadingPatient(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPrescription(null);
    setPatientDetails(null);
  };

  if (loading) return <p>Loading prescriptions...</p>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Incoming Prescriptions
      </h2>

      {/* Debug button - remove after testing */}
      <button
        onClick={() => {
          console.log("Test modal button clicked");
          setSelectedPrescription({
            _id: "test",
            description: "Test prescription",
          });
          setPatientDetails({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
          });
          setShowDetailsModal(true);
        }}
        className="mb-4 px-3 py-1 bg-purple-600 text-white rounded text-sm"
      >
        Test Modal (Debug)
      </button>
      {prescriptions.length === 0 ? (
        <p>No new prescriptions.</p>
      ) : (
        <ul className="space-y-4">
          {prescriptions.map((rx) => (
            <li
              key={rx._id}
              className="p-4 border rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {rx.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Submitted: {new Date(rx.createdAt).toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rx.originalFile?.secureUrl ? (
                      <a
                        href={rx.originalFile.secureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 underline text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Prescription
                      </a>
                    ) : (
                      <span className="inline-flex items-center text-gray-400 text-sm">
                        <FileText className="w-4 h-4 mr-1" />
                        No prescription file
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        console.log("View Patient Details button clicked");
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewDetails(rx);
                      }}
                      className="inline-flex items-center text-teal-600 hover:text-teal-800 underline text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Patient Details
                    </button>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleResponse(rx._id, "accept")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(rx._id, "decline")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Patient Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-t-xl">
              <h3 className="text-xl font-semibold">Patient Details</h3>
              <button
                onClick={closeDetailsModal}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingPatient ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading patient details...
                  </span>
                </div>
              ) : patientDetails ? (
                <div className="space-y-6">
                  {/* Patient Information */}
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4 border border-teal-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2 text-teal-600" />
                      Patient Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {patientDetails.firstName} {patientDetails.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-gray-500" />
                          {patientDetails.email}
                        </p>
                      </div>
                      {patientDetails.phone && (
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-1 text-gray-500" />
                            {patientDetails.phone}
                          </p>
                        </div>
                      )}
                      {patientDetails.dateOfBirth && (
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium text-gray-900 flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                            {new Date(
                              patientDetails.dateOfBirth
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {patientDetails.address && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium text-gray-900 flex items-start">
                            <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-0.5" />
                            {patientDetails.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prescription Information */}
                  {selectedPrescription && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                        Prescription Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="font-medium text-gray-900">
                            {selectedPrescription.description ||
                              "No description provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Submitted Date
                          </p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              selectedPrescription.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {selectedPrescription.status}
                          </span>
                        </div>
                        {selectedPrescription.originalFile && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Prescription Image
                            </p>
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  selectedPrescription.originalFile.secureUrl
                                }
                                alt="Prescription"
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <a
                                href={
                                  selectedPrescription.originalFile.secureUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline flex items-center"
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                View Full Size
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Failed to load patient details
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                {selectedPrescription && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        handleResponse(selectedPrescription._id, "accept");
                        closeDetailsModal();
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Accept Prescription
                    </button>
                    <button
                      onClick={() => {
                        handleResponse(selectedPrescription._id, "decline");
                        closeDetailsModal();
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      Decline Prescription
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyPrescriptions;
