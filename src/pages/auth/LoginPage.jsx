import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../../slices/userSlice";
import { useDispatch } from "react-redux";
const { VITE_API_HOST } = import.meta.env;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]); // array of errors to show
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Simple client-side validation - returns array of error strings
  const clientValidate = () => {
    const errs = [];
    if (!formData.userEmail || formData.userEmail.trim() === "") {
      errs.push("Email must not be empty.");
    }
    if (!formData.userPassword || formData.userPassword.trim() === "") {
      errs.push("Password cannot be blank.");
    }
    return errs;
  };

  // Parse backend response -------TODO:verifying is left of this function ---------
  const parseBackendErrors = (data) => {
    if (!data) return [];
    if (Array.isArray(data.message)) return data.message.map(String);
    if (typeof data.message === "string") {
      return data.message
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (data.error) return [String(data.error)];
    if (typeof data === "string") return [data];
    return [];
  };

  const handleChange = (e) => {
    // clear errors when user starts typing
    setErrorMessages([]);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setLoading(true);

    // client-side check
    const clientErrors = clientValidate();
    if (clientErrors.length) {
      setErrorMessages(clientErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${VITE_API_HOST}:9002/login`, formData, {
        withCredentials: true,
      });

      console.log("Login success:", res.data);
      setLoading(false);
      // after successful login
      dispatch(addUser(res.data));

      // role-based redirect
      const role = res.data.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "SERVICE_MANAGER") navigate("/serviceManager");
      else if (role === "CUSTOMER") navigate("/customer");
      else navigate("/login");
      
    } catch (err) {
      setLoading(false);
      const resp = err?.response?.data;
      const parsed = parseBackendErrors(resp);

      if (parsed.length > 0) {
        setErrorMessages(parsed);
      } else {
        const fallback =
          resp?.message || resp?.error || err.message || "Login failed";
        setErrorMessages([String(fallback)]);
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4">Login</h2>

          {/* Error list */}
          {errorMessages.length > 0 && (
            <div className="mb-4">
              <div className="bg-red-50 border border-red-400 text-red-800 p-3 rounded">
                <strong className="block mb-2">
                  Please fix the following:
                </strong>
                <ul className="list-disc list-inside space-y-1">
                  {errorMessages.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>

            {/* Password */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            {/* Submit */}
            <div className="form-control mt-4">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {/* small helper */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
