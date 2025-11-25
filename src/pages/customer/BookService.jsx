// src/pages/customer/BookService.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const { VITE_API_HOST } = import.meta.env;

const BookService = () => {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const user = useSelector((s) => s.user);
  const customerId = user?.userId;
  const token = user?.token;

  const [formData, setFormData] = useState({
    description: "",
    scheduledAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!customerId || !vehicleId) {
      navigate("/customer/vehicles");
    }
  }, [customerId, vehicleId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.description || formData.description.trim().length < 50) {
      return "Description must be at least 50 characters.";
    }
    if (formData.description.length > 2000) {
      return "Description must not exceed 2000 characters.";
    }
    if (!formData.scheduledAt) {
      return "Please select a scheduled date and time.";
    }
    const scheduledDate = new Date(formData.scheduledAt);
    if (scheduledDate < new Date()) {
      return "Scheduled date must be in the future.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!customerId || !vehicleId) {
      setError("Missing customer or vehicle information.");
      return;
    }

    if (!token) {
      setError("You must be logged in to book a service.");
      return;
    }

    setLoading(true);

    // Format the date for backend (ISO 8601)
    const scheduledDate = new Date(formData.scheduledAt);
    const isoString = scheduledDate.toISOString();

    const workOrderData = {
      description: formData.description.trim(),
      scheduledAt: isoString,
    };

    const url = `${VITE_API_HOST}:9005/api/customers/${customerId}/vehicles/${vehicleId}/workorders`;

    try {
      const resp = await axios.post(url, workOrderData, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);

      // success
      setSuccess(true);
      setTimeout(() => {
        navigate("/customer/service-status");
      }, 2000);
    } catch (err) {
      setLoading(false);
      console.error("Book service failed:", err);

      // prefer structured server error if present
      const apiError =
        err?.response?.data ||
        (err?.response ? { message: `HTTP ${err.response.status}` } : { message: err.message });

      const errorMessage = apiError.message || apiError.error || "Failed to book service. Please try again.";
      setError(errorMessage);
    }
  };

  // Get minimum datetime (current time + 1 hour)
  const now = new Date();
  const minDateTime = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
    .toISOString()
    .slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => navigate("/customer/vehicles")}
        >
          ← Back to Vehicles
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Book Service</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <span>Service booked successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Service Description *</span>
                <span className="label-text-alt">
                  {formData.description.length}/2000 characters
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the service needed (minimum 50 characters)"
                className="textarea textarea-bordered h-32"
                required
                minLength={50}
                maxLength={2000}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Minimum 50 characters, maximum 2000 characters
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Scheduled Date & Time *</span>
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                min={minDateTime}
                className="input input-bordered w-full"
                required
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Select a date and time at least 1 hour from now
                </span>
              </label>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Booking Service..." : "Book Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;