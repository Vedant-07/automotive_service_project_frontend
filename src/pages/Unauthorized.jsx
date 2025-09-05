// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="card p-6 max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-2">Access denied</h1>
        <p className="mb-4">
          You don’t have permission to view this page. If you think this is a mistake, contact support or use an account with the required role.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="btn btn-primary">Go home</Link>
          <Link to="/dashboard" className="btn btn-outline">My dashboard</Link>
        </div>
      </div>
    </div>
  );
}
