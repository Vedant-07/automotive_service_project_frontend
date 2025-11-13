import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const SubmitFeedback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector((s) => s.user);
  const customerId = user?.userId;
  const token = user?.token;

  const serviceOrderId = searchParams.get("serviceOrderId") || "";

  const [formData, setFormData] = useState({
    serviceOrderId: serviceOrderId,
    subject: "",
    message: "",
    type: "FEEDBACK", // FEEDBACK or COMPLAINT
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!customerId) {
      navigate("/customer");
    }
  }, [customerId, navigate]);

  // ====== API helper for feedback submission ======
  const submitFeedback = async (customerId, feedbackData, token) => {
    try {
      const url = `http://localhost:9005/api/customers/${customerId}/feedbacks`;
      const resp = await axios.post(url, feedbackData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return { data: resp.data, error: null };
    } catch (err) {
      console.error("Error submitting feedback:", err);
      return {
        data: null,
        error: err.response?.data || { message: err.message },
      };
    }
  };

  // ====== Handlers ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.subject || formData.subject.trim().length === 0) {
      return "Subject is required.";
    }
    if (formData.subject.length > 200) {
      return "Subject must not exceed 200 characters.";
    }
    if (!formData.message || formData.message.trim().length === 0) {
      return "Message is required.";
    }
    if (formData.message.length > 2000) {
      return "Message must not exceed 2000 characters.";
    }
    if (!formData.type) {
      return "Please select feedback type.";
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

    if (!token) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    setLoading(true);

    const feedbackData = {
      serviceOrderId: formData.serviceOrderId || null,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      type: formData.type,
    };

    const { data, error: apiError } = await submitFeedback(
      customerId,
      feedbackData,
      token
    );

    setLoading(false);

    if (apiError) {
      const errorMessage =
        apiError.message ||
        apiError.error ||
        "Failed to submit feedback. Please try again.";
      setError(errorMessage);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate("/customer/feedbacks");
      }, 2000);
    }
  };

  // ====== JSX ======
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => navigate("/customer")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            Submit Feedback / Complaint
          </h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <span>
                {formData.type === "COMPLAINT"
                  ? "Complaint submitted successfully! Redirecting..."
                  : "Feedback submitted successfully! Redirecting..."}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Type *</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="FEEDBACK">Feedback</option>
                <option value="COMPLAINT">Complaint</option>
              </select>
            </div>

            {serviceOrderId && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Order ID</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceOrderId}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Subject *</span>
                <span className="label-text-alt">
                  {formData.subject.length}/200 characters
                </span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className="input input-bordered w-full"
                required
                maxLength={200}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Message *</span>
                <span className="label-text-alt">
                  {formData.message.length}/2000 characters
                </span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your feedback or complaint details"
                className="textarea textarea-bordered h-32"
                required
                maxLength={2000}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : formData.type === "COMPLAINT"
                  ? "Submit Complaint"
                  : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedback;
