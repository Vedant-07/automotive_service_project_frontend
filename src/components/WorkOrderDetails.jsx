import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { workOrderApi } from '../services/api';

function WorkOrderDetails({ workOrder: initialWorkOrder, onBack }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [workOrder, setWorkOrder] = useState(initialWorkOrder);

  // Form states
  const [estimatedCost, setEstimatedCost] = useState(initialWorkOrder.estimatedCost || '');
  const [finalCost, setFinalCost] = useState(initialWorkOrder.finalCost || '');
  const [mechanicId, setMechanicId] = useState(initialWorkOrder.mechanicId || '');

  // Update local state when initialWorkOrder changes
  useEffect(() => {
    setWorkOrder(initialWorkOrder);
    setEstimatedCost(initialWorkOrder.estimatedCost || '');
    setFinalCost(initialWorkOrder.finalCost || '');
    setMechanicId(initialWorkOrder.mechanicId || '');
  }, [initialWorkOrder]);

  const getStatusBadge = (status) => {
    const statusColors = {
      OPEN: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800', 
      COMPLETED: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatCost = (cost) => {
    if (!cost) return 'Not set';
    return `$${cost.toFixed(2)}`;
  };

  const showMessage = (text, isError = false) => {
    if (isError) {
      setError(text);
      setMessage('');
    } else {
      setMessage(text);
      setError('');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 5000);
  };

  // Refresh work order data from API
  const refreshWorkOrderData = async () => {
    try {
      const updatedWorkOrder = await workOrderApi.getWorkOrder(workOrder.serviceOrderId);
      setWorkOrder(updatedWorkOrder);
      return updatedWorkOrder;
    } catch (err) {
      console.error('Failed to refresh work order:', err);
      showMessage('Failed to refresh work order data', true);
    }
  };

  // ===== SCENARIO LOGIC =====
  const isAssignedToMe = workOrder.assignedManagerId === user.userId;
  const isUnassigned = !workOrder.assignedManagerId;
  const isAssignedToOther = workOrder.assignedManagerId && workOrder.assignedManagerId !== user.userId;

  // Button enablement logic based on your exact requirements
  const canAssignManager = isUnassigned && workOrder.status === 'OPEN';
  const canAssignMechanic = isAssignedToMe && !workOrder.mechanicId && workOrder.status === 'ASSIGNED';
  const canStartWork = isAssignedToMe && workOrder.mechanicId && workOrder.status === 'ASSIGNED';
  const canCompleteWork = isAssignedToMe && workOrder.status === 'IN_PROGRESS';
  const canUpdateCosts = isAssignedToMe && workOrder.status !== 'COMPLETED';

  // API Actions with data refresh
  const handleAssignManager = async () => {
    try {
      setLoading(true);
      await workOrderApi.assignManager(workOrder.serviceOrderId, user.userId);
      showMessage('Successfully assigned as manager!');
      
      // Refresh the work order data to get updated state
      const updated = await refreshWorkOrderData();
      console.log('After assign manager:', updated);
      
    } catch (err) {
      showMessage('Failed to assign manager: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMechanic = async () => {
    if (!mechanicId) {
      showMessage('Please enter mechanic ID', true);
      return;
    }
    if (!estimatedCost) {
      showMessage('Please enter estimated cost', true);
      return;
    }

    try {
      setLoading(true);
      await workOrderApi.assignMechanic(workOrder.serviceOrderId, parseInt(mechanicId), estimatedCost);
      showMessage('Mechanic assigned successfully!');
      
      // Refresh the work order data to get updated state
      const updated = await refreshWorkOrderData();
      console.log('After assign mechanic:', updated);
      
    } catch (err) {
      showMessage('Failed to assign mechanic: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async () => {
    try {
      setLoading(true);
      await workOrderApi.startWorkOrder(workOrder.serviceOrderId, user.userId);
      showMessage('Work order started successfully!');
      
      // Refresh the work order data to get updated state
      const updated = await refreshWorkOrderData();
      console.log('After start work:', updated);
      
    } catch (err) {
      showMessage('Failed to start work order: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWork = async () => {
    if (!finalCost) {
      showMessage('Please enter final cost', true);
      return;
    }

    try {
      setLoading(true);
      await workOrderApi.completeWorkOrder(workOrder.serviceOrderId, estimatedCost || workOrder.estimatedCost || 0, finalCost);
      showMessage('Work order completed successfully!');
      
      // Refresh the work order data to get updated state
      const updated = await refreshWorkOrderData();
      console.log('After complete work:', updated);
      
    } catch (err) {
      showMessage('Failed to complete work order: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCosts = async () => {
    try {
      setLoading(true);
      await workOrderApi.updateCosts(workOrder.serviceOrderId, estimatedCost || 0, finalCost || 0);
      showMessage('Costs updated successfully!');
      
      // Refresh the work order data to get updated state
      await refreshWorkOrderData();
      
    } catch (err) {
      showMessage('Failed to update costs: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Work Order: {workOrder.serviceOrderId}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {workOrder.status === 'COMPLETED' 
                ? 'Completed work order details' 
                : isAssignedToMe 
                  ? 'You are managing this work order' 
                  : isAssignedToOther
                    ? `Managed by Manager #${workOrder.assignedManagerId} - View Only`
                    : 'Available for assignment'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(workOrder.status)}
            <div className="flex space-x-2">
              <button
                onClick={refreshWorkOrderData}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Refresh
              </button>
              <button
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-xs text-blue-700">
        <strong>Debug Info:</strong> Your ID: {user.userId} | Assigned Manager: {workOrder.assignedManagerId || 'None'} | 
        Status: {workOrder.status} | Mechanic: {workOrder.mechanicId || 'None'} | 
        Can Assign: {canAssignManager ? 'Yes' : 'No'} | Can Start: {canStartWork ? 'Yes' : 'No'} | Can Complete: {canCompleteWork ? 'Yes' : 'No'}
      </div>

      {/* Messages */}
      {(message || error) && (
        <div className={`px-4 py-3 ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border-l-4`}>
          <p className={error ? 'text-red-700' : 'text-green-700'}>
            {error || message}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('details')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          {!isAssignedToOther && workOrder.status !== 'COMPLETED' && (
            <button
              onClick={() => setActiveTab('actions')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'actions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Actions
            </button>
          )}
          <button
            onClick={() => setActiveTab('costs')}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'costs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Costs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-5 sm:p-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Work Order Information</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-900">Service Order ID</dt>
                  <dd className="text-sm text-gray-700">{workOrder.serviceOrderId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Status</dt>
                  <dd className="text-sm text-gray-700">{getStatusBadge(workOrder.status)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Vehicle ID</dt>
                  <dd className="text-sm text-gray-700">{workOrder.vehicleId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Customer ID</dt>
                  <dd className="text-sm text-gray-700">{workOrder.customerId}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Assignment & Progress</h4>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-900">Assigned Manager</dt>
                  <dd className="text-sm text-gray-700">
                    {workOrder.assignedManagerId 
                      ? `Manager #${workOrder.assignedManagerId} ${isAssignedToMe ? '(You)' : ''}`
                      : 'Not assigned'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Mechanic</dt>
                  <dd className="text-sm text-gray-700">
                    {workOrder.mechanicId ? `Mechanic #${workOrder.mechanicId}` : 'Not assigned'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Estimated Cost</dt>
                  <dd className="text-sm text-gray-700">
                    {formatCost(workOrder.estimatedCost)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Final Cost</dt>
                  <dd className="text-sm text-gray-700">
                    {formatCost(workOrder.finalCost)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Scheduled At</dt>
                  <dd className="text-sm text-gray-700">
                    {formatDate(workOrder.scheduledAt)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="sm:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Service Description</h4>
              <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                {workOrder.description || 'No description provided'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'actions' && !isAssignedToOther && workOrder.status !== 'COMPLETED' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Workflow Actions</h4>
              <p className="text-sm text-blue-700 mb-4">
                Follow the workflow steps below:
              </p>
              
              <div className="space-y-4">
                {/* Step 1: Assign Manager - Only show if unassigned */}
                {isUnassigned && (
                  <div className="p-4 border border-blue-300 rounded-md bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            1
                          </span>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Assign Yourself as Manager</h4>
                            <p className="text-xs text-gray-500">Take ownership of this work order</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleAssignManager}
                        disabled={loading || !canAssignManager}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Assign Me
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Assign Mechanic - Only show if assigned to me */}
                {isAssignedToMe && (
                  <div className={`p-4 border rounded-md ${canAssignMechanic ? 'border-green-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {isUnassigned ? '2' : '1'}
                          </span>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Assign Mechanic</h4>
                            <p className="text-xs text-gray-500">Assign a mechanic and set estimated cost</p>
                            <div className="mt-2 flex space-x-2">
                              <input
                                type="number"
                                placeholder="Mechanic ID"
                                value={mechanicId}
                                onChange={(e) => setMechanicId(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                disabled={!!workOrder.mechanicId || !canAssignMechanic}
                              />
                              <input
                                type="number"
                                placeholder="Estimated Cost"
                                value={estimatedCost}
                                onChange={(e) => setEstimatedCost(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                step="0.01"
                                disabled={!canAssignMechanic}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleAssignMechanic}
                        disabled={loading || !canAssignMechanic}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {workOrder.mechanicId ? 'Assigned' : 'Assign Mechanic'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Start Work - Only show if assigned to me and mechanic assigned */}
                {isAssignedToMe && (
                  <div className={`p-4 border rounded-md ${canStartWork ? 'border-orange-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {isUnassigned ? '3' : '2'}
                          </span>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Start Work Order</h4>
                            <p className="text-xs text-gray-500">Mark the work as IN_PROGRESS</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleStartWork}
                        disabled={loading || !canStartWork}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Start Work
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Complete Work - Only show if assigned to me and work is in progress */}
                {isAssignedToMe && (
                  <div className={`p-4 border rounded-md ${canCompleteWork ? 'border-purple-300 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {isUnassigned ? '4' : '3'}
                          </span>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">Complete Work Order</h4>
                            <p className="text-xs text-gray-500">Mark as COMPLETED and set final cost</p>
                            {canCompleteWork && (
                              <div className="mt-2">
                                <input
                                  type="number"
                                  placeholder="Final Cost"
                                  value={finalCost}
                                  onChange={(e) => setFinalCost(e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                                  step="0.01"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleCompleteWork}
                        disabled={loading || !canCompleteWork}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Complete Work
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Guide */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Workflow Status</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• <span className={isUnassigned ? 'font-bold text-blue-600' : ''}>Unassigned</span> → Only "Assign Me" available</p>
                <p>• <span className={isAssignedToMe && !workOrder.mechanicId ? 'font-bold text-green-600' : ''}>Assigned to You</span> → Can assign mechanic</p>
                <p>• <span className={isAssignedToMe && workOrder.mechanicId && workOrder.status === 'OPEN' ? 'font-bold text-orange-600' : ''}>Mechanic Assigned</span> → Can start work</p>
                <p>• <span className={isAssignedToMe && workOrder.status === 'IN_PROGRESS' ? 'font-bold text-purple-600' : ''}>Work Started</span> → Can complete work</p>
                <p>• <span className={workOrder.status === 'COMPLETED' ? 'font-bold text-green-600' : ''}>Completed</span> → Work order finished</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-6 max-w-md">
            {!isAssignedToMe && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                <p className="text-sm text-orange-700">
                  Cost management is only available to the assigned manager.
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-yellow-800">Cost Management</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Update costs for this work order. Final cost is required when completing work.
              </p>
            </div>

            <div>
              <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700">
                Estimated Cost
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="estimatedCost"
                  id="estimatedCost"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  disabled={!isAssignedToMe || workOrder.status === 'COMPLETED'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="finalCost" className="block text-sm font-medium text-gray-700">
                Final Cost
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="finalCost"
                  id="finalCost"
                  value={finalCost}
                  onChange={(e) => setFinalCost(e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  disabled={!isAssignedToMe || workOrder.status === 'COMPLETED'}
                />
              </div>
            </div>

            {canUpdateCosts && (
              <button
                onClick={handleUpdateCosts}
                disabled={loading}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Costs'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkOrderDetails;