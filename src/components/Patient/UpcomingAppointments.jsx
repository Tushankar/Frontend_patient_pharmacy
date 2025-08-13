import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  User,
  Video,
  Phone
} from "lucide-react";
import getStatusColor from "../../utils/getStatusColor";

const UpcomingAppointments = ({
  title = "Upcoming Appointments",
  appointments = []
}) => (
  <div
    className="rounded-2xl shadow-lg border font-sans"
    style={{
      backgroundColor: "#256C5C",
      borderColor: "rgba(253, 224, 71, 0.2)",
      backdropFilter: "blur(10px)"
    }}
  >
    <div
      className="p-6 border-b flex items-center justify-between font-sans"
      style={{ borderColor: "rgba(253, 224, 71, 0.2)", /*backgroundColor: "#256C5C" */ }}
    >
      <div className="flex items-center gap-3 font-sans">
        <div
          className="p-2 rounded-xl font-sans"
          style={{
            backgroundColor: "#CAE7E1"
          }}
        >
          <Calendar className="w-5 h-5 font-sans" style={{ color: "#256C5C" }} />
        </div>
        <div>
          <h2
            className="text-xl font-bold font-sans"
            style={{
              color: "#FFFFFF"
            }}
          >
            {title}
          </h2>
          <p
            className="text-sm font-sans mt-1"
            style={{
              color: "rgba(255, 255, 255, 0.8)"
            }}
          >
            Your scheduled healthcare visits
          </p>
        </div>
      </div>
      <button
        className="text-sm font-medium flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 font-sans text-white hover:bg-white/10 border border-white/20"
        style={{ color: "#FFFFFF" }}
      >
        <span className="hidden sm:inline">View all</span>
        <span className="sm:hidden">View</span>
        <ChevronRight className="w-4 h-4 font-sans" />
      </button>
    </div>

    <div
      className="divide-y max-h-96 overflow-y-auto font-sans"
      style={{ "--tw-divide-opacity": "0.2", "--tw-divide-color": "#256C5C", backgroundColor: "#CAE7E1", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}
    >
      {appointments.length === 0 ? (
        <div className="text-center py-12 font-sans" style={{ backgroundColor: "#CAE7E1" }}>
          <div
            className="p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center font-sans"
            style={{
              backgroundColor: "rgba(37, 108, 92, 0.2)"
            }}
          >
            <Calendar
              className="w-8 h-8 font-sans"
              style={{ color: "#256C5C" }}
            />
          </div>
          <h3
            className="text-lg font-medium mb-2 font-sans"
            style={{
              color: "#256C5C"
            }}
          >
            No Upcoming Appointments
          </h3>
          <p
            className="font-sans"
            style={{
              color: "rgba(37, 108, 92, 0.7)"
            }}
          >
            Book your next consultation
          </p>
        </div>
      ) : (
        appointments.slice(0, 3).map((appointment) => (
          <div
            key={appointment.id}
            className="p-6 transition-all duration-200 group font-sans"
            style={{ backgroundColor: "#CAE7E1" }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(37, 108, 92, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#CAE7E1";
            }}
          >
            <div className="flex items-start justify-between font-sans">
              <div className="flex items-start gap-4 flex-1 font-sans">
                <div
                  className="p-3 rounded-xl text-white font-sans"
                  style={{
                    background:
                      "linear-gradient(135deg, #22C55E 0%, #3B82F6 100%)"
                  }}
                >
                  <User className="w-5 h-5 font-sans" />
                </div>

                <div className="flex-1 font-sans">
                  <h3
                    className="text-lg font-bold transition-colors font-sans"
                    style={{
                      color: "#256C5C"
                    }}
                  >
                    Dr. {appointment.doctor}
                  </h3>
                  <p
                    className="text-sm mb-3 font-medium font-sans"
                    style={{
                      color: "rgba(37, 108, 92, 0.8)"
                    }}
                  >
                    {appointment.specialty}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-sans">
                    <div
                      className="flex items-center gap-2 text-sm font-sans"
                      style={{ color: "rgba(37, 108, 92, 0.8)" }}
                    >
                      <Calendar
                        className="w-4 h-4 font-sans"
                        style={{ color: "#256C5C" }}
                      />
                      <span className="font-medium font-sans">{appointment.date}</span>
                    </div>

                    <div
                      className="flex items-center gap-2 text-sm font-sans"
                      style={{ color: "rgba(37, 108, 92, 0.8)" }}
                    >
                      <Clock className="w-4 h-4 font-sans" style={{ color: "#256C5C" }} />
                      <span className="font-medium font-sans">{appointment.time}</span>
                    </div>

                    <div
                      className="flex items-center gap-2 text-sm sm:col-span-2 font-sans"
                      style={{ color: "rgba(37, 108, 92, 0.8)" }}
                    >
                      <MapPin
                        className="w-4 h-4 font-sans"
                        style={{ color: "#256C5C" }}
                      />
                      <span className="font-medium font-sans">
                        {appointment.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-sans">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current mr-2 font-sans"></div>
                      {appointment.status}
                    </span>

                    <div className="flex items-center gap-2 font-sans">
                      <button
                        className="p-2 rounded-lg transition-all duration-200 font-sans"
                        style={{ color: "rgba(37, 108, 92, 0.6)" }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#3B82F6";
                          e.target.style.backgroundColor =
                            "rgba(59, 130, 246, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "rgba(37, 108, 92, 0.6)";
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        <Video className="w-4 h-4 font-sans" />
                      </button>
                      <button
                        className="p-2 rounded-lg transition-all duration-200 font-sans"
                        style={{ color: "rgba(37, 108, 92, 0.6)" }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#22C55E";
                          e.target.style.backgroundColor =
                            "rgba(34, 197, 94, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "rgba(37, 108, 92, 0.6)";
                          e.target.style.backgroundColor = "transparent";
                        }}
                      >
                        <Phone className="w-4 h-4 font-sans" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default UpcomingAppointments;