// src/pages/serviceManager/ServiceManagerBookings.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceManagerBookings = () => {
  const navigate = useNavigate();

  const bookings = [
    {
      id: 1,
      regNo: "GJ05AB1234",
      date: "2025-09-08",
      img: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
    },
    {
      id: 2,
      regNo: "MH12CD5678",
      date: "2025-09-10",
      img: "https://images.unsplash.com/photo-1517649763962-0642a3f9c03a?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
    },
    {
      id: 3,
      regNo: "KA01XY9876",
      date: "2025-09-12",
      img: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
    },
  ];

  const assignMechanic = (bookingId) => {
    navigate(`/service-manager/assign-mechanic/${bookingId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 font-rubik text-slate-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "2s" }}></div>

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
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 border-2 border-cyan-400/50 rounded-lg bg-slate-900/30 text-slate-100 font-semibold hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Bookings Content */}
      <div className="relative z-5 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">Service Bookings</h1>
            <p className="text-slate-400">Manage and assign mechanics to upcoming service appointments</p>
          </div>

          {/* Bookings Grid */}
          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking, idx) => (
                <div
                  key={booking.id}
                  className="group relative booking-card-premium"
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  
                  {/* Main Card Container */}
                  <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-cyan-500/25 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]">
                    
                    {/* Card Layout - 4 Columns */}
                    <div className="grid grid-cols-4 gap-6 items-center">
                      
                      {/* Column 1: Vehicle Image */}
                      <div className="flex justify-center">
                        <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/40 group-hover:border-cyan-400/70 transition-all shadow-xl group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                          <img
                            src={booking.img}
                            alt="Vehicle"
                            className="w-20 h-14 object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      {/* Column 2: Vehicle Registration Number */}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">Registration</span>
                        <span className="text-slate-100 font-bold text-lg tracking-wider">{booking.regNo}</span>
                      </div>

                      {/* Column 3: Service Booking Date */}
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">Booking Date</span>
                        <span className="text-slate-200 font-semibold">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Column 4: Assign Mechanic Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => assignMechanic(booking.id)}
                          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 uppercase tracking-wider text-sm"
                        >
                          Assign
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400">
              <p className="text-lg">No service bookings available.</p>
            </div>
          )}
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

export default ServiceManagerBookings;
