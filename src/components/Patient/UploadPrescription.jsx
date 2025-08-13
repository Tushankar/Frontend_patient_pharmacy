import React, { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const UploadPrescription = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("patientNotes", notes);

    try {
      const res = await axiosInstance.post(
        "/patients/prescriptions/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onUpload && onUpload(res.data.data);
      setFile(null);
      setDescription("");
      setNotes("");
    } catch (err) {
      console.error(
        "Upload error:",
        err.response?.data?.error || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl shadow-xl p-8 border relative overflow-hidden group"
      style={{
        backgroundColor: "#CAE7E1",
        borderColor: "rgba(37, 108, 92, 0.2)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 25% 25%, #FDE047 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, #FACC15 0%, transparent 50%)`,
        }}
      />
      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="p-4 rounded-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                boxShadow: "0 10px 25px rgba(253, 224, 71, 0.3)",
              }}
            >
              <Upload
                className="w-7 h-7"
                style={{ color: "#256C5C" }}
              />
            </div>
            <div>
              <h2
                className="text-3xl font-bold mb-2 font-bebas tracking-wide"
                style={{
                  color: "#256C5C",
                }}
              >
                Upload Prescription
              </h2>
              <p
                className="text-lg font-inter"
                style={{
                  color: "rgba(37, 108, 92, 0.8)",
                }}
              >
                Share your prescription with healthcare providers for quick
                processing
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto rounded-xl mb-2 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)",
                }}
              >
                <FileText
                  className="w-6 h-6"
                  style={{ color: "#000000" }}
                />
              </div>
              <p
                className="text-sm font-medium font-inter"
                style={{
                  color: "rgba(37, 108, 92, 0.8)",
                }}
              >
                PDF & Images
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto rounded-xl mb-2 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)",
                }}
              >
                <CheckCircle
                  className="w-6 h-6"
                  style={{ color: "#22C55E" }}
                />
              </div>
              <p
                className="text-sm font-medium font-inter"
                style={{
                  color: "rgba(37, 108, 92, 0.8)",
                }}
              >
                Secure Upload
              </p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 mx-auto rounded-xl mb-2 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(253, 224, 71, 0.1) 100%)",
                }}
              >
                <AlertCircle
                  className="w-6 h-6"
                  style={{ color: "#000000" }}
                />
              </div>
              <p
                className="text-sm font-medium font-inter"
                style={{
                  color: "rgba(37, 108, 92, 0.8)",
                }}
              >
                Fast Processing
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div
            className="relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 group/upload"
            style={{
              borderColor: dragActive
                ? "#256C5C"
                : file
                ? "#22C55E"
                : "rgba(37, 108, 92, 0.4)",
              backgroundColor: dragActive
                ? "rgba(37, 108, 92, 0.15)"
                : file
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(37, 108, 92, 0.08)",
              boxShadow: dragActive
                ? "0 0 30px rgba(37, 108, 92, 0.3)"
                : file
                ? "0 0 30px rgba(34, 197, 94, 0.2)"
                : "0 0 0 rgba(37, 108, 92, 0)",
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onMouseEnter={(e) => {
              if (!file && !dragActive) {
                e.target.style.borderColor = "#256C5C";
                e.target.style.backgroundColor = "rgba(37, 108, 92, 0.15)";
                e.target.style.boxShadow = "0 0 30px rgba(37, 108, 92, 0.2)";
                e.target.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!file && !dragActive) {
                e.target.style.borderColor = "rgba(37, 108, 92, 0.4)";
                e.target.style.backgroundColor = "rgba(37, 108, 92, 0.08)";
                e.target.style.boxShadow = "0 0 0 rgba(37, 108, 92, 0)";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div
                  className="p-6 rounded-2xl mb-6 relative"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)",
                    border: "2px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <CheckCircle
                    className="w-16 h-16"
                    style={{ color: "#22C55E" }}
                  />
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "#22C55E" }}
                  >
                    <span className="text-white text-xs font-bold">
                      ✓
                    </span>
                  </div>
                </div>
                <p
                  className="text-xl font-bold mb-3 font-inter"
                  style={{
                    color: "#256C5C",
                  }}
                >
                  File Ready for Upload
                </p>
                <p
                  className="text-lg font-medium mb-2 font-inter"
                  style={{
                    color: "rgba(37, 108, 92, 0.8)",
                  }}
                >
                  {file.name}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div
                    className="px-4 py-2 rounded-xl"
                    style={{
                      background: "rgba(37, 108, 92, 0.2)",
                      color: "#256C5C",
                    }}
                  >
                    <span className="text-sm font-medium font-inter">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-inter"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#EF4444",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    Change File
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  className="p-8 rounded-3xl mb-6 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(37, 108, 92, 0.2) 0%, rgba(37, 108, 92, 0.1) 100%)",
                    border: "2px solid rgba(37, 108, 92, 0.3)",
                  }}
                >
                  <Upload
                    className="w-20 h-20 transition-transform duration-300 group-hover/upload:scale-110"
                    style={{ color: "#256C5C" }}
                  />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at center, #256C5C 0%, transparent 70%)`,
                    }}
                  />
                </div>
                <p
                  className="text-2xl font-bold mb-4 font-inter"
                  style={{
                    color: "#256C5C",
                  }}
                >
                  Drop your prescription here
                </p>
                <p
                  className="text-lg mb-6 font-inter"
                  style={{
                    color: "rgba(37, 108, 92, 0.8)",
                  }}
                >
                  or{" "}
                  <span style={{ color: "#256C5C", fontWeight: "600" }}>
                    click to browse
                  </span>{" "}
                  your files
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    style={{
                      color: "rgba(37, 108, 92, 0.7)",
                    }}
                  >
                    Supports:
                  </span>
                  <div className="flex gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium font-inter"
                      style={{
                        background: "rgba(37, 108, 92, 0.2)",
                        color: "#256C5C",
                      }}
                    >
                      JPG
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium font-inter"
                      style={{
                        background: "rgba(37, 108, 92, 0.2)",
                        color: "#256C5C",
                      }}
                    >
                      PNG
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium font-inter"
                      style={{
                        background: "rgba(37, 108, 92, 0.2)",
                        color: "#256C5C",
                      }}
                    >
                      PDF
                    </span>
                  </div>
                  <span
                    style={{
                      color: "rgba(37, 108, 92, 0.6)",
                    }}
                  >
                    (Max 10MB)
                  </span>
                </div>
              </div>
            )}
            <input
              ref={(input) => {
                if (input) {
                  input.addEventListener("change", handleFileChange);
                }
              }}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              className="block text-sm font-medium mb-2 font-inter"
              style={{
                color: "#256C5C",
              }}
            >
              Description
            </label>
            <input
              type="text"
              placeholder="Brief description of the prescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl transition-all duration-200 font-inter"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "2px solid rgba(37, 108, 92, 0.3)",
                color: "#256C5C",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#256C5C";
                e.target.style.boxShadow = "0 0 0 3px rgba(37, 108, 92, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(37, 108, 92, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Notes Field */}
          <div>
            <label
              className="block text-sm font-medium mb-2 font-inter"
              style={{
                color: "#256C5C",
              }}
            >
              Additional Notes
            </label>
            <textarea
              placeholder="Any special instructions or notes for the pharmacy"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl transition-all duration-200 resize-none font-inter"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "2px solid rgba(37, 108, 92, 0.3)",
                color: "#256C5C",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#256C5C";
                e.target.style.boxShadow = "0 0 0 3px rgba(37, 108, 92, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(37, 108, 92, 0.3)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div
              className="flex items-center gap-2 text-sm font-inter"
              style={{ color: "rgba(37, 108, 92, 0.7)" }}
            >
              <AlertCircle
                className="w-4 h-4"
                style={{ color: "#256C5C" }}
              />
              <span>Ensure prescription is clear and readable</span>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 font-inter"
              style={{
                background:
                  loading || !file
                    ? "rgba(156, 163, 175, 0.3)"
                    : "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)",
                color: loading || !file ? "#9CA3AF" : "#256C5C",
                cursor: loading || !file ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading && file) {
                  e.target.style.background =
                    "linear-gradient(135deg, #FACC15 0%, #EAB308 100%)";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 10px 25px rgba(253, 224, 71, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && file) {
                  e.target.style.background =
                    "linear-gradient(135deg, #FDE047 0%, #FACC15 100%)";
                  e.target.style.transform = "translateY(0px)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPrescription;