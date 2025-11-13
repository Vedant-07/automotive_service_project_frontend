import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { serviceManagerApi } from "../../utils/api";

const WorkOrderDetail = () => {
  const navigate = useNavigate();
  const { serviceOrderId } = useParams();
  const user = useSelector((s) => s.user);
  const managerId = user?.userId;

  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for actions
  const [assignMechanicForm, setAssignMechanicForm] = useState({
    mechanicId: "",
    estimatedCost: "",
  });
  const [finalCost, setFinalCost] = useState("");
  const [showAssignMechanic, setShowAssignMechanic] = useState(false);
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  useEffect(() => {
    if (!serviceOrderId) {
      navigate("/serviceManager");
      return;
    }

    const fetchWorkOrder = async () => {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await serviceManagerApi.getWorkOrder(
        serviceOrderId
      );

      setLoading(false);

      if (apiError) {
        setError(
          apiError.message || "Failed to load work order. Please try again."
        );
      } else {
        setWorkOrder(data);
      }
    };

    fetchWorkOrder();
  }, [serviceOrderId, navigate]);

  const handleAssignManager = async () => {
    if (!managerId) {
      alert("Manager ID not found. Please login again.");
      return;
    }

    setActionLoading(true);
    setError(null);

    const { data, error: apiError } = await serviceManagerApi.assignManager(
      serviceOrderId,
      managerId
    );

    setActionLoading(false);

    if (apiError) {
      setError(apiError.message || "Failed to assign manager. Please try again.");
    } else {
      setWorkOrder(data);
      alert("Manager assigned successfully!");
    }
  };

  const handleAssignMechanic = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    const mechanicId = Number(assignMechanicForm.mechanicId);
    const estimatedCost = Number(assignMechanicForm.estimatedCost);

    if (!mechanicId || !estimatedCost || estimatedCost <= 0) {
      setError("Please provide valid mechanic ID and estimated cost.");
      setActionLoading(false);
      return;
    }

    const { data, error: apiError } = await serviceManagerApi.assignMechanic(
      serviceOrderId,
      mechanicId,
      estimatedCost
    );

    setActionLoading(false);

    if (apiError) {
      setError(apiError.message || "Failed to assign mechanic. Please try again.");
    } else {
      setWorkOrder(data);
      setShowAssignMechanic(false);
      setAssignMechanicForm({ mechanicId: "", estimatedCost: "" });
      alert("Mechanic assigned successfully!");
    }
  };

  const handleStartWorkOrder = async () => {
    if (!managerId) {
      alert("Manager ID not found. Please login again.");
      return;
    }

    setActionLoading(true);
    setError(null);

    const { data, error: apiError } = await serviceManagerApi.startWorkOrder(
      serviceOrderId,
      managerId
    );

    setActionLoading(false);

    if (apiError) {
      setError(apiError.message || "Failed to start work order. Please try again.");
    } else {
      setWorkOrder(data);
      alert("Work order started successfully!");
    }
  };

  const handleCompleteWorkOrder = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    const finalCostValue = Number(finalCost);

    if (!finalCostValue || finalCostValue <= 0) {
      setError("Please provide a valid final cost.");
      setActionLoading(false);
      return;
    }

    const { data, error: apiError } = await serviceManagerApi.completeWorkOrder(
      serviceOrderId,
      finalCostValue
    );

    setActionLoading(false);

    if (apiError) {
      setError(apiError.message || "Failed to complete work order. Please try again.");
    } else {
      setWorkOrder(data);
      setShowCompleteForm(false);
      setFinalCost("");
      alert("Work order completed successfully!");
    }
  };

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
    const statusUpper = status?.toUpperCase() || "";
    if (statusUpper === "OPEN") {
      return <span className="badge badge-warning">OPEN</span>;
    }
    if (statusUpper === "IN_PROGRESS" || statusUpper === "IN PROGRESS") {
      return <span className="badge badge-info">IN PROGRESS</span>;
    }
    if (statusUpper === "COMPLETED") {
      return <span className="badge badge-success">COMPLETED</span>;
    }
    return <span className="badge badge-ghost">{status || "UNKNOWN"}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error && !workOrder) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/serviceManager")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => navigate("/serviceManager")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Work Order Details</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {workOrder && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold">
                Service Order: {workOrder.serviceOrderId || workOrder.id}
              </h2>
              {getStatusBadge(workOrder.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-500">Vehicle ID:</span>{" "}
                <span className="font-medium">{workOrder.vehicleId || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500">Customer ID:</span>{" "}
                <span className="font-medium">{workOrder.customerId || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500">Scheduled At:</span>{" "}
                <span className="font-medium">
                  {formatDate(workOrder.scheduledAt)}
                </span>
              </div>
              {workOrder.assignedManagerId && (
                <div>
                  <span className="text-gray-500">Manager ID:</span>{" "}
                  <span className="font-medium">{workOrder.assignedManagerId}</span>
                </div>
              )}
              {workOrder.mechanicId && (
                <div>
                  <span className="text-gray-500">Mechanic ID:</span>{" "}
                  <span className="font-medium">{workOrder.mechanicId}</span>
                </div>
              )}
              {workOrder.estimatedCost && (
                <div>
                  <span className="text-gray-500">Estimated Cost:</span>{" "}
                  <span className="font-medium">${workOrder.estimatedCost.toFixed(2)}</span>
                </div>
              )}
              {workOrder.finalCost && (
                <div>
                  <span className="text-gray-500">Final Cost:</span>{" "}
                  <span className="font-medium">${workOrder.finalCost.toFixed(2)}</span>
                </div>
              )}
            </div>

            {workOrder.description && (
              <div className="mb-4">
                <span className="text-gray-500">Description:</span>
                <p className="text-gray-700 mt-1">{workOrder.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="divider">Actions</div>

            <div className="flex flex-wrap gap-2">
              {!workOrder.assignedManagerId && (
                <button
                  className="btn btn-primary"
                  onClick={handleAssignManager}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Assigning..." : "Assign Myself as Manager"}
                </button>
              )}

              {workOrder.assignedManagerId &&
                workOrder.status === "OPEN" &&
                !workOrder.mechanicId && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAssignMechanic(!showAssignMechanic)}
                    disabled={actionLoading}
                  >
                    Assign Mechanic
                  </button>
                )}

              {workOrder.assignedManagerId &&
                workOrder.mechanicId &&
                workOrder.status === "OPEN" && (
                  <button
                    className="btn btn-info"
                    onClick={handleStartWorkOrder}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Starting..." : "Start Work Order"}
                  </button>
                )}

              {workOrder.status === "IN_PROGRESS" && (
                <button
                  className="btn btn-success"
                  onClick={() => setShowCompleteForm(!showCompleteForm)}
                  disabled={actionLoading}
                >
                  Complete Work Order
                </button>
              )}
            </div>

            {/* Assign Mechanic Form */}
            {showAssignMechanic && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Assign Mechanic</h3>
                <form onSubmit={handleAssignMechanic} className="space-y-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Mechanic ID *</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered"
                      value={assignMechanicForm.mechanicId}
                      onChange={(e) =>
                        setAssignMechanicForm({
                          ...assignMechanicForm,
                          mechanicId: e.target.value,
                        })
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Estimated Cost *</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input input-bordered"
                      value={assignMechanicForm.estimatedCost}
                      onChange={(e) =>
                        setAssignMechanicForm({
                          ...assignMechanicForm,
                          estimatedCost: e.target.value,
                        })
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                      {actionLoading ? "Assigning..." : "Assign"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowAssignMechanic(false);
                        setAssignMechanicForm({ mechanicId: "", estimatedCost: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Complete Work Order Form */}
            {showCompleteForm && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Complete Work Order</h3>
                <form onSubmit={handleCompleteWorkOrder} className="space-y-3">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Final Cost *</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input input-bordered"
                      value={finalCost}
                      onChange={(e) => setFinalCost(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={actionLoading}>
                      {actionLoading ? "Completing..." : "Complete"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setShowCompleteForm(false);
                        setFinalCost("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrderDetail;

