import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceManagerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-rubik text-slate-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-slate-900/40 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_8px_32px_rgba(6,182,212,0.08)] px-8 py-5 flex items-center justify-between">
        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          PitStopPro
        </div>
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full border-2 border-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center bg-gradient-to-br from-slate-800/70 to-slate-900/70 shadow-lg shadow-cyan-500/20">
            <span className="text-xs font-bold text-cyan-300 text-center px-1">Service Manager</span>
          </div>
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="px-6 py-2.5 border-2 border-cyan-400/50 rounded-lg bg-slate-900/30 text-slate-100 font-semibold hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-5 flex flex-1 flex-col items-center justify-center p-12 pt-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Service Manager Dashboard
          </h1>
          <p className="text-slate-400 text-lg">Manage your service bookings and history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* View Service Bookings Card */}
          <div
            onClick={() => navigate("/serviceManager/bookings")}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 border-2 border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-10 transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-slate-100 mb-2">View Service Bookings</p>
                <p className="text-slate-400 text-sm">Manage upcoming service appointments and assignments</p>
              </div>
            </div>
          </div>

          {/* View Service History Card */}
          <div
            onClick={() => navigate("/serviceManager/history")}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 border-2 border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-10 transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-slate-100 mb-2">View Service History</p>
                <p className="text-slate-400 text-sm">Review completed services and historical data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950/80 border-t border-cyan-500/20 shadow-[0_-8px_32px_rgba(6,182,212,0.04)] px-8 py-8 text-center">
        <p className="text-slate-400 text-sm mb-2">About, Terms and Conditions</p>
        <p className="text-slate-500 text-xs">© 2025 PitStopPro. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServiceManagerDashboard;
