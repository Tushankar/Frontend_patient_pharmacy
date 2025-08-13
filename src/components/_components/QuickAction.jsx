const QuickAction = () => {
  return (
    <div className="bg-[#0a6a6270] rounded-2xl p-6 shadow-sm border border-[#a2a74739]">
      <h2 className="text-xl font-bold text-gray-100 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            id: "appointments",
            icon: Calendar,
            label: "Book Appointment",
            color: "blue",
          },
          {
            id: "prescriptions",
            icon: FileText,
            label: "View Prescriptions",
            color: "emerald",
          },
          {
            id: "upload",
            icon: UploadCloud,
            label: "Upload Prescription",
            color: "purple",
          },
          {
            id: "pharmacies",
            icon: MapPin,
            label: "Find Pharmacies",
            color: "rose",
          },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              className={`p-6 rounded-xl border-2 border-[#a2a74739] hover:border-[#a2a74739]-200 hover:bg-[#a2a7471c] transition-all duration-300 group`}
            >
              <Icon
                className={`w-8 h-8 text-${action.color}-500 mb-3 group-hover:scale-110 transition-transform`}
              />
              <p className="text-sm font-medium text-gray-200">
                {action.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAction;
