import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../slices/userSlice";

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
      <div className="navbar bg-slate-900/70 backdrop-blur-lg border-b border-white/10 shadow-lg min-h-20 px-8">
        {/* Left side: Brand */}
        <div className="flex-1">
          <a className="btn btn-ghost text-4xl font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">PitStopPro</a>
        </div>

        {/* Right side: Avatar with dropdown ,also once token is there put it here*/}
        {role && (
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-cyan-400/50 hover:border-cyan-300"
              >
                <div className="w-14 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content bg-slate-800 rounded-box z-1 mt-3 w-60 p-2 shadow-lg border border-slate-700"
              >
                <li>
                  <a className="justify-between text-slate-200 hover:text-white hover:bg-slate-700">
                    Profile
                    <span className="badge badge-sm bg-cyan-500/20 text-cyan-300 border-cyan-400/30">New</span>
                  </a>
                </li>
                <li>
                  <a className="text-slate-200 hover:text-white hover:bg-slate-700">Settings</a>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-slate-200 hover:text-white hover:bg-slate-700">Logout</button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
