import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WorkOrderList from './WorkOrderList';
import WorkOrderDetails from './WorkOrderDetails';

function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [view, setView] = useState('list'); // 'list' or 'details'

  const handleViewDetails = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setView('details');
  };

  const handleBackToList = () => {
    setSelectedWorkOrder(null);
    setView('list');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Service Manager Dashboard
              </h1>
              {view === 'details' && (
                <button
                  onClick={handleBackToList}
                  className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Back to List
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                <p className="text-xs text-gray-500">{user.userEmail} • {user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'list' ? (
          <WorkOrderList onViewDetails={handleViewDetails} />
        ) : (
          <WorkOrderDetails 
            workOrder={selectedWorkOrder}
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;