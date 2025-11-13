// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="border border-white/10 rounded-2xl bg-slate-900/70 backdrop-blur-lg shadow-[0_18px_40px_-18px_rgba(15,166,233,0.45)] p-6 max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-2 text-white font-rubik">Access Denied</h1>
        <p className="mb-4 text-slate-300">
          You don't have permission to view this page. If you think this is a mistake, contact support or use an account with the required role.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="btn bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400">Go home</Link>
          <Link to="/dashboard" className="btn border-slate-600 text-slate-300 hover:bg-slate-800/50">My dashboard</Link>
        </div>
      </div>
    </div>
  );
}
