import Footer from "../../components/Footer";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getMechanicWorkOrders, startWorkOrder, completeWorkOrder } from "../../utils/mechanicApi";
import { debugToken, testMechanicAPI } from "../../utils/tokenDebug";

// Dummy work orders data
const DUMMY_WORK_ORDERS = [
  {
    vehicleId: 2,
    status: "ASSIGNED",
    description: "Oil change and filter replacement required",
    scheduledAt: "2025-11-14T10:00:00Z",
    startedAt: null,
    completedAt: null,
    estimatedCost: null,
    finalCost: null,
    managerId: null
  },
  {
    vehicleId: 3,
    status: "ASSIGNED",
    description: "Brake pad replacement and wheel alignment",
    scheduledAt: "2025-11-14T14:30:00Z",
    startedAt: null,
    completedAt: null,
    estimatedCost: null,
    finalCost: null,
    managerId: null
  }
];

export default function MechanicDashboard() {
  const [services, setServices] = useState(DUMMY_WORK_ORDERS);
  const [modalData, setModalData] = useState(null); 
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  
  // Extract userId from token in localStorage if available
  const getTokenUserId = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // JWT format: header.payload.signature
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          return payload.userId;
        }
      }
    } catch (e) {
      console.error("Error parsing token:", e);
    }
    return null;
  };
  
  const tokenUserId = getTokenUserId();
  const mechanicId = tokenUserId || user?.id || user?.userId || user?.mechanicId;
  const [searchParams] = useSearchParams();
  const mechanicIdFromQuery = searchParams.get("mechanicId");
  const effectiveMechanicId = mechanicIdFromQuery || mechanicId || 6;
  const STATUS_STYLES = {
    pending:
      "bg-amber-500/15 text-amber-200 border border-amber-200/40 shadow-[0_0_10px_-4px_rgba(251,191,36,0.6)]",
    "in-progress":
      "bg-emerald-500/15 text-emerald-200 border border-emerald-200/40 shadow-[0_0_10px_-4px_rgba(52,211,153,0.6)]",
    completed:
      "bg-sky-500/15 text-sky-200 border border-sky-200/40 shadow-[0_0_10px_-4px_rgba(14,165,233,0.6)]",
  };

  const getStatusLabel = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "Pending";
      case "in-progress":
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status || "Unknown";
    }
  };

  // Debug token on component mount
  useEffect(() => {
    console.log("\n" + "=".repeat(60));
    console.log("🔍 MECHANIC DASHBOARD MOUNTED - DUMMY DATA MODE");
    console.log("=".repeat(60));
    debugToken();
    console.log("Using hardcoded dummy work orders for demonstration");
    console.log("=".repeat(60) + "\n");
  }, []);

  // Dummy data mode - skip API fetch
  useEffect(() => {
    setLoading(false);
    setError(null);
    console.log("✅ Loaded dummy work orders:", services);
  }, []);

  const confirmAction = async () => {
    if (!modalData) return;

    try {
      if (actionType === "do") {
        // Change status to IN_PROGRESS
        setServices((prev) =>
          prev.map((s) =>
            s === modalData
              ? { ...s, status: "IN_PROGRESS" }
              : s
          )
        );
        console.log("✅ Service started - Status changed to IN_PROGRESS");
      } else if (actionType === "complete") {
        // Remove the work order (mark as completed)
        setServices((prev) =>
          prev.filter((s) => s !== modalData)
        );
        console.log("✅ Service completed - Work order removed");
      }

      setModalData(null);
      setActionType(null);
    } catch (err) {
      console.error("Error updating service:", err);
      alert(err?.response?.data?.message || "Failed to update service. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-rubik">
      <div className="navbar px-6 border-b border-white/10 bg-slate-900/70 backdrop-blur-lg">
        <div className="flex-1 text-2xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow">
            PitStopPro
          </span>
        </div>
        <div className="flex gap-4 items-center text-slate-200">
          <div className="avatar placeholder">
            <div className="w-16 h-16 rounded-full border border-cyan-400/50 bg-cyan-500/10 flex items-center justify-center">
              <span className="text-xs font-medium text-center leading-tight">
                Mechanic <br /> Image
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/20">
            Logout
          </button>
        </div>
      </div>

      <div className="px-6 pt-10 pb-16 flex flex-col gap-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.35em] text-sm text-slate-400">
              Mechanic Console
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              Services Queue
            </h1>
            <p className="mt-2 text-slate-300 max-w-xl">
              Stay on top of upcoming jobs, manage progress in real time, and deliver quicker turnarounds with confidence.
            </p>
          </div>
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl px-6 py-4 shadow-[0_18px_40px_-18px_rgba(15,166,233,0.45)]">
            <p className="text-sm text-slate-400 uppercase tracking-wide">
              Snapshot
            </p>
            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-3xl font-semibold text-white">
                  {services.filter((s) => s.status === "ASSIGNED").length}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Awaiting
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">
                  {services.filter((s) => s.status === "IN_PROGRESS").length}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Active
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white">
                  {services.length}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-wide">
                  Total
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Mechanic ID: <span className="text-slate-200 font-semibold">{effectiveMechanicId}</span>
              {mechanicIdFromQuery ? (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/15 text-cyan-200 border border-cyan-200/30 align-middle">from URL</span>
              ) : !mechanicId ? (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-200 border border-amber-200/30 align-middle">fallback</span>
              ) : null}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-cyan-400"></span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <ul className="text-xs text-red-300 space-y-1 mb-4">
              <li>- Ensure you are logged in. Try logging out and logging in again.</li>
              <li>- Verify the account has MECHANIC access for ID {effectiveMechanicId}.</li>
              <li>- If using a cookie-based session, this page requires requests to go via the same origin (proxy is set).</li>
            </ul>
            <button
              className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : services.length > 0 ? (
          services.map((service) => (
            <div
              key={service.serviceOrderId || service.id || Math.random()}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 border border-white/10 rounded-2xl shadow-[0_18px_45px_-18px_rgba(15,166,233,0.6)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="flex items-center gap-5 flex-1">
                <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-3xl flex-shrink-0">
                  🚗
                </div>
                <div className="flex flex-col text-slate-200 font-medium flex-1">
                  <span className="text-xs uppercase tracking-wide text-cyan-400/80 mb-1">
                    Vehicle ID: {service.vehicleId}
                  </span>
                  <span className="text-sm uppercase tracking-wide text-slate-400">
                    Service Details
                  </span>
                  <span className="text-base font-semibold text-white truncate">
                    {service.description || "Service required"}
                  </span>
                  <span className="mt-2 text-sm text-slate-400">
                    Scheduled for{" "}
                    <span className="text-slate-200 font-semibold">
                      {service.scheduledAt ? new Date(service.scheduledAt).toLocaleDateString() + " " + new Date(service.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Not specified"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                    STATUS_STYLES[service.status?.toLowerCase()] || 
                    "bg-slate-500/15 text-slate-200 border border-slate-200/40"
                  }`}
                >
                  {getStatusLabel(service.status?.toLowerCase())}
                </span>
                {(service.status === "ASSIGNED") && (
                  <button
                    className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400"
                    onClick={() => {
                      setModalData(service);
                      setActionType("do");
                    }}
                  >
                    Start Service
                  </button>
                )}
                {(service.status === "IN_PROGRESS") && (
                  <button
                    className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-400 border-none text-slate-900 font-semibold hover:from-emerald-400 hover:to-teal-300"
                    onClick={() => {
                      setModalData(service);
                      setActionType("complete");
                    }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            🎉 All services completed!
          </p>
        )}
      </div>

      <Footer />

      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_18px_40px_-18px_rgba(15,166,233,0.7)] p-6 w-96 text-slate-100">
            <h3 className="text-lg font-semibold mb-4 text-white">
              {actionType === "do"
                ? "Do you really want to start this service?"
                : "Do you want to complete this service?"}
            </h3>
            <div className="flex justify-end gap-3">
            <button
                className="btn btn-sm border-none bg-slate-800 text-slate-200 hover:bg-slate-700"
                onClick={() => {
                setModalData(null);
                setActionType(null);
                }}
            >
                Cancel
            </button>
            <button
                className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400"
                onClick={confirmAction}
            >
                Yes
            </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
