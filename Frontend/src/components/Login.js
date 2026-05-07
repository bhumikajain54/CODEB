import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRight, faCircleExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData);
      
      if (response.error) {
        if (response.error.includes("Account not verified")) {
          setError("Account not verified. Please check your email.");
        } else if (response.error.includes("Invalid email or password")) {
          setError("Invalid email or password");
        } else {
          setError(response.error);
        }
        return;
      }

      setCurrentUser({
        token: response.token,
        role: response.role,
        email: response.email,
      });

      const normalizedRole = response.role.replace("ROLE_", "");
      if (normalizedRole === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-primary-100/40 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-100/40 blur-[100px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-6 sm:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl text-primary-600 mb-6 shadow-sm">
                <FontAwesomeIcon icon={faLock} className="text-2xl" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="mt-2 text-slate-500 font-medium">Please enter your details to sign in</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700 animate-in slide-in-from-top-2">
                <FontAwesomeIcon icon={faCircleExclamation} className="flex-shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-sm font-bold text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-primary-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-sm" />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-slate-500 text-sm font-medium">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;