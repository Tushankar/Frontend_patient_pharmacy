import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Pill,
  Heart,
  Activity,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Search,
  Filter,
  Download,
  Share,
  Mail,
  MapPin,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const PatientHealthRecords = ({ patientId, onClose }) => {
  const [healthRecords, setHealthRecords] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (patientId) {
      fetchPatientHealthRecords();
    } else {
      fetchPendingRequests();
    }
  }, [patientId]);

  const fetchPatientHealthRecords = async () => {
    console.log("🔍 [PATIENT_HEALTH_RECORDS] fetchPatientHealthRecords called with patientId:", patientId);
    
    try {
      console.log("🚀 [PATIENT_HEALTH_RECORDS] Starting health records fetch...");
      setLoading(true);
      
      console.log(
        `📡 [PATIENT_HEALTH_RECORDS] Making API call to: /pharmacies/patients/${patientId}/shared-health-records`
      );
      
      const response = await axiosInstance.get(
        `/pharmacies/patients/${patientId}/shared-health-records`
      );
      
      console.log("✅ [PATIENT_HEALTH_RECORDS] API Response received:", response);
      console.log("📊 [PATIENT_HEALTH_RECORDS] Health records data:", response.data.data);
      console.log("📈 [PATIENT_HEALTH_RECORDS] Record counts:", response.data.data?.recordCounts);
      console.log("🏥 [PATIENT_HEALTH_RECORDS] Health records structure:", response.data.data?.healthRecords);
      
      setHealthRecords(response.data.data);
      console.log("💾 [PATIENT_HEALTH_RECORDS] Health records state updated");
    } catch (error) {
      console.error("❌ [PATIENT_HEALTH_RECORDS] Error fetching patient health records:", error);
      console.error("❌ [PATIENT_HEALTH_RECORDS] Error response:", error.response?.data);
    } finally {
      setLoading(false);
      console.log("🏁 [PATIENT_HEALTH_RECORDS] Health records fetch completed");
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/pharmacies/health-records/pending"
      );
      setPendingRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (patientId, recordId, approvalStatus) => {
    try {
      await axiosInstance.put(
        `/pharmacies/patients/${patientId}/health-records/${recordId}/approve`,
        { approvalStatus }
      );

      // Refresh pending requests
      fetchPendingRequests();

      // Show success message
      alert(`Health record access ${approvalStatus} successfully`);
    } catch (error) {
      console.error("Error updating approval status:", error);
      alert("Error updating approval status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "monitoring":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render pending requests view
  if (!patientId) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Health Record Access Requests
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Requests
            </h3>
            <p className="text-gray-500">
              There are no pending health record access requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={`${request.patientId}-${request.recordId}`}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.patientName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Phone: {request.patientPhone}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Medical Condition
                      </h4>
                      <p className="text-blue-800">{request.condition}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Diagnosed:{" "}
                        {new Date(request.diagnosedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Request sent:{" "}
                      {new Date(request.sharedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        handleApproveRequest(
                          request.patientId,
                          request.recordId,
                          "approved"
                        )
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleApproveRequest(
                          request.patientId,
                          request.recordId,
                          "rejected"
                        )
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Render patient health records view
  if (!healthRecords) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Access to Health Records
        </h3>
        <p className="text-gray-500">
          You don't have access to this patient's health records or the patient
          hasn't shared them with your pharmacy.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "medical-history", label: "Medical History", icon: FileText },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "allergies", label: "Allergies", icon: Heart },
    { id: "vitals", label: "Vital Signs", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Patient Health Records
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Patient Info Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {healthRecords.patientInfo.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {healthRecords.patientInfo.phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                DOB:{" "}
                {new Date(
                  healthRecords.patientInfo.dateOfBirth
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {healthRecords.patientInfo.emergencyContact?.name && (
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <span>
                <strong>Name:</strong>{" "}
                {healthRecords.patientInfo.emergencyContact.name}
              </span>
              <span>
                <strong>Relationship:</strong>{" "}
                {healthRecords.patientInfo.emergencyContact.relationship}
              </span>
              <span>
                <strong>Phone:</strong>{" "}
                {healthRecords.patientInfo.emergencyContact.phone}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Medical History
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {healthRecords.healthRecords?.medicalHistory?.length || 0}
                </p>
                <p className="text-sm text-blue-600">Active conditions</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">
                  Current Medications
                </h4>
                <p className="text-2xl font-bold text-green-600">
                  {healthRecords.healthRecords?.currentMedications?.length || 0}
                </p>
                <p className="text-sm text-green-600">Active prescriptions</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">
                  Known Allergies
                </h4>
                <p className="text-2xl font-bold text-red-600">
                  {healthRecords.healthRecords?.allergies?.length || 0}
                </p>
                <p className="text-sm text-red-600">Drug/substance allergies</p>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "medical-history" && (
            <div className="space-y-4">
              {healthRecords.healthRecords?.medicalHistory?.length > 0 ? (
                healthRecords.healthRecords.medicalHistory.map((history) => (
                  <div
                    key={history._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {history.condition}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Diagnosed:{" "}
                          {new Date(history.diagnosedDate).toLocaleDateString()}
                        </p>
                        {history.doctor && (
                          <p className="text-sm text-gray-600">
                            Doctor: {history.doctor}
                          </p>
                        )}
                        {history.notes && (
                          <p className="text-sm text-gray-700 mt-2">
                            Notes: {history.notes}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          history.status
                        )}`}
                      >
                        {history.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No medical history shared</p>
                </div>
              )}
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === "medications" && (
            <div className="space-y-4">
              {healthRecords.healthRecords?.currentMedications?.length > 0 ? (
                healthRecords.healthRecords.currentMedications.map((medication) => (
                  <div
                    key={medication._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900">
                      {medication.name}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        <strong>Dosage:</strong> {medication.dosage}
                      </span>
                      <span>
                        <strong>Frequency:</strong> {medication.frequency}
                      </span>
                      <span>
                        <strong>Started:</strong>{" "}
                        {new Date(medication.startDate).toLocaleDateString()}
                      </span>
                      {medication.endDate && (
                        <span>
                          <strong>Ends:</strong>{" "}
                          {new Date(medication.endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No current medications</p>
                </div>
              )}
            </div>
          )}

          {/* Allergies Tab */}
          {activeTab === "allergies" && (
            <div className="space-y-4">
              {healthRecords.healthRecords?.allergies?.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-900">
                      ⚠️ CRITICAL: Known Allergies
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {healthRecords.healthRecords.allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-red-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {allergy.allergen || allergy}
                            </h5>
                            {allergy.severity && (
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getSeverityColor(
                                  allergy.severity
                                )}`}
                              >
                                {allergy.severity.toUpperCase()}
                              </span>
                            )}
                            {allergy.reaction && (
                              <p className="text-sm text-gray-600 mt-1">
                                Reaction: {allergy.reaction}
                              </p>
                            )}
                            {allergy.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                Notes: {allergy.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No known allergies</p>
                </div>
              )}
            </div>
          )}

          {/* Vital Signs Tab */}
          {activeTab === "vitals" && (
            <div className="space-y-4">
              {console.log('🔍 VITAL SIGNS DEBUG:', {
                healthRecords: healthRecords,
                vitalSigns: healthRecords.healthRecords?.vitalSigns,
                vitalSignsLength: healthRecords.healthRecords?.vitalSigns?.length
              })}
              {healthRecords.healthRecords?.vitalSigns?.length > 0 ? (
                healthRecords.healthRecords.vitalSigns.map((vital) => (
                  <div
                    key={vital._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">
                        Vital Signs Record
                      </h4>
                      <span className="text-sm text-gray-500">
                        {new Date(vital.recordedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {vital.bloodPressure && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Blood Pressure
                          </p>
                          <p className="font-medium">
                            {vital.bloodPressure.systolic ||
                              vital.bloodPressure}
                            /{vital.bloodPressure.diastolic || ""} mmHg
                          </p>
                        </div>
                      )}
                      {vital.heartRate && (
                        <div>
                          <p className="text-sm text-gray-500">Heart Rate</p>
                          <p className="font-medium">{vital.heartRate} bpm</p>
                        </div>
                      )}
                      {vital.temperature && (
                        <div>
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="font-medium">{vital.temperature}°F</p>
                        </div>
                      )}
                      {vital.weight && (
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-medium">{vital.weight} kg</p>
                        </div>
                      )}
                      {vital.oxygenSaturation && (
                        <div>
                          <p className="text-sm text-gray-500">
                            Oxygen Saturation
                          </p>
                          <p className="font-medium">
                            {vital.oxygenSaturation}%
                          </p>
                        </div>
                      )}
                    </div>
                    {vital.notes && (
                      <p className="text-sm text-gray-600 mt-3">
                        Notes: {vital.notes}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No vital signs recorded</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHealthRecords;
