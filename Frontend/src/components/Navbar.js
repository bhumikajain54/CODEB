import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faRightFromBracket, faShieldHalved, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isDashboard = false }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isAdmin = () => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.includes("ADMIN");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            {/* Logo - Hide if in Dashboard Layout (it's in the Sidebar instead) */}
            {!isDashboard && (
              <Link to="/home" className="flex items-center space-x-3 group">
                <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform">
                  <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
                  InvoiceFlow
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-all"
                  >
                    <FontAwesomeIcon icon={faShieldHalved} />
                    <span>Admin Console</span>
                  </Link>
                )}

                {/* User Profile Area */}
                <div className="flex items-center space-x-4 pl-6 border-l border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black border border-slate-200">
                      {currentUser.email && currentUser.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 leading-none">
                        {currentUser.email.split('@')[0]}
                      </span>
                      <span className="text-xs font-medium text-slate-400 mt-0.5 capitalize">
                        {currentUser.role?.toLowerCase().replace('role_', '') || 'User'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all ml-2"
                    title="Logout"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-xl text-slate-600 hover:bg-slate-50 focus:outline-none"
            >
              {currentUser ? (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black border border-slate-200 text-sm">
                  {currentUser.email && currentUser.email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="h-5 w-5 p-1" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'} bg-white border-b border-slate-200 absolute w-full`}>
        <div className="px-4 py-4 space-y-4 shadow-xl">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-4 px-2 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black border border-slate-200 text-lg">
                  {currentUser.email && currentUser.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">{currentUser.email}</p>
                  <p className="text-sm font-medium text-slate-500 capitalize">{currentUser.role?.toLowerCase().replace('role_', '') || 'User'}</p>
                </div>
              </div>
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faShieldHalved} className="mr-3 w-5" />
                  Admin Console
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-3 w-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full py-3 rounded-xl text-center text-base font-bold text-slate-700 bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full py-3 rounded-xl text-center text-base font-bold text-white bg-slate-900"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;