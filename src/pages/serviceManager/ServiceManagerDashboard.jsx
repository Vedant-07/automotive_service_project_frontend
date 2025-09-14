import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-base-200/80 backdrop-blur-md -z-10"></div>

      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm border-b">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">PitStopPro</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://via.placeholder.com/45" alt="SM" />
            </div>
          </div>
          <button className="btn btn-error btn-sm">Logout</button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-1 justify-center items-start gap-6 p-10">
        <div
          className="card bg-base-100 shadow-xl p-8 text-lg font-semibold text-center cursor-pointer hover:bg-base-200 transition-transform hover:-translate-y-1 w-60"
          onClick={() => navigate("/service-manager/bookings")}
        >
          View Service Bookings
        </div>
        <div
          className="card bg-base-100 shadow-xl p-8 text-lg font-semibold text-center cursor-pointer hover:bg-base-200 transition-transform hover:-translate-y-1 w-60"
          onClick={() => navigate("/service-manager/history")}
        >
          View Service History
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center bg-base-100 p-4 border-t">
        <p className="text-sm text-gray-600">About, Terms and Conditions</p>
      </footer>
    </div>
  );
};

export default ServiceManagerDashboard;
