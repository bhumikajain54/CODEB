import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faShield, 
  faArrowRight, 
  faCircleExclamation, 
  faCircleCheck,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

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
    setVerificationMessage("");

    if (formData.passwordHash !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registrationData } = formData;

    try {
      await register(registrationData);
      setVerificationMessage(
        "Registration successful. Please check your email to verify your account."
      );
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-primary-100/40 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-100/40 blur-[100px] rounded-full"></div>

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-6 sm:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl text-primary-600 mb-6 shadow-sm">
                <FontAwesomeIcon icon={faUser} className="text-2xl" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
              <p className="mt-2 text-slate-500 font-medium">Join our professional invoicing platform</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-700 animate-in slide-in-from-top-2">
                <FontAwesomeIcon icon={faCircleExclamation} className="flex-shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}
            
            {verificationMessage && (
              <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-xl" />
                </div>
                <h3 className="text-emerald-900 font-bold mb-2 text-lg">Check your email</h3>
                <p className="text-emerald-700 text-sm leading-relaxed">{verificationMessage}</p>
                <Link to="/login" className="mt-6 inline-block text-primary-600 font-bold hover:text-primary-700">
                  Return to Login
                </Link>
              </div>
            )}

            {!verificationMessage && (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="md:col-span-2">
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
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1" htmlFor="passwordHash">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <input
                      type="password"
                      name="passwordHash"
                      id="passwordHash"
                      value={formData.passwordHash}
                      onChange={handleChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1" htmlFor="confirmPassword">
                    Confirm
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1" htmlFor="role">
                    Account Type
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <FontAwesomeIcon icon={faShield} />
                    </div>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="USER">Standard User</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-primary-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-sm" />
                      </>
                    )}
                  </button>
                </div>

                <div className="md:col-span-2 text-center pt-2">
                  <p className="text-slate-500 text-sm font-medium">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;