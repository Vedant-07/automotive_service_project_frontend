import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { callCenterApi } from '../services/api';
import FeedbackDetails from './FeedbackDetails';

function FeedbackList() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('all'); // 'all' or 'my'
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, [view]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (view === 'all') {
        data = await callCenterApi.getAllFeedbacks();
      } else {
        data = await callCenterApi.getAgentFeedbacks(user.userId);
      }
      
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      setError('Failed to load feedbacks. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (feedback) => {
    try {
      setLoading(true);
      await callCenterApi.assignFeedback(user.userId, feedback.id);
      // Refresh the list to show updated assignment
      await fetchFeedbacks();
      alert(`Successfully assigned feedback #${feedback.id} to you!`);
    } catch (err) {
      console.error('Failed to assign feedback:', err);
      alert('Failed to assign feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedFeedback(null);
  };

  const handleUpdate = () => {
    // Refresh the list when feedback is updated
    fetchFeedbacks();
  };

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
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading feedbacks...</span>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Details Modal */}
      {showDetails && selectedFeedback && (
        <FeedbackDetails 
          feedback={selectedFeedback}
          onClose={handleCloseDetails}
          onUpdate={handleUpdate}
        />
      )}

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedbacks</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and respond to customer feedbacks and complaints.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            onClick={() => setView('all')}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              view === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Feedbacks
          </button>
          <button
            onClick={() => setView('my')}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              view === 'my' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            My Assigned
          </button>
          <button
            onClick={fetchFeedbacks}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Subject
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Customer ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Assigned Agent
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {feedbacks.map((feedback) => (
                    <tr key={feedback.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        #{feedback.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getTypeBadge(feedback.type)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {feedback.subject}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {feedback.customerId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getStatusBadge(feedback.status)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(feedback.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {feedback.assignedAgentId ? `Agent #${feedback.assignedAgentId}` : 'Unassigned'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                        {!feedback.assignedAgentId && (
                          <button
                            onClick={() => handleAssignToMe(feedback)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                          >
                            Assign to Me
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(feedback)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {feedbacks.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {view === 'all' ? 'No feedbacks found' : 'No assigned feedbacks'}
                  </h3>
                  <p className="text-gray-500">
                    {view === 'all' 
                      ? 'There are no customer feedbacks to display.' 
                      : 'You have no feedbacks assigned to you.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackList;