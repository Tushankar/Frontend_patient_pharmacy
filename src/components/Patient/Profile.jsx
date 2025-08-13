import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Shield,
  FileText,
  Edit3,
  Camera,
  Activity,
  AlertCircle,
} from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/patients/profile");
      setProfile(res.data.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="animate-pulse">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg text-white overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute -bottom-1 -right-1 p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-blue-100 mb-1">
                  Patient ID: #{profile._id?.slice(-8)}
                </p>
                <p className="text-blue-100">
                  Member since {new Date(profile.createdAt).getFullYear()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-medium"
            >
              <Edit3 className="w-4 h-4" />
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="font-semibold text-gray-900">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="font-semibold text-gray-900">{profile.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p className="font-semibold text-gray-900">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Insurance</p>
                  <p className="font-semibold text-gray-900">
                    {profile.insurance || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Medical History</h2>
          </div>
        </div>

        <div className="p-6">
          {profile.medicalHistory && profile.medicalHistory.length > 0 ? (
            <div className="space-y-4">
              {profile.medicalHistory.map((condition) => (
                <div
                  key={condition._id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {condition.condition}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Diagnosed:{" "}
                          {new Date(
                            condition.diagnosedDate
                          ).toLocaleDateString()}
                        </p>
                        {condition.notes && (
                          <p className="text-sm text-gray-500 mt-2">
                            {condition.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        condition.status === "active"
                          ? "bg-red-100 text-red-700"
                          : condition.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {condition.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Medical History
              </h3>
              <p className="text-gray-600">
                Medical history will appear here when added
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Current Medications
            </h2>
          </div>
        </div>

        <div className="p-6">
          {profile.currentMedications &&
          profile.currentMedications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.currentMedications.map((medication) => (
                <div
                  key={medication._id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900">
                    {medication.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Dosage: {medication.dosage}
                  </p>
                  <p className="text-sm text-gray-600">
                    Frequency: {medication.frequency}
                  </p>
                  {medication.prescribedBy && (
                    <p className="text-sm text-gray-500 mt-2">
                      Prescribed by: {medication.prescribedBy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Current Medications
              </h3>
              <p className="text-gray-600">
                Current medications will appear here when added
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Emergency Contact
            </h2>
          </div>
        </div>

        <div className="p-6">
          {profile.emergencyContact ? (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <h3 className="font-semibold text-gray-900">
                {profile.emergencyContact.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Relationship: {profile.emergencyContact.relationship}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {profile.emergencyContact.phone}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Emergency Contact
              </h3>
              <p className="text-gray-600 mb-4">
                Add an emergency contact for safety
              </p>
              <button className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium">
                Add Emergency Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
