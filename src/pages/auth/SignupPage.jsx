import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const { VITE_API_HOST } = import.meta.env;

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
  const [errorMessages, setErrorMessages] = useState([]); // array of errors to show
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simple client-side validation - returns array of error strings
  const clientValidate = () => {
    const errs = [];
    if (!formData.userEmail || formData.userEmail.trim() === "") {
      errs.push("Email must not be empty.");
    }
    if (!formData.userPassword || formData.userPassword.trim() === "") {
      errs.push("Password cannot be blank.");
    } else if (
      formData.userPassword.length < 8 ||
      formData.userPassword.length > 12
    ) {
      errs.push("Password must be between 8 and 12 characters.");
    }
    if (!/^\d{10}$/.test(formData.userPhoneNumber || "")) {
      errs.push("Phone number must be exactly 10 digits.");
    }
    if (!formData.role || formData.role.trim() === "") {
      errs.push("Role must not be empty.");
    }
    if (
      !formData.userAddress ||
      formData.userAddress.trim().length < 50 ||
      formData.userAddress.trim().length > 500
    ) {
      errs.push("Address must be between 50 and 500 characters.");
    }
    // if role is SERVICE_MANAGER, yearsOfExperience should be a positive number (optional check)
    if (formData.role === "SERVICE_MANAGER") {
      if (
        formData.yearsOfExperience &&
        Number.isNaN(Number(formData.yearsOfExperience))
      ) {
        errs.push("Years of experience must be a number.");
      }
    }
    return errs;
  };

  // Parse backend response that contains message as a comma-separated string
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

    // Build payload - omit mechanic fields for CUSTOMER
    const basePayload = {
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPassword: formData.userPassword,
      userPhoneNumber: formData.userPhoneNumber,
      userAddress: formData.userAddress,
      role: formData.role,
    };

    const payload =
      formData.role === "SERVICE_MANAGER"
        ? {
            ...basePayload,
            yearsOfExperience: formData.yearsOfExperience
              ? Number(formData.yearsOfExperience)
              : undefined,
            serviceDepartment: formData.serviceDepartment || undefined,
          }
        : { ...basePayload };

    try {
      const res = await axios.post(
        `${VITE_API_HOST}:9001/signup/signup`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("Server response:", res.data);
      // On success you may want to redirect or show a success message, for now we log
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      const resp = err?.response?.data;
      const parsed = parseBackendErrors(resp);

      if (parsed.length > 0) {
        setErrorMessages(parsed);
      } else {
        // fallback single message
        const fallback =
          resp?.message || resp?.error || err.message || "An error occurred";
        setErrorMessages([String(fallback)]);
      }
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 font-rubik py-8">
      <div className="w-full max-w-2xl bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_18px_40px_-18px_rgba(15,166,233,0.7)] p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            Create an Account
          </h2>
          <p className="text-slate-400 text-sm">
            Join PitStopPro and get started today
          </p>
        </div>

        {/* Error list shown between heading and Role dropdown (as requested) */}
        {errorMessages.length > 0 && (
          <div className="md:col-span-2 mb-6">
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

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* User Name */}
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text text-slate-300 font-medium">User Name</span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
            />
          </div>

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
              placeholder="Enter password (8-12 chars)"
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

          {/* Phone */}
          <div className="form-control">
            <label className="label pb-2">
              <span className="label-text text-slate-300 font-medium">Phone Number</span>
            </label>
            <input
              type="tel"
              name="userPhoneNumber"
              value={formData.userPhoneNumber}
              onChange={handleChange}
              placeholder="10-digit number"
              className="input w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
            />
          </div>

          {/* Address (full-width) */}
          <div className="form-control md:col-span-2">
            <label className="label pb-2">
              <span className="label-text text-slate-300 font-medium">Address</span>
            </label>
            <textarea
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              placeholder="Enter full address (50-500 chars)"
              className="textarea w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
            ></textarea>
          </div>

          {/* Role dropdown (full-width) */}
          <div className="form-control md:col-span-2">
            <label className="label pb-2">
              <span className="label-text text-slate-300 font-medium">Role</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select w-full bg-slate-800/50 border-white/20 text-white focus:border-cyan-400/60 focus:outline-none"
            >
              <option value="" className="bg-slate-800">-- Select Role --</option>
              <option value="CUSTOMER" className="bg-slate-800">Customer</option>
              <option value="SERVICE_MANAGER" className="bg-slate-800">SERVICE_MANAGER</option>
            </select>
          </div>

          {/* Conditional fields only shown and only sent for SERVICE_MANAGER */}
          {formData.role === "SERVICE_MANAGER" && (
            <>
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text text-slate-300 font-medium">Years of Experience</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="input w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                />
              </div>

              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text text-slate-300 font-medium">Service Department</span>
                </label>
                <input
                  type="text"
                  name="serviceDepartment"
                  value={formData.serviceDepartment}
                  onChange={handleChange}
                  placeholder="e.g. Engine, Tires"
                  className="input w-full bg-slate-800/50 border-white/20 text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <div className="form-control md:col-span-2 mt-6">
            <button
              type="submit"
              className="btn w-full bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* small helper */}
        <p className="text-center text-sm mt-6 text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
