import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-12">
        <p className="uppercase tracking-[0.35em] text-sm text-slate-400 mb-2">
          Customer Portal
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Welcome Back
        </h1>
        <p className="text-slate-300 max-w-2xl">
          Manage your vehicles, track services, and access all your automotive needs in one place.
        </p>
      </div>

      {/* grid: 1 column on mobile, 3 columns on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Manage Vehicles */}
        <div className="group bg-slate-900/60 border border-white/10 rounded-2xl shadow-[0_18px_45px_-18px_rgba(15,166,233,0.6)] overflow-hidden flex flex-col h-80 md:h-96 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40">
          <figure className="h-32 md:h-40 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPCFXBflNIBZ_-p19nhyuwZ5eCO-QiEFNovg&s"
              alt="Manage Vehicles"
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between p-6">
            <div>
              <h2 className="card-title justify-center text-white text-xl mb-2">Manage Vehicles</h2>
              <p className="text-sm text-slate-300">Add, update, or remove your registered vehicles.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button 
                onClick={() => navigate(`vehicles`)}
                className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400 w-full md:w-auto"
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Download Invoice */}
        <div className="group bg-slate-900/60 border border-white/10 rounded-2xl shadow-[0_18px_45px_-18px_rgba(15,166,233,0.6)] overflow-hidden flex flex-col h-80 md:h-96 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40">
          <figure className="h-32 md:h-40 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20"></div>
            <img
              src="https://img.daisyui.com/images/stock/photo-1556742400-b5b7c5128f93.webp"
              alt="Download Invoice"
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between p-6">
            <div>
              <h2 className="card-title justify-center text-white text-xl mb-2">Download Invoice</h2>
              <p className="text-sm text-slate-300">View your past services and download invoices in one click.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-400 border-none text-slate-900 font-semibold hover:from-emerald-400 hover:to-teal-300 w-full md:w-auto">
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Service Center Helpline */}
        <div className="group bg-slate-900/60 border border-white/10 rounded-2xl shadow-[0_18px_45px_-18px_rgba(15,166,233,0.6)] overflow-hidden flex flex-col h-80 md:h-96 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40">
          <figure className="h-32 md:h-40 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20"></div>
            <img
              src="https://img.daisyui.com/images/stock/photo-1529626455594-4ff0802cfb7e.webp"
              alt="Service Center"
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
          </figure>
          <div className="card-body text-center flex-1 flex flex-col justify-between p-6">
            <div>
              <h2 className="card-title justify-center text-white text-xl mb-2">Service Center Helpline</h2>
              <p className="text-sm text-slate-300">Need help? Reach out to our service support anytime.</p>
            </div>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-sm bg-gradient-to-r from-amber-500 to-orange-500 border-none text-slate-900 font-semibold hover:from-amber-400 hover:to-orange-400 w-full md:w-auto">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
