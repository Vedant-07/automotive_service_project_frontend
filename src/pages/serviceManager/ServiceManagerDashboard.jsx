import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serviceManagerApi } from "../../utils/api";

const ServiceManagerDashboard = () => {
  const navigate = useNavigate();
  const [openWorkOrders, setOpenWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpenWorkOrders = async () => {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await serviceManagerApi.listOpenWorkOrders();

      setLoading(false);

      if (apiError) {
        setError(
          apiError.message || "Failed to load open work orders. Please try again."
        );
      } else {
        setOpenWorkOrders(data || []);
      }
    };

    fetchOpenWorkOrders();
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Service Manager Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Open Work Orders</h2>
      </div>

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

      {!loading && !error && openWorkOrders.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <p className="text-gray-500 text-lg">
              No open work orders at the moment.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && openWorkOrders.length > 0 && (
        <div className="grid gap-4">
          {openWorkOrders.map((workOrder) => (
            <div key={workOrder.serviceOrderId || workOrder.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">
                        Service Order: {workOrder.serviceOrderId || workOrder.id || "N/A"}
                      </h3>
                      {getStatusBadge(workOrder.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
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
                      {workOrder.estimatedCost && (
                        <div>
                          <span className="text-gray-500">Estimated Cost:</span>{" "}
                          <span className="font-medium">${workOrder.estimatedCost.toFixed(2)}</span>
                        </div>
                      )}
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
                    </div>

                    {workOrder.description && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm">Description:</span>
                        <p className="text-gray-700 mt-1">{workOrder.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate(`/serviceManager/workorders/${workOrder.serviceOrderId || workOrder.id}`)
                      }
                    >
                      View Details
                    </button>
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

export default ServiceManagerDashboard;
