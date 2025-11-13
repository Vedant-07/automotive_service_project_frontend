import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../../slices/userSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [formData, setFormData] = useState({ userEmail: "", userPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clientValidate = () => {
    const errs = [];
    if (!formData.userEmail || formData.userEmail.trim() === "") errs.push("Email must not be empty.");
    if (!formData.userPassword || formData.userPassword.trim() === "") errs.push("Password cannot be blank.");
    return errs;
  };

  const parseBackendErrors = (data) => {
    if (!data) return [];
    if (Array.isArray(data.message)) return data.message.map(String);
    if (typeof data.message === "string") return data.message.split(",").map((s) => s.trim()).filter(Boolean);
    if (data.error) return [String(data.error)];
    if (typeof data === "string") return [data];
    return [];
  };

  const handleChange = (e) => {
    setErrorMessages([]);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setLoading(true);

    const clientErrors = clientValidate();
    if (clientErrors.length) {
      setErrorMessages(clientErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:9002/login", formData, { withCredentials: true });
      console.log("Login success:", res.data);
      setLoading(false);
      dispatch(addUser(res.data));
      const role = res.data.role;
      if (role === "admin") navigate("/admin");
      else if (role === "SERVICE_MANAGER") navigate("/serviceManager");
      else if (role === "CUSTOMER") navigate("/customer");
      else navigate("/login");
    } catch (err) {
      setLoading(false);
      const resp = err?.response?.data;
      const parsed = parseBackendErrors(resp);
      if (parsed.length > 0) setErrorMessages(parsed);
      else setErrorMessages([String(resp?.message || resp?.error || err.message || "Login failed")]);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-rubik">
      <div className="w-full form-card">
        <h2 className="text-4xl font-bold text-center mb-6 text-white">Login</h2>

        {errorMessages.length > 0 && (
          <div className="mb-4">
            <div className="bg-red-500/15 border border-red-500/40 text-red-200 p-3 rounded-lg">
              <strong className="block mb-2">Please fix the following:</strong>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {errorMessages.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          </div>
        )}

  <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-control">
            <label className="label"><span className="label-text text-slate-300">Email</span></label>
            <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="Enter your email" className="input input-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
          </div>

          <div className="form-control relative">
            <label className="label"><span className="label-text text-slate-300">Password</span></label>
            <input type={showPassword ? "text" : "password"} name="userPassword" value={formData.userPassword} onChange={handleChange} placeholder="Enter your password" className="input input-bordered w-full pr-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeSlashIcon className="h-5 w-5 text-slate-400" /> : <EyeIcon className="h-5 w-5 text-slate-400" />}
            </button>
          </div>

          <div className="form-control form-submit-wrap">
            <button type="submit" className="btn-pitstop w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </div>
        </form>

        <p className="text-center text-sm mt-4 text-slate-400">Don't have an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
