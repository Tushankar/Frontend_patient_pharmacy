import React from "react";
import { Calendar, FileText, Pill, Activity, MapPin } from "lucide-react";
import { UploadCloud } from "lucide-react";

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: "upload",
      icon: UploadCloud,
      label: "Upload Prescription",
      subtitle: "Quick prescription uploads",
      primaryColor: "#FDE047",
      secondaryColor: "#FACC15",
      bgGradient:
        "linear-gradient(135deg, rgba(253, 224, 71, 0.15) 0%, rgba(250, 204, 21, 0.1) 100%)",
      iconBg: "rgba(253, 224, 71, 0.2)"
    },
    {
      id: "appointments",
      icon: Calendar,
      label: "Book Appointment",
      subtitle: "Schedule with doctors",
      primaryColor: "#0F4C47",
      secondaryColor: "#115E59",
      bgGradient:
        "linear-gradient(135deg, rgba(15, 76, 71, 0.15) 0%, rgba(17, 94, 89, 0.1) 100%)",
      iconBg: "rgba(15, 76, 71, 0.2)"
    },
    {
      id: "pharmacies",
      icon: MapPin,
      label: "Find Pharmacies",
      subtitle: "Locate nearby pharmacies",
      primaryColor: "#FDE047",
      secondaryColor: "#FACC15",
      bgGradient:
        "linear-gradient(135deg, rgba(253, 224, 71, 0.15) 0%, rgba(250, 204, 21, 0.1) 100%)",
      iconBg: "rgba(253, 224, 71, 0.2)"
    },
    {
      id: "prescriptions",
      icon: FileText,
      label: "View Prescriptions",
      subtitle: "Access your prescriptions",
      primaryColor: "#0F4C47",
      secondaryColor: "#115E59",
      bgGradient:
        "linear-gradient(135deg, rgba(15, 76, 71, 0.15) 0%, rgba(17, 94, 89, 0.1) 100%)",
      iconBg: "rgba(15, 76, 71, 0.2)"
    },
    {
      id: "order-history",
      icon: Pill,
      label: "Order Medicine",
      subtitle: "Quick medicine orders",
      primaryColor: "#FDE047",
      secondaryColor: "#FACC15",
      bgGradient:
        "linear-gradient(135deg, rgba(253, 224, 71, 0.15) 0%, rgba(250, 204, 21, 0.1) 100%)",
      iconBg: "rgba(253, 224, 71, 0.2)"
    },
    {
      id: "health-records",
      icon: Activity,
      label: "Health Records",
      subtitle: "Manage health data",
      primaryColor: "#0F4C47",
      secondaryColor: "#115E59",
      bgGradient:
        "linear-gradient(135deg, rgba(15, 76, 71, 0.15) 0%, rgba(17, 94, 89, 0.1) 100%)",
      iconBg: "rgba(15, 76, 71, 0.2)"
    },
  ];

  return (
    <div
      className="rounded-2xl shadow-xl p-8 border relative overflow-hidden font-sans"
      style={{
        backgroundColor: "rgba(15, 76, 71, 0.98)",
        borderColor: "rgba(253, 224, 71, 0.3)",
        backdropFilter: "blur(20px)"
      }}
    >
      {/* Enhanced background pattern */}
      <div
        className="absolute inset-0 opacity-5 font-sans"
        style={{
          background: `radial-gradient(circle at 20% 20%, #FDE047 0%, transparent 50%), 
                       radial-gradient(circle at 80% 80%, #FACC15 0%, transparent 50%),
                       radial-gradient(circle at 60% 20%, #0F4C47 0%, transparent 50%)`
        }}
      />
      <div className="relative z-10 font-sans">
        <div className="mb-8 font-sans">
          <div className="flex items-center gap-4 mb-4 font-sans">
            <div
              className="p-4 rounded-2xl shadow-lg font-sans"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                boxShadow: "0 10px 25px rgba(253, 224, 71, 0.3)"
              }}
            >
              <Activity className="w-7 h-7 font-sans" style={{ color: "#0F4C47" }} />
            </div>
            <div>
              <h2
                className="text-3xl font-bold mb-2 font-sans"
                style={{
                  color: "#DBF5F0"
                  
                }}
              >
                Quick Actions
              </h2>
              <p
                className="text-lg font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.8)"
                  
                }}
              >
                Access frequently used features with one click
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onAction && onAction(action.id)}
                className="group relative p-8 border-2 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 font-sans"
                style={{
                  background: action.bgGradient,
                  borderColor: "rgba(253, 224, 71, 0.3)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = `linear-gradient(135deg, ${action.primaryColor}20 0%, ${action.secondaryColor}15 100%)`;
                  e.target.style.borderColor = action.primaryColor;
                  e.target.style.boxShadow = `0 15px 35px ${action.primaryColor}25`;
                  e.target.style.transform = "scale(1.05) translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = action.bgGradient;
                  e.target.style.borderColor = "rgba(253, 224, 71, 0.3)";
                  e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  e.target.style.transform = "scale(1) translateY(0)";
                }}
              >
                {/* Subtle glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 font-sans"
                  style={{
                    background: `radial-gradient(circle at center, ${action.primaryColor} 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4 font-sans">
                  <div
                    className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 font-sans"
                    style={{
                      background:
                        "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                      boxShadow: "0 8px 20px rgba(253, 224, 71, 0.3)",
                      border: "2px solid rgba(253, 224, 71, 0.5)"
                    }}
                  >
                    <Icon
                      className="w-10 h-10 transition-all duration-300 group-hover:scale-110 font-sans"
                      style={{
                        color: "#115E59",
                        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                        strokeWidth: 2.5
                      }}
                    />
                  </div>

                  <div className="space-y-2 font-sans">
                    <h3
                      className="text-lg font-bold transition-colors duration-300 font-sans"
                      style={{
                        color: "#DBF5F0"
                        
                      }}
                    >
                      {action.label}
                    </h3>
                    <p
                      className="text-sm transition-colors duration-300 font-sans"
                      style={{
                        color: "rgba(219, 245, 240, 0.7)"
                        
                      }}
                    >
                      {action.subtitle}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 font-sans"
                    style={{
                      background: action.primaryColor
                    }}
                  >
                    <span
                      className="text-xs font-bold font-sans"
                      style={{ color: "#0F4C47" }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>{" "}
      {/* Close relative z-10 div */}
    </div>
  );
};

export default QuickActions;
