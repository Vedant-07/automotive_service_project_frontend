// src/pages/customer/ServiceStatus.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { VITE_API_HOST } = import.meta.env;

const ServiceStatus = () => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);
  const customerId = user?.userId;
  const token = user?.token;

  const [serviceStatuses, setServiceStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      navigate("/customer");
      return;
    }

    if (!token) {
      setError("You must be logged in to view service status.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchServiceStatus = async () => {
      setLoading(true);
      setError(null);

      const url = `${VITE_API_HOST}:9005/api/customers/${customerId}/service-status`;

      try {
        const resp = await axios.get(url, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        setServiceStatuses(resp.data || []);
      } catch (err) {
        // ignore cancellations
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch service status:", err);

        const apiErr = err?.response?.data;
        const msg =
          apiErr?.message ||
          apiErr?.error ||
          (err?.response ? `HTTP ${err.response.status}` : err.message) ||
          "Failed to load service status. Please try again.";

        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceStatus();

    return () => {
      controller.abort();
    };
  }, [customerId, token, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("open")) {
      return <span className="badge badge-warning">OPEN</span>;
    }
    if (statusLower.includes("progress") || statusLower.includes("in_progress")) {
      return <span className="badge badge-info">IN PROGRESS</span>;
    }
    if (statusLower.includes("complete") || statusLower.includes("completed")) {
      return <span className="badge badge-success">COMPLETED</span>;
    }
    return <span className="badge badge-ghost">{status || "UNKNOWN"}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => navigate("/customer")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Service Status</h1>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && serviceStatuses.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <p className="text-gray-500 text-lg">
              No service bookings found. Book a service to see status here.
            </p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate("/customer/vehicles")}
            >
              Book a Service
            </button>
          </div>
        </div>
      )}

      {!loading && !error && serviceStatuses.length > 0 && (
        <div className="grid gap-4">
          {serviceStatuses.map((status, index) => (
            <div key={index} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        {status.registrationNumber || "N/A"}
                      </h3>
                      {getStatusBadge(status.serviceStatus)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Booking Date:</span>{" "}
                        <span className="font-medium">
                          {formatDate(status.serviceBookingDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Booking Status:</span>{" "}
                        <span className="font-medium">
                          {status.bookingStatus ? "✅ Booked" : "❌ Not Booked"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Service Completed:</span>{" "}
                        <span className="font-medium">
                          {status.serviceCompleted ? "✅ Yes" : "⏳ No"}
                        </span>
                      </div>
                      {status.serviceManager && (
                        <div>
                          <span className="text-gray-500">Service Manager ID:</span>{" "}
                          <span className="font-medium">{status.serviceManager}</span>
                        </div>
                      )}
                      {status.mechanicAssigned && (
                        <div>
                          <span className="text-gray-500">Mechanic ID:</span>{" "}
                          <span className="font-medium">
                            {status.mechanicAssigned}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {status.serviceCompleted && (
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => navigate(`/customer/feedbacks/submit`)}
                      >
                        Leave Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceStatus;
