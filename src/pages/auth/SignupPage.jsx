import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userPhoneNumber: "",
    userAddress: "",
    role: "",
    yearsOfExperience: "",
    serviceDepartment: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clientValidate = () => {
    const errs = [];
    if (!formData.userEmail || formData.userEmail.trim() === "") {
      errs.push("Email must not be empty.");
    }
    if (!formData.userPassword || formData.userPassword.trim() === "") {
      errs.push("Password cannot be blank.");
    } else if (formData.userPassword.length < 8 || formData.userPassword.length > 12) {
      errs.push("Password must be between 8 and 12 characters.");
    }
    if (!/^\d{10}$/.test(formData.userPhoneNumber || "")) {
      errs.push("Phone number must be exactly 10 digits.");
    }
    if (!formData.role || formData.role.trim() === "") {
      errs.push("Role must not be empty.");
    }
    if (!formData.userAddress || formData.userAddress.trim().length < 50 || formData.userAddress.trim().length > 500) {
      errs.push("Address must be between 50 and 500 characters.");
    }
    if (formData.role === "SERVICE_MANAGER") {
      if (formData.yearsOfExperience && Number.isNaN(Number(formData.yearsOfExperience))) {
        errs.push("Years of experience must be a number.");
      }
    }
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

    const basePayload = {
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
      userPhoneNumber: formData.userPhoneNumber,
      userAddress: formData.userAddress,
      role: formData.role,
    };

    const payload = formData.role === "SERVICE_MANAGER"
      ? {
          ...basePayload,
          yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : undefined,
          serviceDepartment: formData.serviceDepartment || undefined,
        }
      : { ...basePayload };

    try {
      const res = await axios.post("http://localhost:9001/signup/signup", payload, { withCredentials: true });
      console.log("Server response:", res.data);
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      const resp = err?.response?.data;
      const parsed = parseBackendErrors(resp);
      if (parsed.length > 0) setErrorMessages(parsed);
      else setErrorMessages([String(resp?.message || resp?.error || err.message || "An error occurred")]);
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-rubik relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full form-card relative z-10">
        <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">Create an Account</h2>
        <p className="text-center text-slate-400 mb-8 text-sm">Join PitStopPro and get started today</p>

        {errorMessages.length > 0 && (
          <div className="md:col-span-2 mb-4">
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
            <label className="label"><span className="label-text text-slate-300">User Name</span></label>
            <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="Enter your name" className="input input-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-slate-300">Email</span></label>
            <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} placeholder="Enter your email" className="input input-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
          </div>

          <div className="form-control relative">
            <label className="label"><span className="label-text text-slate-300">Password</span></label>
            <input type={showPassword ? "text" : "password"} name="userPassword" value={formData.userPassword} onChange={handleChange} placeholder="Enter password (8-12 chars)" className="input input-bordered w-full pr-10 bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeSlashIcon className="h-5 w-5 text-slate-400" /> : <EyeIcon className="h-5 w-5 text-slate-400" />}
            </button>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-slate-300">Phone Number</span></label>
            <input type="tel" name="userPhoneNumber" value={formData.userPhoneNumber} onChange={handleChange} placeholder="10-digit number" className="input input-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
          </div>

          <div className="form-control form-full">
            <label className="label"><span className="label-text text-slate-300">Address</span></label>
            <textarea name="userAddress" value={formData.userAddress} onChange={handleChange} placeholder="Enter full address (50-500 chars)" className="textarea textarea-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500"></textarea>
          </div>

          <div className="form-control form-full">
            <label className="label"><span className="label-text text-slate-300">Role</span></label>
            <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100">
              <option value="">-- Select Role --</option>
              <option value="CUSTOMER">Customer</option>
              <option value="SERVICE_MANAGER">SERVICE_MANAGER</option>
            </select>
          </div>

          {formData.role === "SERVICE_MANAGER" && (
            <>
              <div className="form-control">
                <label className="label"><span className="label-text text-slate-300">Years of Experience</span></label>
                <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="e.g. 5" className="input input-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text text-slate-300">Service Department</span></label>
                <input type="text" name="serviceDepartment" value={formData.serviceDepartment} onChange={handleChange} placeholder="e.g. Engine, Tires" className="input input-bordered w-full bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500" />
              </div>
            </>
          )}

          <div className="form-control form-submit-wrap">
            <button type="submit" className="btn-pitstop w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-4 text-slate-400">Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Login</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;
