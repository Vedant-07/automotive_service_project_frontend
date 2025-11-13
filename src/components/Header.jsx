import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../slices/userSlice";
import { Link } from "react-router-dom";

//TODO: once jwt token system is done then do conditionally rendering on the profile settings and all
const Header = () => {
  const role = useSelector((state) => state.user?.role); // assuming auth slice
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeUser());
    window.location.href = "/login";
  };

  return (
    <>
      <div className="navbar bg-gray-950 shadow-sm min-h-20 px-8">
        {/* Left side: Brand with gradient */}
        <div className="flex-1">
          <Link to="/" className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            PitStopPro
          </Link>
        </div>

        {/* Right side: Avatar or Auth buttons */}
        {role ? (
          <div className="flex-none flex items-center gap-4">
            {/* Profile Image Placeholder */}
            <div className="w-14 h-14 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-gray-800">
              <span className="text-white text-xs text-center leading-tight px-1">
                Mechanic<br />Image
              </span>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border-2 border-cyan-400 bg-blue-900 text-cyan-400 hover:bg-blue-800 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="btn btn-outline btn-sm border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/20"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-500 border-none text-slate-900 font-semibold hover:from-cyan-400 hover:to-sky-400"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;