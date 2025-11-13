import React from "react";

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-rubik p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Customer Dashboard</h1>
        <div className="border border-white/10 rounded-2xl bg-slate-900/70 backdrop-blur-lg shadow-[0_18px_40px_-18px_rgba(15,166,233,0.45)] p-8">
          <p className="text-slate-400">Welcome to your customer dashboard. More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
