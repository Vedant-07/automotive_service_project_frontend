import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Heroicons

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="card w-full max-w-2xl shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* User Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">User Name</span>
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input input-bordered w-full"
              />
            </div>

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

            {/* Password with Eye Toggle */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                placeholder="Enter password"
                className="input input-bordered w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3  translate-y-1/2"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                name="userPhoneNumber"
                value={formData.userPhoneNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                className="input input-bordered w-full"
              />
            </div>

            {/* Address */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                name="userAddress"
                value={formData.userAddress}
                onChange={handleChange}
                placeholder="Enter full address"
                className="textarea textarea-bordered w-full"
              />
            </div>

            {/* Role Dropdown */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-primary w-full"
              >
                <option value="">-- Select Role --</option>
                <option value="Customer">Customer</option>
                <option value="Mechanic">Mechanic</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {formData.role === "Mechanic" && (
              <>
                {/* Experience */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Years of Experience</span>
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Department */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Service Department</span>
                  </label>
                  <input
                    type="text"
                    name="serviceDepartment"
                    value={formData.serviceDepartment}
                    onChange={handleChange}
                    placeholder="e.g. Engine, Tires"
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            )}

            {/* Submit */}
            <div className="form-control md:col-span-2 mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Sign Up
              </button>
            </div>
          </form>

          {/* Already have account */}
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
