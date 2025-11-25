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
        {/* Left side: Brand */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-4xl">PitStopPro</Link>
        </div>

        {/* Right side: Avatar or Auth buttons */}
        {role ? (
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-14 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://static.vecteezy.com/system/resources/previews/046/010/545/non_2x/user-icon-simple-design-free-vector.jpg"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 w-60 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
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
