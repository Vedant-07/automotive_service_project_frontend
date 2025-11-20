import { useAuth } from '../context/AuthContext';
import FeedbackList from './FeedbackList';

function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Call Center Agent Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.userName}</p>
                <p className="text-xs text-gray-500">Agent #{user.userId} • {user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <FeedbackList />
      </main>
    </div>
  );
}

export default Dashboard;