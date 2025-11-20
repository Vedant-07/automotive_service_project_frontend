import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { callCenterApi } from '../services/api';

function FeedbackDetails({ feedback, onClose, onUpdate }) {
  const { user } = useAuth();
  const [response, setResponse] = useState(feedback.agentResponse || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getTypeBadge = (type) => {
    const typeColors = {
      FEEDBACK: 'bg-green-100 text-green-800',
      COMPLAINT: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      OPEN: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleRespond = async () => {
    if (!response.trim()) {
      setError('Please enter a response');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await callCenterApi.respondToFeedback(user.userId, feedback.id, response);
      setMessage('Response submitted successfully!');
      onUpdate(); // Refresh the parent component
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to submit response: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAssignedToMe = feedback.assignedAgentId === user.userId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Feedback Details #{feedback.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Messages */}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-900">Type</dt>
                  <dd className="text-sm text-gray-700">{getTypeBadge(feedback.type)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Status</dt>
                  <dd className="text-sm text-gray-700">{getStatusBadge(feedback.status)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Customer ID</dt>
                  <dd className="text-sm text-gray-700">{feedback.customerId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Service Order</dt>
                  <dd className="text-sm text-gray-700">{feedback.serviceOrderId || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Assignment</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-900">Assigned Agent</dt>
                  <dd className="text-sm text-gray-700">
                    {feedback.assignedAgentId 
                      ? `Agent #${feedback.assignedAgentId} ${isAssignedToMe ? '(You)' : ''}`
                      : 'Unassigned'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Created Date</dt>
                  <dd className="text-sm text-gray-700">{formatDate(feedback.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900">Last Updated</dt>
                  <dd className="text-sm text-gray-700">{formatDate(feedback.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Subject and Message */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Subject</h3>
            <p className="text-sm text-gray-900 font-medium bg-gray-50 p-3 rounded">
              {feedback.subject}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Message</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
              {feedback.message}
            </p>
          </div>

          {/* Agent Response Section */}
          {isAssignedToMe && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Your Response</h3>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response to the customer..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleRespond}
                  disabled={loading || !response.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </div>
          )}

          {/* Existing Agent Response */}
          {feedback.agentResponse && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Previous Response</h3>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded whitespace-pre-wrap">
                {feedback.agentResponse}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackDetails;