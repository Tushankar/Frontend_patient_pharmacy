import React from "react";

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
    {stats.map((stat, index) => {
      const Icon = stat.icon;
      return (
        <div
          key={index}
          className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border group hover:scale-105 transform relative overflow-hidden font-sans"
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
              background: `radial-gradient(circle at 30% 30%, #FDE047 0%, transparent 60%), 
                           radial-gradient(circle at 70% 70%, #FACC15 0%, transparent 60%)`
            }}
          />

          <div className="relative z-10 font-sans">
            <div className="flex items-center justify-between mb-6 font-sans">
              <div
                className="rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg font-sans"
                style={{
                  background:
                    "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                  boxShadow: "0 8px 25px rgba(253, 224, 71, 0.3)"
                }}
              >
                <Icon className="w-8 h-8 font-sans" style={{ color: "#0F4C47" }} />
              </div>
              {stat.trend && (
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full font-sans"
                  style={{
                    backgroundColor: "rgba(253, 224, 71, 0.2)",
                    color: "#FACC15"
                    
                  }}
                >
                  {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p
                className="text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300 font-sans"
                style={{
                  color: "#DBF5F0"
                  
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-lg font-medium font-sans"
                style={{
                  color: "rgba(219, 245, 240, 0.9)"
                  
                }}
              >
                {stat.label}
              </p>
              <div
                className="mt-4 h-2 rounded-full overflow-hidden font-sans"
                style={{ backgroundColor: "rgba(253, 224, 71, 0.2)" }}
              >
                <div
                  className="h-full transform origin-left group-hover:scale-x-100 transition-transform duration-1000 font-sans"
                  style={{
                    background:
                      "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                    width: "70%",
                    opacity: 0.8
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatsGrid;
