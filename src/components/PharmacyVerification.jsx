import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PharmacyVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
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

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`pharmacy-otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`pharmacy-otp-${index - 1}`)?.focus();
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
      // Simple OTP verification - keeping same backend structure
      const response = await fetch(
        "https://doctors-portal-backend-2.onrender.com/api/v1/auth/verify-pharmacy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            otp: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
        "https://doctors-portal-backend-2.onrender.com/api/v1/auth/resend-pharmacy-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setOtp(["", "", "", "", "", ""]);
        alert("OTP has been resent!");
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
            className="rounded-2xl shadow-2xl p-8 backdrop-blur-lg border"
            style={{
              backgroundColor: "rgba(15, 76, 71, 0.95)",
              borderColor: "rgba(219, 245, 240, 0.2)",
            }}
          >
            <div className="text-center space-y-6">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full"
                style={{ backgroundColor: "rgba(253, 224, 71, 0.2)" }}
              >
                <CheckCircle
                  className="w-10 h-10"
                  style={{ color: "#FDE047" }}
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
                  Pharmacy Verified!
                </h2>
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                    marginTop: "8px",
                  }}
                >
                  Your pharmacy has been successfully verified.
                </p>
                <p
                  style={{
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                    marginTop: "4px",
                  }}
                >
                  Redirecting to login...
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border-2"
                style={{
                  backgroundColor: "#FDE047",
                  color: "#115E59",
                  borderColor: "#FDE047",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FACC15";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 20px rgba(253, 224, 71, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FDE047";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Return to Login
                <ChevronRight className="w-5 h-5" />
              </button>
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
          className="rounded-2xl shadow-2xl p-8 backdrop-blur-lg border"
          style={{
            backgroundColor: "rgba(15, 76, 71, 0.95)",
            borderColor: "rgba(219, 245, 240, 0.2)",
          }}
        >
          <div className="space-y-6">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: "rgba(253, 224, 71, 0.2)" }}
              >
                <Shield className="w-8 h-8" style={{ color: "#FDE047" }} />
              </div>
              <h2
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Playfair Display, serif",
                  fontWeight: "700",
                  fontSize: "28px",
                }}
              >
                Verify Pharmacy
              </h2>
              <p
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                  fontFamily: "Inter, sans-serif",
                  marginTop: "8px",
                }}
              >
                Enter the 6-digit verification code sent to your pharmacy email
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
                <p
                  style={{
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`pharmacy-otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg transition-all duration-300 bg-transparent placeholder-gray-300"
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
                className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border-2"
                style={{
                  backgroundColor: "#FDE047",
                  color: "#115E59",
                  borderColor: "#FDE047",
                  fontFamily: "Inter, sans-serif",
                  opacity: verifying || otp.join("").length !== 6 ? 0.5 : 1,
                  cursor:
                    verifying || otp.join("").length !== 6
                      ? "not-allowed"
                      : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!verifying && otp.join("").length === 6) {
                    e.target.style.backgroundColor = "#FACC15";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 8px 20px rgba(253, 224, 71, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!verifying && otp.join("").length === 6) {
                    e.target.style.backgroundColor = "#FDE047";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {verifying ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Pharmacy
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div
                style={{
                  fontSize: "14px",
                  color: "rgba(219, 245, 240, 0.8)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="font-semibold transition-colors duration-300"
                  style={{
                    color: "#FDE047",
                    opacity: resending ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!resending) e.target.style.color = "#FACC15";
                  }}
                  onMouseLeave={(e) => {
                    if (!resending) e.target.style.color = "#FDE047";
                  }}
                >
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              <div
                className="pt-4 border-t"
                style={{ borderColor: "rgba(219, 245, 240, 0.2)" }}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium transition-colors duration-300"
                  style={{
                    fontSize: "14px",
                    color: "rgba(219, 245, 240, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#DBF5F0")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(219, 245, 240, 0.8)")
                  }
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyVerification;
