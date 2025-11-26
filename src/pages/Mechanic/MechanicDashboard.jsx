import Footer from "../../components/Footer";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getMechanicWorkOrders, startWorkOrder, completeWorkOrder } from "../../utils/mechanicApi";

export default function MechanicDashboard() {
  const [services, setServices] = useState([]);
  const [modalData, setModalData] = useState(null); 
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  
  // Extract userId from JWT token in localStorage
  const getTokenUserId = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("📋 Decoded JWT payload:", payload);
          return payload.userId || payload.id || payload.sub;
        }
      }
    } catch (e) {
      console.error("❌ Error parsing token:", e);
    }
    return null;
  };
  
  const tokenUserId = getTokenUserId();
  const mechanicId = tokenUserId || user?.id || user?.userId || user?.mechanicId;
  const [searchParams] = useSearchParams();
  const mechanicIdFromQuery = searchParams.get("mechanicId");
  const effectiveMechanicId = mechanicIdFromQuery || mechanicId;
  
  const STATUS_STYLES = {
    open: "bg-amber-500/15 text-amber-200 border border-amber-200/40 shadow-[0_0_10px_-4px_rgba(251,191,36,0.6)]",
    assigned: "bg-amber-500/15 text-amber-200 border border-amber-200/40 shadow-[0_0_10px_-4px_rgba(251,191,36,0.6)]",
    pending: "bg-amber-500/15 text-amber-200 border border-amber-200/40 shadow-[0_0_10px_-4px_rgba(251,191,36,0.6)]",
    in_progress: "bg-emerald-500/15 text-emerald-200 border border-emerald-200/40 shadow-[0_0_10px_-4px_rgba(52,211,153,0.6)]",
    "in-progress": "bg-emerald-500/15 text-emerald-200 border border-emerald-200/40 shadow-[0_0_10px_-4px_rgba(52,211,153,0.6)]",
    completed: "bg-sky-500/15 text-sky-200 border border-sky-200/40 shadow-[0_0_10px_-4px_rgba(14,165,233,0.6)]",
  };

  const getStatusLabel = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "open":
        return "Open";
      case "assigned":
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
    console.log("🔍 MECHANIC DASHBOARD MOUNTED - JWT MODE");
    console.log("=".repeat(60));
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("❌ No token found in localStorage");
    } else {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          console.log("🔐 JWT Token Found:");
          console.log("📋 Payload:", payload);
          console.log("👤 User ID:", payload.userId || payload.id || payload.sub);
          console.log("⏰ Expires:", payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "Unknown");
        }
      } catch (e) {
        console.error("❌ Error decoding token:", e);
      }
    }
    
    console.log("Effective Mechanic ID:", effectiveMechanicId);
    console.log("=".repeat(60) + "\n");
  }, [effectiveMechanicId]);

  // Fetch work orders from API using JWT authentication
  useEffect(() => {
    const fetchWorkOrders = async () => {
      if (!effectiveMechanicId) {
        setError("No mechanic ID available. Please log in.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log("🔄 Fetching work orders for mechanic ID:", effectiveMechanicId);
        const data = await getMechanicWorkOrders(effectiveMechanicId);
        console.log("✅ Work orders fetched successfully:", data);
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching work orders:", err);
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to load work orders";
        setError(errorMessage);
        
        // If authentication error, suggest re-login
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setError("Authentication failed. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [effectiveMechanicId]);

  const confirmAction = async () => {
    if (!modalData) return;

    try {
      // Use serviceOrderId from the API response (it's a string)
      const serviceOrderId = modalData.serviceOrderId;
      
      if (!serviceOrderId) {
        alert("Service order ID not found");
        return;
      }

      if (actionType === "do") {
        console.log("🔄 Starting work order:", serviceOrderId);
        // API expects: POST /api/mechanic/{mechanicId}/workorders/{serviceOrderId}/start
        await startWorkOrder(effectiveMechanicId, serviceOrderId);
        
        // Update local state to IN_PROGRESS
        setServices((prev) =>
          prev.map((s) =>
            s.serviceOrderId === serviceOrderId
              ? { ...s, status: "IN_PROGRESS", startedAt: new Date().toISOString() }
              : s
          )
        );
        console.log("✅ Work order started successfully");
        
      } else if (actionType === "complete") {
        console.log("🔄 Completing work order:", serviceOrderId);
        // API expects: POST /api/mechanic/{mechanicId}/workorders/{serviceOrderId}/complete
        await completeWorkOrder(effectiveMechanicId, serviceOrderId);
        
        // Remove from list after completion
        setServices((prev) =>
          prev.filter((s) => s.serviceOrderId !== serviceOrderId)
        );
        console.log("✅ Work order completed successfully");
      }

      setModalData(null);
      setActionType(null);
      
    } catch (err) {
      console.error("❌ Error updating work order:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update service";
      alert(errorMessage);
      
      // If authentication error during action
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        alert("Session expired. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }, 1500);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
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
          <button 
            className="btn btn-outline btn-sm border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/20"
            onClick={handleLogout}
          >
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
                  {services.filter((s) => s.status === "OPEN" || s.status === "ASSIGNED" || s.status === "PENDING").length}
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
              Mechanic ID: <span className="text-slate-200 font-semibold">{effectiveMechanicId || "Not set"}</span>
              {mechanicIdFromQuery ? (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/15 text-cyan-200 border border-cyan-200/30 align-middle">from URL</span>
              ) : tokenUserId ? (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-200 border border-emerald-200/30 align-middle">from JWT</span>
              ) : (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-200 border border-amber-200/30 align-middle">from Redux</span>
              )}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              API: Port 9007 (Mechanic Service)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-cyan-400"></span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-400 text-lg mb-4">⚠️ {error}</p>
            <ul className="text-xs text-red-300 space-y-1 mb-4 max-w-md">
              <li>✓ Ensure you are logged in with a valid JWT token</li>
              <li>✓ Verify the token is stored in localStorage as "authToken"</li>
              <li>✓ Check that your account has MECHANIC role/permissions</li>
              <li>✓ Confirm backend services are running:</li>
              <li className="ml-4">- Port 9007: Mechanic Service API</li>
              <li className="ml-4">- Port 9002: Login/Auth Service</li>
              <li>✓ Mechanic ID being used: {effectiveMechanicId || "None"}</li>
            </ul>
            <div className="flex gap-3">
              <button
                className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
              <button
                className="btn btn-sm btn-outline border-red-400/60 text-red-200 hover:bg-red-500/20"
                onClick={handleLogout}
              >
                Re-login
              </button>
            </div>
          </div>
        ) : services.length > 0 ? (
          services.map((service) => {
            const serviceOrderId = service.serviceOrderId;
            return (
              <div
                key={serviceOrderId || Math.random()}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 border border-white/10 rounded-2xl shadow-[0_18px_45px_-18px_rgba(15,166,233,0.6)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-3xl flex-shrink-0">
                    🚗
                  </div>
                  <div className="flex flex-col text-slate-200 font-medium flex-1">
                    <span className="text-xs uppercase tracking-wide text-cyan-400/80 mb-1">
                      Vehicle ID: {service.vehicleId || "N/A"}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      Order ID: {serviceOrderId || "N/A"}
                    </span>
                    <span className="text-sm uppercase tracking-wide text-slate-400 mt-1">
                      Service Details
                    </span>
                    <span className="text-base font-semibold text-white truncate">
                      {service.description || "Service required"}
                    </span>
                    <span className="mt-2 text-sm text-slate-400">
                      Scheduled for{" "}
                      <span className="text-slate-200 font-semibold">
                        {service.scheduledAt 
                          ? new Date(service.scheduledAt).toLocaleDateString() + " " + 
                            new Date(service.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                          : "Not specified"}
                      </span>
                    </span>
                    {service.estimatedCost && (
                      <span className="mt-1 text-sm text-slate-400">
                        Estimated: <span className="text-emerald-300 font-semibold">₹{service.estimatedCost}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                      STATUS_STYLES[service.status?.toLowerCase()] || 
                      "bg-slate-500/15 text-slate-200 border border-slate-200/40"
                    }`}
                  >
                    {getStatusLabel(service.status)}
                  </span>
                  {service.status === "OPEN" && (
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
                  {service.status === "IN_PROGRESS" && (
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
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl text-slate-300 font-semibold">All services completed!</p>
            <p className="text-sm text-slate-400 mt-2">Great work! No pending work orders.</p>
          </div>
        )}
      </div>

      <Footer />

      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_18px_40px_-18px_rgba(15,166,233,0.7)] p-6 w-96 text-slate-100">
            <h3 className="text-lg font-semibold mb-2 text-white">
              {actionType === "do"
                ? "Start Service?"
                : "Complete Service?"}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {actionType === "do"
                ? "This will mark the work order as IN_PROGRESS."
                : "This will mark the work order as completed and remove it from your queue."}
            </p>
            <div className="bg-slate-900/50 border border-white/5 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-400">Service Order ID</p>
              <p className="text-sm text-white font-semibold">
                {modalData.serviceOrderId}
              </p>
              <p className="text-xs text-slate-400 mt-2">Vehicle ID</p>
              <p className="text-sm text-white font-semibold">{modalData.vehicleId}</p>
              <p className="text-xs text-slate-400 mt-2">Service</p>
              <p className="text-sm text-white">{modalData.description}</p>
            </div>
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
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}