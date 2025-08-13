import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Bell,
  Clock,
  Pill,
  Calendar,
  AlertCircle,
  Plus,
  Settings,
} from "lucide-react";

const RefillReminders = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/patients/profile");
      const filteredMedications = res.data.data.currentMedications.filter(
        (m) => m.refillReminders.enabled
      );
      setMedications(filteredMedications);
    } catch (err) {
      console.error("Failed to fetch medications:", err);
      setError("Failed to load refill reminders");
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilRefill = (nextReminder) => {
    if (!nextReminder) return null;
    const today = new Date();
    const reminderDate = new Date(nextReminder);
    const diffTime = reminderDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysUntil) => {
    if (daysUntil === null) return "bg-gray-50 border-gray-200 text-gray-600";
    if (daysUntil <= 0) return "bg-red-50 border-red-200 text-red-700";
    if (daysUntil <= 3) return "bg-orange-50 border-orange-200 text-orange-700";
    if (daysUntil <= 7) return "bg-yellow-50 border-yellow-200 text-yellow-700";
    return "bg-green-50 border-green-200 text-green-700";
  };

  const getUrgencyIcon = (daysUntil) => {
    if (daysUntil === null) return <Clock className="w-5 h-5" />;
    if (daysUntil <= 0) return <AlertCircle className="w-5 h-5" />;
    if (daysUntil <= 3) return <Bell className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const getUrgencyMessage = (daysUntil) => {
    if (daysUntil === null) return "No reminder set";
    if (daysUntil <= 0) return "Refill overdue!";
    if (daysUntil <= 3)
      return `Refill needed in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`;
    if (daysUntil <= 7) return `Refill due in ${daysUntil} days`;
    return `${daysUntil} days until refill`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
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
            Error Loading Reminders
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Refill Reminders
              </h2>
              <p className="text-gray-600">
                Stay on top of your medication refills
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm">
              <Plus className="w-4 h-4" />
              Add Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Medications List */}
      <div className="p-6">
        {medications.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Active Reminders
            </h3>
            <p className="text-gray-600 mb-6">
              Set up refill reminders to never miss your medication doses
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
              Create Your First Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => {
              const daysUntil = getDaysUntilRefill(medication.nextReminder);
              return (
                <div
                  key={medication._id}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${getUrgencyColor(
                    daysUntil
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Pill className="w-6 h-6 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {medication.name}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">Next Reminder:</span>
                            <span>
                              {medication.nextReminder
                                ? new Date(
                                    medication.nextReminder
                                  ).toLocaleDateString()
                                : "Not set"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">Frequency:</span>
                            <span>
                              {medication.refillReminders.frequency ||
                                "Monthly"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium">
                          {getUrgencyIcon(daysUntil)}
                          <span>{getUrgencyMessage(daysUntil)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm">
                        Edit Reminder
                      </button>

                      {daysUntil !== null && daysUntil <= 7 && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-sm">
                          Order Refill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {medications.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Reminder Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {
                    medications.filter((m) => {
                      const days = getDaysUntilRefill(m.nextReminder);
                      return days !== null && days <= 0;
                    }).length
                  }
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    medications.filter((m) => {
                      const days = getDaysUntilRefill(m.nextReminder);
                      return days !== null && days > 0 && days <= 7;
                    }).length
                  }
                </div>
                <div className="text-sm text-gray-600">Due This Week</div>
              </div>

              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {
                    medications.filter((m) => {
                      const days = getDaysUntilRefill(m.nextReminder);
                      return days !== null && days > 7;
                    }).length
                  }
                </div>
                <div className="text-sm text-gray-600">Up to Date</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefillReminders;
