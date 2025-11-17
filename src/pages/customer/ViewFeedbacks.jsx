// src/pages/customer/ViewFeedbacks.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const { VITE_API_HOST } = import.meta.env;
// runtime-friendly VITE_API_HOST fallback used earlier
const VITE_API_HOST =
  (globalThis.__vite_import_meta__ &&
    globalThis.__vite_import_meta__.env &&
    globalThis.__vite_import_meta__.env.VITE_API_HOST) ||
  (typeof process !== "undefined" && process.env.VITE_API_HOST) ||
  "";

const ViewFeedbacks = () => {
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);
  const customerId = user?.userId;
  const token = user?.token;

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      navigate("/customer");
      return;
    }

    if (!token) {
      setError("You must be logged in to view feedbacks.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      const url = `${VITE_API_HOST}:9005/api/customers/${customerId}/feedbacks`;

      try {
        const resp = await axios.get(url, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        setFeedbacks(resp.data || []);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          // request was aborted — ignore
          return;
        }

        console.error("Failed to fetch feedbacks:", err);
        const apiErr = err?.response?.data;
        const msg =
          apiErr?.message ||
          apiErr?.error ||
          (err?.response ? `HTTP ${err.response.status}` : err.message) ||
          "Failed to load feedbacks. Please try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();

    return () => controller.abort();
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

  const getTypeBadge = (type) => {
    if (type === "COMPLAINT") {
      return <span className="badge badge-error">COMPLAINT</span>;
    }
    return <span className="badge badge-info">FEEDBACK</span>;
  };

  const getStatusBadge = (status) => {
    const statusUpper = status?.toUpperCase() || "";
    if (statusUpper === "OPEN") {
      return <span className="badge badge-warning">OPEN</span>;
    }
    if (statusUpper === "IN_PROGRESS" || statusUpper === "IN PROGRESS") {
      return <span className="badge badge-info">IN PROGRESS</span>;
    }
    if (statusUpper === "RESOLVED") {
      return <span className="badge badge-success">RESOLVED</span>;
    }
    return <span className="badge badge-ghost">{status || "UNKNOWN"}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <button className="btn btn-outline btn-primary" onClick={() => navigate("/customer")}>
          ← Back to Dashboard
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/customer/feedbacks/submit")}>
          Submit New Feedback
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">My Feedbacks & Complaints</h1>

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

      {!loading && !error && feedbacks.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <p className="text-gray-500 text-lg">No feedbacks or complaints yet.</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate("/customer/feedbacks/submit")}>
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {!loading && !error && feedbacks.length > 0 && (
        <div className="grid gap-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{feedback.subject || "No Subject"}</h3>
                      {getTypeBadge(feedback.type)}
                      {getStatusBadge(feedback.status)}
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{feedback.message}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                      <div>
                        <span>Created:</span>{" "}
                        <span className="font-medium">{formatDate(feedback.createdAt)}</span>
                      </div>
                      {feedback.updatedAt && (
                        <div>
                          <span>Updated:</span>{" "}
                          <span className="font-medium">{formatDate(feedback.updatedAt)}</span>
                        </div>
                      )}
                      {feedback.serviceOrderId && (
                        <div>
                          <span>Service Order ID:</span>{" "}
                          <span className="font-medium">{feedback.serviceOrderId}</span>
                        </div>
                      )}
                      {feedback.assignedAgentId && (
                        <div>
                          <span>Assigned Agent ID:</span>{" "}
                          <span className="font-medium">{feedback.assignedAgentId}</span>
                        </div>
                      )}
                    </div>

                    {feedback.agentResponse && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Agent Response:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{feedback.agentResponse}</p>
                      </div>
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

export default ViewFeedbacks;
