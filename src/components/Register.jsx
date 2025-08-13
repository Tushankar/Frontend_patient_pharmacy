import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  Building,
  Shield,
  ChevronRight,
  Check,
  Clock,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Login";
import LocationPicker from "./Pharmacy/LocationPicker";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPharmacyPendingMessage, setShowPharmacyPendingMessage] =
    useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    // Patient fields
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    // Patient address fields
    patientAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    patientLocation: null,
    // Pharmacy fields
    pharmacyName: "",
    licenseNumber: "",
    pharmacistName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    location: null,
    typeOfPharmacy: "",
    services: [],
    operatingHours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false },
    },
    verificationDocuments: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add custom styles for file input and checkboxes
    const style = document.createElement("style");
    style.textContent = `
      .pharmacy-file-input::file-selector-button {
        background-color: #FDE047;
        color: #115E59;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 12px;
      }
      .pharmacy-file-input::file-selector-button:hover {
        background-color: #FACC15;
        transform: translateY(-1px);
      }
      .pharmacy-file-input::-webkit-file-upload-button {
        background-color: #FDE047;
        color: #115E59;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 12px;
      }
      .pharmacy-file-input::-webkit-file-upload-button:hover {
        background-color: #FACC15;
        transform: translateY(-1px);
      }
      
      /* Custom checkbox styling for better visibility */
      input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
      }
      
      input[type="checkbox"]:checked {
        background-color: #FDE047 !important;
        border-color: #FDE047 !important;
      }
      
      input[type="checkbox"]:not(:checked) {
        background-color: rgba(15, 76, 71, 0.8) !important;
        border-color: rgba(219, 245, 240, 0.4) !important;
      }
      
      /* Ensure text contrast */
      .pharmacy-form-text {
        color: #DBF5F0 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  // Helper function to get field error styling
  const getFieldErrorClass = (fieldName) => {
    if (fieldErrors[fieldName]) {
      return "border-red-500 focus:ring-red-500 focus:border-red-500";
    }
    return "border-gray-300 focus:ring-blue-500 focus:border-transparent";
  };

  // Helper function to show field error message
  const getFieldErrorMessage = (fieldName) => {
    return fieldErrors[fieldName];
  };

  const roles = [
    {
      id: "patient",
      name: "Patient",
      icon: User,
      description: "Register as a patient to book appointments",
    },
    {
      id: "pharmacy",
      name: "Pharmacy",
      icon: Shield,
      description: "Register your pharmacy to manage prescriptions",
    },
  ];
  const pharmacyTypes = [
    "retail",
    "hospital",
    "clinical",
    "compounding",
    "specialty",
    "online",
    "other",
  ];
  const serviceOptions = [
    "prescription_filling",
    "medication_therapy_management",
    "compounding",
    "vaccination",
    "home_delivery",
    "consultation",
    "other",
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      location: {
        type: "Point",
        coordinates: [location.lng, location.lat],
      },
    });
  };

  const handlePatientLocationSelect = (location) => {
    setFormData({
      ...formData,
      patientLocation: {
        type: "Point",
        coordinates: [location.lng, location.lat],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate location for pharmacy
    if (
      selectedRole === "pharmacy" &&
      (!formData.location ||
        !formData.location.coordinates ||
        !Array.isArray(formData.location.coordinates) ||
        formData.location.coordinates.length !== 2)
    ) {
      setError("Please select a valid pharmacy location on the map");
      return;
    }

    // Validate location for patient
    if (
      selectedRole === "patient" &&
      (!formData.patientLocation ||
        !formData.patientLocation.coordinates ||
        !Array.isArray(formData.patientLocation.coordinates) ||
        formData.patientLocation.coordinates.length !== 2)
    ) {
      setError("Please select your location on the map");
      return;
    }

    // Validate required fields for patient
    if (selectedRole === "patient") {
      const requiredFields = [
        "firstName",
        "lastName",
        "phone",
        "dateOfBirth",
        "gender",
        "patientAddress.street",
        "patientAddress.city",
        "patientAddress.state",
        "patientAddress.zipCode",
      ];
      for (const field of requiredFields) {
        const value = field.includes(".")
          ? formData[field.split(".")[0]][field.split(".")[1]]
          : formData[field];
        if (!value) {
          setError(
            `Please provide ${field
              .replace(".", " ")
              .replace("patientAddress", "address")}`
          );
          return;
        }
      }
    }

    // Validate required fields for pharmacy
    if (selectedRole === "pharmacy") {
      const requiredFields = [
        "pharmacyName",
        "licenseNumber",
        "pharmacistName",
        "phone",
        "address.street",
        "address.city",
        "address.state",
        "address.zipCode",
        "typeOfPharmacy",
      ];
      for (const field of requiredFields) {
        const value = field.includes(".")
          ? formData[field.split(".")[0]][field.split(".")[1]]
          : formData[field];
        if (!value) {
          setError(`Please provide ${field.replace(".", " ")}`);
          return;
        }
      }

      // Validate verification documents
      if (
        !formData.verificationDocuments ||
        formData.verificationDocuments.length === 0
      ) {
        setError("At least one verification document (PDF) is required");
        return;
      }

      // Validate file types and size
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      for (const file of formData.verificationDocuments) {
        const ext = file.name.split(".").pop().toLowerCase();
        if (ext !== "pdf") {
          setError("All verification documents must be PDFs");
          return;
        }
        if (file.size > maxSize) {
          setError(`File ${file.name} exceeds 10MB limit`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data request
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", selectedRole);

      // Append profile data based on role
      if (selectedRole === "patient") {
        formDataToSend.append("profileData[firstName]", formData.firstName);
        formDataToSend.append("profileData[lastName]", formData.lastName);
        formDataToSend.append("profileData[phone]", formData.phone);
        formDataToSend.append("profileData[dateOfBirth]", formData.dateOfBirth);
        formDataToSend.append("profileData[gender]", formData.gender);

        // Append patient address data
        formDataToSend.append(
          "profileData[address][street]",
          formData.patientAddress.street
        );
        formDataToSend.append(
          "profileData[address][city]",
          formData.patientAddress.city
        );
        formDataToSend.append(
          "profileData[address][state]",
          formData.patientAddress.state
        );
        formDataToSend.append(
          "profileData[address][zipCode]",
          formData.patientAddress.zipCode
        );

        // Append patient location data
        formDataToSend.append(
          "profileData[address][location][coordinates]",
          JSON.stringify(formData.patientLocation.coordinates)
        );
      } else if (selectedRole === "pharmacy") {
        formDataToSend.append(
          "profileData[pharmacyName]",
          formData.pharmacyName
        );
        formDataToSend.append(
          "profileData[licenseNumber]",
          formData.licenseNumber
        );
        formDataToSend.append(
          "profileData[pharmacistName]",
          formData.pharmacistName
        );
        formDataToSend.append("profileData[phone]", formData.phone);
        formDataToSend.append(
          "profileData[address][street]",
          formData.address.street
        );
        formDataToSend.append(
          "profileData[address][city]",
          formData.address.city
        );
        formDataToSend.append(
          "profileData[address][state]",
          formData.address.state
        );
        formDataToSend.append(
          "profileData[address][zipCode]",
          formData.address.zipCode
        );
        formDataToSend.append(
          "profileData[typeOfPharmacy]",
          formData.typeOfPharmacy
        );
        formDataToSend.append(
          "profileData[services]",
          JSON.stringify(formData.services)
        );
        formDataToSend.append(
          "profileData[operatingHours]",
          JSON.stringify(formData.operatingHours)
        );
        formDataToSend.append(
          "profileData[location][type]",
          formData.location.type
        );
        formDataToSend.append(
          "profileData[location][coordinates]",
          JSON.stringify(formData.location.coordinates)
        );

        // Append verification documents
        Array.from(formData.verificationDocuments).forEach((file) => {
          formDataToSend.append("verificationDocuments", file);
        });
      }

      // Make the API request
      const response = await fetch(
        "http://localhost:1111/api/v1/auth/register",
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setError("Invalid server response. Please try again later.");
        return;
      }

      if (!response.ok) {
        if (response.status === 400) {
          // Clear previous field errors
          setFieldErrors({});

          // Set main error message
          setError(data.message || "Invalid input. Please check your details.");

          // Set field-specific errors if available
          if (data.errors && Array.isArray(data.errors)) {
            const fieldErrorMap = {};
            data.errors.forEach((err) => {
              fieldErrorMap[err.field] = err.message;
            });
            setFieldErrors(fieldErrorMap);
          } else if (data.field) {
            setFieldErrors({ [data.field]: data.message });
          }
        } else if (response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "Registration failed");
        }
      } else {
        if (selectedRole === "pharmacy") {
          setShowPharmacyPendingMessage(true);
          setStep(5);
        } else {
          setRegisteredEmail(formData.email);
          setStep(3);
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1].current?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].current?.focus();
    }
  };

  const handleOtpVerification = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:1111/api/v1/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: registeredEmail,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(4);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;
    setResending(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:1111/api/v1/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: registeredEmail,
            purpose: "email_verification",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setOtp(["", "", "", "", "", ""]);
        alert("OTP has been resent to your email!");
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setTimeout(() => setResending(false), 3000);
    }
  };

  const renderStepIndicator = () => {
    const steps = selectedRole === "pharmacy" ? 5 : 4;
    const stepLabels =
      selectedRole === "pharmacy"
        ? ["Role", "Details", "Documents", "Pending", "Complete"]
        : ["Role", "Details", "Verify", "Complete"];

    return (
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center">
          {[...Array(steps)].map((_, index) => {
            const num = index + 1;
            const isActive = step >= num;
            const isCompleted = step > num;

            return (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? "#FDE047"
                        : "rgba(219, 245, 240, 0.15)",
                      color: isActive ? "#115E59" : "rgba(219, 245, 240, 0.6)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      num
                    )}
                  </div>
                  
                  {stepLabels[index] && (
                    <span
                      className="text-sm mt-2 font-medium transition-colors duration-300"
                      style={{
                        color: isActive ? "#DBF5F0" : "rgba(219, 245, 240, 0.6)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {stepLabels[index]}
                    </span>
                  )}
                </div>
                {num < steps && (
                  <div
                    className="h-1 transition-all duration-300 rounded-full"
                    style={{
                      width: "100px",
                      backgroundColor: step > num ? "#FDE047" : "rgba(219, 245, 240, 0.2)",
                      margin: "0 16px",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2
          className="text-3xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Choose Your Role
        </h2>
        <p
          className="mt-2"
          style={{
            color: "rgba(219, 245, 240, 0.8)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Select how you want to use our platform
        </p>
      </div>

      <div className="flex justify-center gap-8">
        {roles.map((role) => {
          const Icon = role.icon;
          const backgroundImage = role.id === 'patient' 
            ? 'https://i.pinimg.com/1200x/34/1f/61/341f612abfc037b11218981568bbf09a.jpg'
            : 'https://i.pinimg.com/736x/6d/78/1e/6d781eda1f6197bc189ba390348de60e.jpg';
          
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="relative w-96 h-[450px] rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%)'
                }}
              />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6">
                <div className="mb-4 flex justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "2px solid rgba(255, 255, 255, 0.3)"
                    }}
                  >
                    {role.id === 'pharmacy' ? (
                      <img 
                        src="https://img.icons8.com/ios/50/pharmacy-shop.png" 
                        alt="Pharmacy"
                        className="w-8 h-8 filter invert"
                      />
                    ) : (
                      <Icon className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <h3
                    className="text-2xl font-bold text-white"
                    style={{
                      fontFamily: "Playfair Display, serif",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                    }}
                  >
                    {role.name}
                  </h3>
                </div>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          );
        })}
      </div>

      <div
        className="rounded-lg p-4 border max-w-2xl mx-auto"
        style={{
          backgroundColor: "rgba(253, 224, 71, 0.1)",
          borderColor: "rgba(253, 224, 71, 0.3)",
        }}
      >
        <div className="flex gap-3">
          <Info
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: "#FDE047" }}
          />
          <div className="text-sm">
            <p
              className="font-semibold"
              style={{
                color: "#DBF5F0",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Note for Pharmacy Registration:
            </p>
            <p
              className="mt-1"
              style={{
                color: "rgba(219, 245, 240, 0.7)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Pharmacy registrations require admin approval before you can
              access the platform. You'll receive an email once your
              registration is reviewed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );



  const renderRegistrationForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2
          className="text-3xl font-bold"
          style={{
            color: "#DBF5F0",
            fontFamily: "Playfair Display, serif",
          }}
        >
          {selectedRole === "patient"
            ? "Patient Registration"
            : "Pharmacy Registration"}
        </h2>
        <p
          className="mt-2"
          style={{
            color: "rgba(219, 245, 240, 0.8)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Fill in your details to create an account
        </p>
      </div>

      {error && (
        <div
          className="px-4 py-3 rounded-lg flex items-start gap-3 border"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.3)",
            color: "#FDE047",
          }}
        >
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: "#DBF5F0",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "rgba(219, 245, 240, 0.6)" }}
            />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: "rgba(17, 94, 89, 0.6)",
                color: "#DBF5F0",
                borderColor: "rgba(219, 245, 240, 0.4)",
                fontFamily: "Inter, sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FDE047";
                e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
              }}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#DBF5F0",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "rgba(219, 245, 240, 0.6)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength="6"
                className="w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: "rgba(17, 94, 89, 0.6)",
                  color: "#DBF5F0",
                  borderColor: "rgba(219, 245, 240, 0.4)",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FDE047";
                  e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                  e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                }}
                placeholder="Create password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
                style={{ color: "rgba(219, 245, 240, 0.6)" }}
                onMouseEnter={(e) => (e.target.style.color = "#FDE047")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(219, 245, 240, 0.6)")
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#DBF5F0",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: "rgba(219, 245, 240, 0.6)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: "rgba(17, 94, 89, 0.6)",
                  color: "#DBF5F0",
                  borderColor: "rgba(219, 245, 240, 0.4)",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FDE047";
                  e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                  e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                }}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Patient Fields */}
        {selectedRole === "patient" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "rgba(219, 245, 240, 0.6)" }}
                  />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: getFieldErrorMessage("firstName")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = getFieldErrorMessage("firstName")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                {getFieldErrorMessage("firstName") && (
                  <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                    {getFieldErrorMessage("firstName")}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Last Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "rgba(219, 245, 240, 0.6)" }}
                  />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: getFieldErrorMessage("lastName")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = getFieldErrorMessage("lastName")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                {getFieldErrorMessage("lastName") && (
                  <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                    {getFieldErrorMessage("lastName")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "rgba(219, 245, 240, 0.6)" }}
                  />
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: getFieldErrorMessage("phone")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = getFieldErrorMessage("phone")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    placeholder="10-digit phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                {getFieldErrorMessage("phone") && (
                  <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                    {getFieldErrorMessage("phone")}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "rgba(219, 245, 240, 0.6)" }}
                  />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: getFieldErrorMessage("dateOfBirth")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                      colorScheme: "dark",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = getFieldErrorMessage("dateOfBirth")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                  />
                </div>
                {getFieldErrorMessage("dateOfBirth") && (
                  <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                    {getFieldErrorMessage("dateOfBirth")}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Gender
              </label>
              <select
                required
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: "rgba(17, 94, 89, 0.6)",
                  color: "#DBF5F0",
                  borderColor: getFieldErrorMessage("gender")
                    ? "#EF4444"
                    : "rgba(219, 245, 240, 0.4)",
                  fontFamily: "Inter, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FDE047";
                  e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = getFieldErrorMessage("gender")
                    ? "#EF4444"
                    : "rgba(219, 245, 240, 0.4)";
                  e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                }}
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option
                  value=""
                  style={{ backgroundColor: "rgba(17, 94, 89, 0.9)", color: "rgba(219, 245, 240, 0.8)" }}
                >
                  Select gender
                </option>
                <option
                  value="male"
                  style={{ backgroundColor: "rgba(17, 94, 89, 0.9)", color: "#DBF5F0" }}
                >
                  Male
                </option>
                <option
                  value="female"
                  style={{ backgroundColor: "rgba(17, 94, 89, 0.9)", color: "#DBF5F0" }}
                >
                  Female
                </option>
                <option
                  value="other"
                  style={{ backgroundColor: "rgba(17, 94, 89, 0.9)", color: "#DBF5F0" }}
                >
                  Other
                </option>
              </select>
              {getFieldErrorMessage("gender") && (
                <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                  {getFieldErrorMessage("gender")}
                </p>
              )}
            </div>

            {/* Patient Address Section */}
            <div className="space-y-4">
              <h3
                className="font-medium text-lg"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: "rgba(219, 245, 240, 0.6)" }}
                    />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: getFieldErrorMessage("address.street")
                          ? "#EF4444"
                          : "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = getFieldErrorMessage("address.street")
                          ? "#EF4444"
                          : "rgba(219, 245, 240, 0.4)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Street address"
                      value={formData.patientAddress.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          patientAddress: {
                            ...formData.patientAddress,
                            street: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  {getFieldErrorMessage("address.street") && (
                    <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                      {getFieldErrorMessage("address.street")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: getFieldErrorMessage("address.city")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = getFieldErrorMessage("address.city")
                        ? "#EF4444"
                        : "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    placeholder="City"
                    value={formData.patientAddress.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientAddress: {
                          ...formData.patientAddress,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                  {getFieldErrorMessage("address.city") && (
                    <p className="text-sm mt-1" style={{ color: "#FDE047" }}>
                      {getFieldErrorMessage("address.city")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    State
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    placeholder="State"
                    value={formData.patientAddress.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientAddress: {
                          ...formData.patientAddress,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    placeholder="ZIP code"
                    value={formData.patientAddress.zipCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientAddress: {
                          ...formData.patientAddress,
                          zipCode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Patient Location Picker */}
            <div className="space-y-4">
              <h3 className="font-medium text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white" />
                Your Location
              </h3>
              <p className="text-sm text-white">
                Select your location on the map. This helps us provide better
                healthcare services near you.
              </p>
              <LocationPicker
                onLocationSelect={handlePatientLocationSelect}
                initialLocation={
                  formData.patientLocation
                    ? {
                        lat: formData.patientLocation.coordinates[1],
                        lng: formData.patientLocation.coordinates[0],
                      }
                    : null
                }
              />
            </div>
          </>
        )}

        {/* Pharmacy Fields */}
        {selectedRole === "pharmacy" && (
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.05)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{
                  color: "#FDE047",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <Building className="w-6 h-6" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Pharmacy Name *
                  </label>
                  <div className="relative group">
                    <Building
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                      style={{ color: "rgba(219, 245, 240, 0.6)" }}
                    />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter your pharmacy name"
                      value={formData.pharmacyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pharmacyName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    License Number *
                  </label>
                  <div className="relative group">
                    <Shield
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                      style={{ color: "rgba(219, 245, 240, 0.6)" }}
                    />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter license number"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          licenseNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.05)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{
                  color: "#FDE047",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <User className="w-6 h-6" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Pharmacist Name *
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                      style={{ color: "rgba(219, 245, 240, 0.6)" }}
                    />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter pharmacist name"
                      value={formData.pharmacistName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pharmacistName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                      style={{ color: "rgba(219, 245, 240, 0.6)" }}
                    />
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      className="w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.05)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{
                  color: "#FDE047",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <MapPin className="w-6 h-6" />
                Pharmacy Address
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Street Address *
                  </label>
                  <div className="relative group">
                    <MapPin
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300"
                      style={{ color: "rgba(219, 245, 240, 0.6)" }}
                    />
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter complete street address"
                      value={formData.address.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            street: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold"
                      style={{
                        color: "#DBF5F0",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter city"
                      value={formData.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            city: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold"
                      style={{
                        color: "#DBF5F0",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter state"
                      value={formData.address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            state: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="block text-sm font-semibold"
                      style={{
                        color: "#DBF5F0",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.6)",
                        color: "#DBF5F0",
                        borderColor: "rgba(219, 245, 240, 0.4)",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FDE047";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(253, 224, 71, 0.1)";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                        e.target.style.boxShadow = "none";
                        e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                      }}
                      placeholder="Enter ZIP code"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address,
                            zipCode: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="rounded-xl p-6 border" style={{ backgroundColor: "rgba(253, 224, 71, 0.05)", borderColor: "rgba(253, 224, 71, 0.2)", backdropFilter: "blur(10px)", }}>
  <h3 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: "#FDE047", fontFamily: "Playfair Display, serif", }}>
    <MapPin className="w-6 h-6" />
    Precise Location
  </h3>
  <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(219, 245, 240, 0.8)", fontFamily: "Inter, sans-serif", }}>
    📍 Select your pharmacy's exact location on the map. This helps patients find you easily and improves your visibility in local searches.
  </p>
</div>

{/* LocationPicker moved completely outside the container */}
<LocationPicker 
  onLocationSelect={handleLocationSelect}
  initialLocation={
    formData.location
      ? {
          lat: formData.location.coordinates[1],
          lng: formData.location.coordinates[0],
        }
      : null
  }
/>

            {/* Pharmacy Details Section */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.05)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{
                  color: "#FDE047",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <Shield className="w-6 h-6" />
                Pharmacy Details
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Type of Pharmacy *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 hover:border-opacity-80 focus:shadow-lg"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.6)",
                      color: "#DBF5F0",
                      borderColor: "rgba(219, 245, 240, 0.4)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(253, 224, 71, 0.1)";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                      e.target.style.boxShadow = "none";
                      e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                    }}
                    value={formData.typeOfPharmacy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        typeOfPharmacy: e.target.value,
                      })
                    }
                  >
                    <option
                      value=""
                      style={{ backgroundColor: "rgba(17, 94, 89, 0.9)", color: "rgba(219, 245, 240, 0.8)" }}
                    >
                      Select pharmacy type
                    </option>
                    {pharmacyTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        style={{ backgroundColor: "rgba(17, 94, 89, 0.9)", color: "#DBF5F0" }}
                      >
                        {type.replace(/_/g, " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="xl:col-span-2 space-y-4">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Available Services
                  </label>
                  <div
                    className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-lg border"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.2)",
                      borderColor: "rgba(219, 245, 240, 0.2)",
                      maxHeight: "250px",
                      overflowY: "auto",
                    }}
                  >
                    {serviceOptions.map((svc) => (
                      <label
                        key={svc}
                        className="inline-flex items-center group cursor-pointer hover:bg-opacity-20 p-2 rounded transition-all"
                        style={{
                          backgroundColor: "rgba(17, 94, 89, 0.1)",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor =
                            "rgba(17, 94, 89, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor =
                            "rgba(17, 94, 89, 0.1)";
                        }}
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded transition-colors duration-300 focus:ring-2 focus:ring-yellow-400"
                          style={{
                            accentColor: "#FDE047",
                            backgroundColor: formData.services.includes(svc)
                              ? "#FDE047"
                              : "rgba(15, 76, 71, 0.8)",
                            borderColor: formData.services.includes(svc)
                              ? "#FDE047"
                              : "rgba(219, 245, 240, 0.4)",
                            borderWidth: "2px",
                            outline: "none",
                          }}
                          checked={formData.services.includes(svc)}
                          onChange={(e) => {
                            const newServices = e.target.checked
                              ? [...formData.services, svc]
                              : formData.services.filter((s) => s !== svc);
                            setFormData({ ...formData, services: newServices });
                          }}
                        />
                        <span
                          className="ml-3 capitalize"
                          style={{
                            color: "#DBF5F0",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          {svc.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Section */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.05)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{
                  color: "#FDE047",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <Clock className="w-6 h-6" />
                Operating Hours
              </h3>

              <div className="space-y-4">
                {Object.keys(formData.operatingHours).map((day) => (
                  <div
                    key={day}
                    className="flex items-center gap-4 p-4 rounded-lg border transition-all"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.2)",
                      borderColor: "rgba(219, 245, 240, 0.2)",
                    }}
                  >
                    <div className="w-24">
                      <span
                        className="capitalize font-semibold"
                        style={{
                          color: "#DBF5F0",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "15px",
                        }}
                      >
                        {day}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="time"
                        className="border-2 rounded-lg px-3 py-2 transition-all duration-300"
                        style={{
                          backgroundColor: "rgba(17, 94, 89, 0.6)",
                          color: "#DBF5F0",
                          borderColor: "rgba(219, 245, 240, 0.4)",
                          fontFamily: "Inter, sans-serif",
                          colorScheme: "dark",
                          minWidth: "120px",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#FDE047";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(253, 224, 71, 0.1)";
                          e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                          e.target.style.boxShadow = "none";
                          e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                        }}
                        value={formData.operatingHours[day].open}
                        onChange={(e) => {
                          const hours = { ...formData.operatingHours };
                          hours[day].open = e.target.value;
                          setFormData({ ...formData, operatingHours: hours });
                        }}
                        disabled={formData.operatingHours[day].closed}
                      />

                      <span
                        style={{
                          color: "rgba(219, 245, 240, 0.8)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        to
                      </span>

                      <input
                        type="time"
                        className="border-2 rounded-lg px-3 py-2 transition-all duration-300"
                        style={{
                          backgroundColor: "rgba(17, 94, 89, 0.6)",
                          color: "#DBF5F0",
                          borderColor: "rgba(219, 245, 240, 0.4)",
                          fontFamily: "Inter, sans-serif",
                          colorScheme: "dark",
                          minWidth: "120px",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#FDE047";
                          e.target.style.boxShadow =
                            "0 0 0 2px rgba(253, 224, 71, 0.1)";
                          e.target.style.backgroundColor = "rgba(17, 94, 89, 0.8)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(219, 245, 240, 0.4)";
                          e.target.style.boxShadow = "none";
                          e.target.style.backgroundColor = "rgba(17, 94, 89, 0.6)";
                        }}
                        value={formData.operatingHours[day].close}
                        onChange={(e) => {
                          const hours = { ...formData.operatingHours };
                          hours[day].close = e.target.value;
                          setFormData({ ...formData, operatingHours: hours });
                        }}
                        disabled={formData.operatingHours[day].closed}
                      />
                    </div>

                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded transition-colors duration-300 focus:ring-2 focus:ring-yellow-400"
                        style={{
                          accentColor: "#FDE047",
                          backgroundColor: formData.operatingHours[day].closed
                            ? "#FDE047"
                            : "rgba(15, 76, 71, 0.8)",
                          borderColor: formData.operatingHours[day].closed
                            ? "#FDE047"
                            : "rgba(219, 245, 240, 0.4)",
                          borderWidth: "2px",
                          outline: "none",
                        }}
                        checked={formData.operatingHours[day].closed}
                        onChange={(e) => {
                          const hours = { ...formData.operatingHours };
                          hours[day].closed = e.target.checked;
                          if (e.target.checked) {
                            hours[day].open = "";
                            hours[day].close = "";
                          }
                          setFormData({ ...formData, operatingHours: hours });
                        }}
                      />
                      <span
                        style={{
                          color: "#DBF5F0",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        Closed
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Upload Section */}
            <div
              className="rounded-xl p-6 border"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.05)",
                borderColor: "rgba(253, 224, 71, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-3"
                style={{
                  color: "#FDE047",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                <Shield className="w-6 h-6" />
                Verification Documents
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold"
                    style={{
                      color: "#DBF5F0",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Upload License & Certification Documents *
                  </label>

                  <div
                    className="relative group cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(253, 224, 71, 0.1) 0%, rgba(17, 94, 89, 0.2) 100%)",
                      border: "2px dashed rgba(253, 224, 71, 0.4)",
                      borderRadius: "12px",
                      padding: "24px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#FDE047";
                      e.target.style.backgroundColor =
                        "rgba(253, 224, 71, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(253, 224, 71, 0.4)";
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="application/pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                        for (const file of files) {
                          if (file.size > maxSize) {
                            setError(`File ${file.name} exceeds 10MB limit`);
                            return;
                          }
                        }
                        setFormData({
                          ...formData,
                          verificationDocuments: files,
                        });
                      }}
                    />

                    <div className="text-center">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "rgba(253, 224, 71, 0.2)",
                        }}
                      >
                        <Shield
                          className="w-8 h-8"
                          style={{ color: "#FDE047" }}
                        />
                      </div>

                      <p
                        className="text-lg font-semibold mb-2"
                        style={{
                          color: "#DBF5F0",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Click to Upload Documents
                      </p>

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: "rgba(219, 245, 240, 0.7)",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Upload pharmacy license, pharmacist certification, or
                        other relevant documents
                        <br />
                        <span
                          className="font-semibold"
                          style={{ color: "#FDE047" }}
                        >
                          PDF files only • Maximum 10MB per file
                        </span>
                      </p>
                    </div>
                  </div>

                  {formData.verificationDocuments &&
                    formData.verificationDocuments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: "#FDE047",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Selected Documents:
                        </p>
                        {Array.from(formData.verificationDocuments).map(
                          (file, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg border"
                              style={{
                                backgroundColor: "rgba(17, 94, 89, 0.3)",
                                borderColor: "rgba(253, 224, 71, 0.3)",
                              }}
                            >
                              <Shield
                                className="w-4 h-4"
                                style={{ color: "#FDE047" }}
                              />
                              <span
                                className="flex-1 truncate"
                                style={{
                                  color: "#DBF5F0",
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "14px",
                                }}
                              >
                                {file.name}
                              </span>
                              <span
                                className="text-xs"
                                style={{
                                  color: "rgba(219, 245, 240, 0.6)",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="pt-6 border-t"
          style={{ borderColor: "rgba(253, 224, 71, 0.2)" }}
        >
          <div className="flex gap-6">
            
<button
  type="button"
  onClick={() => setStep(1)}
  className="absolute top-12 left-4 font-semibold py-3 px-5 rounded-xl transition-all duration-300 border-2 group hover:scale-105 z-10"
  style={{
    backgroundColor: "rgba(17, 94, 89, 0.2)",
    color: "rgba(219, 245, 240, 0.8)",
    borderColor: "rgba(219, 245, 240, 0.3)",
    fontFamily: "Inter, sans-serif",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "rgba(17, 94, 89, 0.4)";
    e.target.style.color = "#DBF5F0";
    e.target.style.borderColor = "rgba(219, 245, 240, 0.5)";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "rgba(17, 94, 89, 0.2)";
    e.target.style.color = "rgba(219, 245, 240, 0.8)";
    e.target.style.borderColor = "rgba(219, 245, 240, 0.3)";
  }}
>
  ← Back to Role Selection
</button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border-2 group shadow-lg hover:scale-105"
              style={{
                background: loading
                  ? "rgba(253, 224, 71, 0.5)"
                  : "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                color: "#115E59",
                borderColor: "#FDE047",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading
                  ? "none"
                  : "0 4px 15px rgba(253, 224, 71, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background =
                    "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(253, 224, 71, 0.4)";
                  e.target.style.borderColor = "#FACC15";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background =
                    "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(253, 224, 71, 0.3)";
                  e.target.style.borderColor = "#FDE047";
                }
              }}
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>
                    {selectedRole === "pharmacy"
                      ? "Submit for Approval"
                      : "Create Account"}
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {selectedRole === "pharmacy" && (
            <div
              className="mt-6 p-4 rounded-lg border flex items-start gap-3"
              style={{
                backgroundColor: "rgba(253, 224, 71, 0.1)",
                borderColor: "rgba(253, 224, 71, 0.3)",
              }}
            >
              <Info
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: "#FDE047" }}
              />
              <div className="text-sm">
                <p
                  className="font-semibold mb-1"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  🏥 Pharmacy Registration Notice
                </p>
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: "1.5",
                  }}
                >
                  Your pharmacy registration will be reviewed by our admin team
                  within 1-2 business days. You'll receive an email notification
                  once your registration is approved and you can start using the
                  platform.
                </p>
              </div>
            </div>
          )}
        </div>
      </form>

      <div className="text-center">
        <p
          style={{
            color: "rgba(219, 245, 240, 0.8)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold transition-colors duration-300"
            style={{ color: "#FDE047" }}
            onMouseEnter={(e) => (e.target.style.color = "#FACC15")}
            onMouseLeave={(e) => (e.target.style.color = "#FDE047")}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );

  const renderOtpVerification = () => (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
        <Mail className="w-10 h-10 text-blue-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-gray-900 mt-1">{registeredEmail}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 text-left max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={otpRefs.current[index]}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleOtpVerification}
          disabled={verifying || otp.join("").length !== 6}
          className="w-full max-w-xs mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {verifying ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Verify Email
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={resending}
            className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPharmacyPending = () => (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
        <Clock className="w-10 h-10 text-yellow-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Registration Submitted!
        </h2>
        <p className="text-gray-600 mt-2">
          Your pharmacy registration has been submitted for approval
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm text-yellow-800">
              Your registration is now pending admin approval. This typically
              takes 1-2 business days.
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              You'll receive an email notification once your registration has
              been reviewed.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>What happens next?</p>
          <ul className="mt-2 text-left max-w-md mx-auto space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>An admin will review your registration details</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>You'll receive an email with the approval status</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>
                Once approved, you can log in and start using the platform
              </span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Login
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Email Verified!</h2>
        <p className="text-gray-600 mt-2">
          Your email has been successfully verified.
        </p>
        <p className="text-gray-600 mt-1">
          You can now log in to your account.
        </p>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
      >
        Go to Login
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#115E59" }}
    >
      <div className="w-full max-w-7xl">
        <div className="p-8">
          {renderStepIndicator()}
          {step === 1 && renderRoleSelection()}
          {step === 2 && renderRegistrationForm()}
          {step === 3 && renderOtpVerification()}
          {step === 4 && renderSuccess()}
          {step === 5 && renderPharmacyPending()}
        </div>
      </div>
    </div>
  );
};

export default Register;
