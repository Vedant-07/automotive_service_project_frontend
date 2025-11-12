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
      // In dev, go through vite proxy so cookies are same-origin (5175)
      const loginUrl = import.meta.env.DEV ? "/auth/login" : `${VITE_API_HOST}:9002/login`;
      const res = await axios.post(loginUrl, formData, { withCredentials: true });

      console.log("Login success:", res.data);
      setLoading(false);
      // after successful login
      dispatch(addUser(res.data));
      // persist token if present for subsequent API calls
      try {
        if (res?.data?.token) {
          localStorage.setItem("authToken", res.data.token);
        }
      } catch {}

      // role-based redirect
      const role = res.data.role;
      if (role === "admin") navigate("/admin");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 font-rubik">
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_18px_40px_-18px_rgba(15,166,233,0.7)] p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error list */}
        {errorMessages.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-500/15 border border-red-400/40 text-red-200 p-4 rounded-xl">
              <strong className="block mb-2 text-red-100">
                Please fix the following:
              </strong>
              <ul className="list-disc list-inside space-y-1 text-sm">
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
            <label className="label pb-2">
              <span className="label-text text-slate-300 font-medium">Email</span>
            </label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="form-control relative">
            <label className="label pb-2">
              <span className="label-text text-slate-300 font-medium">Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
              ) : (
                <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
              )}
            </button>
          </div>

          {/* Submit */}
          <div className="form-control mt-8">
            <button
              type="submit"
              className="btn w-full bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* small helper */}
        <p className="text-center text-sm mt-6 text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
