// components/PharmacyEmailVerification.jsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Building,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PharmacyEmailVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1); // 1: email input, 2: approval status, 3: otp input
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [pharmacyStatus, setPharmacyStatus] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setCheckingStatus(true);
    setError("");

    try {
      // Try to send OTP to check if pharmacy is approved
      const response = await fetch(
        "https://doctors-portal-backend-2.onrender.com/api/v1/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            purpose: "email_verification",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // If successful, pharmacy is approved and OTP was sent
        setPharmacyStatus({
          approved: true,
          message:
            "Your pharmacy has been approved by admin! OTP has been sent to your email.",
        });
        setStep(2);
      } else {
        // If failed, pharmacy not approved or doesn't exist
        setPharmacyStatus({
          approved: false,
          message:
            data.message === "User not found"
              ? "Your pharmacy registration is still pending admin approval."
              : data.message ||
                "Your pharmacy registration is still pending admin approval.",
        });
        setStep(2);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleProceedToOTP = () => {
    if (pharmacyStatus?.approved) {
      setStep(3);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
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
        "https://doctors-portal-backend-2.onrender.com/api/v1/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
    setResending(true);
    setError("");

    try {
      const response = await fetch(
        "https://doctors-portal-backend-2.onrender.com/api/v1/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
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
      setResending(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#115E59" }}
      >
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl shadow-2xl p-8 backdrop-blur-sm border"
            style={{
              backgroundColor: "rgba(15, 76, 71, 0.95)",
              borderColor: "rgba(219, 245, 240, 0.2)",
            }}
          >
            <div className="text-center space-y-6">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full"
                style={{ backgroundColor: "#FDE047" }}
              >
                <CheckCircle
                  className="w-10 h-10"
                  style={{ color: "#115E59" }}
                />
              </div>
              <div>
                <h2
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Playfair Display, serif",
                    fontWeight: "700",
                    fontSize: "32px",
                  }}
                >
                  Verification Complete!
                </h2>
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                    marginTop: "8px",
                  }}
                >
                  Your pharmacy account is now fully activated.
                </p>
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                    marginTop: "4px",
                  }}
                >
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#115E59" }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl shadow-2xl p-8 space-y-6 backdrop-blur-sm border"
          style={{
            backgroundColor: "rgba(15, 76, 71, 0.95)",
            borderColor: "rgba(219, 245, 240, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "#FDE047" }}
            >
              <Building className="w-8 h-8" style={{ color: "#115E59" }} />
            </div>
            <h2
              className="text-3xl font-bold"
              style={{
                color: "#DBF5F0",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Pharmacy Account Activation
            </h2>
            <p
              className="mt-2"
              style={{
                color: "rgba(219, 245, 240, 0.8)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Complete email verification to activate your account
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

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Pharmacy Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: "rgba(219, 245, 240, 0.6)" }}
                  />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300 bg-transparent placeholder-gray-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.3)",
                      color: "#DBF5F0",
                      borderColor: "#115E59",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FDE047")}
                    onBlur={(e) => (e.target.style.borderColor = "#115E59")}
                    placeholder="Enter your pharmacy email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={checkingStatus}
                className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "#FDE047",
                  color: "#115E59",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {checkingStatus ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : step === 2 ? (
            <div className="space-y-6">
              <div className="text-center">
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Status for pharmacy with email:
                </p>
                <p
                  className="font-semibold"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {email}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  pharmacyStatus?.approved
                    ? "border-green-400"
                    : "border-yellow-400"
                }`}
                style={{
                  backgroundColor: pharmacyStatus?.approved
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(251, 191, 36, 0.1)",
                }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {pharmacyStatus?.approved ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                  <h3
                    className={`font-medium ${
                      pharmacyStatus?.approved
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {pharmacyStatus?.approved
                      ? "Pharmacy Approved!"
                      : "Pending Approval"}
                  </h3>
                </div>
                <p
                  className={`text-sm ${
                    pharmacyStatus?.approved
                      ? "text-green-300"
                      : "text-yellow-300"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {pharmacyStatus?.message}
                </p>
              </div>

              {pharmacyStatus?.approved ? (
                <button
                  onClick={handleProceedToOTP}
                  className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg active:scale-95"
                  style={{
                    backgroundColor: "#FDE047",
                    color: "#115E59",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Proceed to Enter OTP
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <div
                  className="text-center p-4 rounded-lg"
                  style={{
                    backgroundColor: "rgba(107, 114, 128, 0.1)",
                    color: "rgba(219, 245, 240, 0.8)",
                  }}
                >
                  <p
                    className="text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Please wait for admin approval or contact support if you
                    believe this is an error.
                  </p>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setPharmacyStatus(null);
                    setError("");
                  }}
                  className="text-sm transition-colors duration-300"
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "#FDE047")}
                  onMouseOut={(e) =>
                    (e.target.style.color = "rgba(219, 245, 240, 0.8)")
                  }
                >
                  Change email address
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Enter the 6-digit code sent to
                </p>
                <p
                  className="font-semibold"
                  style={{
                    color: "#DBF5F0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {email}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg transition-all duration-300 bg-transparent"
                      style={{
                        backgroundColor: "rgba(17, 94, 89, 0.3)",
                        color: "#DBF5F0",
                        borderColor: "#115E59",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FDE047")}
                      onBlur={(e) => (e.target.style.borderColor = "#115E59")}
                      placeholder="0"
                    />
                  ))}
                </div>

                <button
                  onClick={handleOtpVerification}
                  disabled={verifying || otp.join("").length !== 6}
                  className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#FDE047",
                    color: "#115E59",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {verifying ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Activate
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div
                  className="text-sm text-center"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <span style={{ color: "rgba(219, 245, 240, 0.8)" }}>
                    Didn't receive the code?{" "}
                  </span>
                  <button
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="font-semibold disabled:opacity-50 transition-colors duration-300"
                    style={{ color: "#FDE047" }}
                    onMouseOver={(e) => (e.target.style.color = "#FEF3C7")}
                    onMouseOut={(e) => (e.target.style.color = "#FDE047")}
                  >
                    {resending ? "Resending..." : "Resend OTP"}
                  </button>
                </div>

                <div
                  className="pt-4 border-t text-center"
                  style={{ borderColor: "rgba(219, 245, 240, 0.2)" }}
                >
                  <button
                    onClick={() => {
                      setStep(2);
                      setOtp(["", "", "", "", "", ""]);
                      setError("");
                    }}
                    className="text-sm transition-colors duration-300"
                    style={{
                      color: "rgba(219, 245, 240, 0.8)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onMouseOver={(e) => (e.target.style.color = "#FDE047")}
                    onMouseOut={(e) =>
                      (e.target.style.color = "rgba(219, 245, 240, 0.8)")
                    }
                  >
                    Go back to approval status
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p
              className="text-sm"
              style={{
                fontFamily: "Inter, sans-serif",
                color: "rgba(219, 245, 240, 0.8)",
              }}
            >
              Already verified?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold transition-colors duration-300"
                style={{ color: "#FDE047" }}
                onMouseOver={(e) => (e.target.style.color = "#FEF3C7")}
                onMouseOut={(e) => (e.target.style.color = "#FDE047")}
              >
                Go to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyEmailVerification;
