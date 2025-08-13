import React, { useState, createContext, useContext, useEffect } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Stethoscope,
  ChevronRight,
  CheckCircle,
  X,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  console.log("AuthProvider initialized with user:", user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize loading state based on localStorage user
    setLoading(false);
  }, []);

  const checkAuth = async () => {
    console.log("checkAuth: sending /api/v1/auth/me request");
    try {
      const response = await fetch("/api/v1/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("checkAuth: authenticated user:", data.data);
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        }
      } else if (response.status === 401) {
        localStorage.removeItem("user");
        console.log("checkAuth: user not authenticated (401)");
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log("login: sending credentials", { email, password });
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      console.log("login: response data", data);
      if (response.ok && data.success) {
        console.log("login: setting user", data.user);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Store the token if returned
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("login: token stored in localStorage");
        }
        navigate("/dashboard");
      }
      return { response, data };
    } catch (error) {
      console.error("login error:", error);
      return {
        response: { ok: false },
        data: { message: "Network error. Please try again." },
      };
    }
  };

  const register = async (userData) => {
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Store the token if returned
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("register: token stored in localStorage");
      }
    }
    return { response, data };
  };

  const logout = async () => {
    console.log("logout: current user", user);
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("logout: user cleared");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Toast Component
const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        )}
        <p
          className={`text-sm font-medium ${
            type === "success" ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-4 ${
            type === "success"
              ? "text-green-600 hover:text-green-800"
              : "text-red-600 hover:text-red-800"
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Login Component
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [resetPasswordData, setResetPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: otp & new password
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const { login } = useAuth();

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Check for saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { response, data } = await login(formData.email, formData.password);

      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Handle successful login
        console.log("Login successful:", data);
        setToastMessage("Login successful! Redirecting...");
        setShowToast(true);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setForgotPasswordLoading(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage("OTP sent to your email!");
        setShowToast(true);
        setForgotPasswordStep(2);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          otp: resetPasswordData.otp,
          newPassword: resetPasswordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage(
          "Password reset successful! Please login with your new password."
        );
        setShowToast(true);
        setShowForgotPassword(false);
        setForgotPasswordStep(1);
        setResetPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
        setForgotPasswordEmail("");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

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
                <Stethoscope className="w-8 h-8" style={{ color: "#115E59" }} />
              </div>
              <h2
                className="text-3xl font-bold"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Welcome Back
              </h2>
              <p
                className="mt-2"
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Sign in to your account to continue
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
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-300 bg-transparent placeholder-gray-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.3)",
                      color: "#DBF5F0",
                      borderColor: "#115E59",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FDE047")}
                    onBlur={(e) => (e.target.style.borderColor = "#115E59")}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
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
                    className="w-full pl-10 pr-12 py-3 border-2 rounded-lg transition-all duration-300 bg-transparent placeholder-gray-300"
                    style={{
                      backgroundColor: "rgba(17, 94, 89, 0.3)",
                      color: "#DBF5F0",
                      borderColor: "#115E59",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FDE047")}
                    onBlur={(e) => (e.target.style.borderColor = "#115E59")}
                    placeholder="Enter your password"
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
                    onMouseOver={(e) => (e.target.style.color = "#FDE047")}
                    onMouseOut={(e) =>
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

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded transition-colors duration-300 focus:ring-2 focus:ring-yellow-400"
                    style={{
                      accentColor: "#FDE047",
                      backgroundColor: rememberMe
                        ? "#FDE047"
                        : "rgba(17, 94, 89, 0.3)",
                      borderColor: "#115E59",
                      borderWidth: "2px",
                    }}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span
                    className="ml-2 text-sm"
                    style={{
                      color: "rgba(219, 245, 240, 0.8)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium transition-colors duration-300 transform hover:scale-105"
                  style={{ color: "#FDE047" }}
                  onMouseOver={(e) => (e.target.style.color = "#FEF3C7")}
                  onMouseOut={(e) => (e.target.style.color = "#FDE047")}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: "#FDE047",
                  color: "#115E59",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseOver={(e) =>
                  !loading && (e.target.style.backgroundColor = "#FEF3C7")
                }
                onMouseOut={(e) =>
                  !loading && (e.target.style.backgroundColor = "#FDE047")
                }
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "#115E59" }}
                  />
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Pharmacy Verification Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => navigate("/pharmacy-email-verification")}
                className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 hover:shadow-lg active:scale-95 border-2"
                style={{
                  backgroundColor: "transparent",
                  color: "#DBF5F0",
                  borderColor: "#DBF5F0",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(219, 245, 240, 0.1)";
                  e.target.style.borderColor = "#FDE047";
                  e.target.style.color = "#FDE047";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.borderColor = "#DBF5F0";
                  e.target.style.color = "#DBF5F0";
                }}
              >
                <Shield className="w-5 h-5" />
                Pharmacy Verification
              </button>
            </div>

            <div className="text-center">
              <p
                style={{
                  color: "rgba(219, 245, 240, 0.8)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-semibold transition-colors duration-300 transform hover:scale-105"
                  style={{ color: "#FDE047" }}
                  onMouseOver={(e) => (e.target.style.color = "#FEF3C7")}
                  onMouseOut={(e) => (e.target.style.color = "#FDE047")}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="rounded-2xl shadow-2xl p-8 w-full max-w-md backdrop-blur-sm border"
            style={{
              backgroundColor: "rgba(15, 76, 71, 0.95)",
              borderColor: "rgba(219, 245, 240, 0.2)",
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-bold"
                style={{
                  color: "#DBF5F0",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {forgotPasswordStep === 1
                  ? "Forgot Password"
                  : "Reset Password"}
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordStep(1);
                  setError("");
                  setResetPasswordData({
                    otp: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="transition-colors duration-300"
                style={{ color: "rgba(219, 245, 240, 0.6)" }}
                onMouseOver={(e) => (e.target.style.color = "#FDE047")}
                onMouseOut={(e) =>
                  (e.target.style.color = "rgba(219, 245, 240, 0.6)")
                }
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {forgotPasswordStep === 1 ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {forgotPasswordLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter 6-digit OTP"
                    value={resetPasswordData.otp}
                    onChange={(e) =>
                      setResetPasswordData({
                        ...resetPasswordData,
                        otp: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength="6"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter new password"
                      value={resetPasswordData.newPassword}
                      onChange={(e) =>
                        setResetPasswordData({
                          ...resetPasswordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength="6"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Confirm new password"
                      value={resetPasswordData.confirmPassword}
                      onChange={(e) =>
                        setResetPasswordData({
                          ...resetPasswordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {forgotPasswordLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Reset Password
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
