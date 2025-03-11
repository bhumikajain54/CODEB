// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { login } from "../services/authService";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { setCurrentUser } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const data = await login(formData);
//       setCurrentUser({
//         token: data.token,
//         role: data.role,
//         email: data.email,
//       });

//       // Redirect based on role
//       if (data.role === "ADMIN" || data.role === "ROLE_ADMIN") {
//         navigate("/admin");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md fade-in">
//       <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 mb-2" htmlFor="email">
//             Email Address
//           </label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             placeholder="you@example.com"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             id="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//             placeholder="••••••••"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
//         >
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <div className="flex flex-col items-center mt-6 space-y-4">
//           <Link
//             to="/forgot-password"
//             className="text-blue-500 hover:text-blue-700"
//           >
//             Forgot Password?
//           </Link>
          
//           <div className="text-gray-700">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;
// src/components/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a message from a redirect (like after registration)
    if (location.state && location.state.message) {
      setSuccess(location.state.message);
      
      // Clear the location state after displaying the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await login(credentials);
      
      // Redirect based on user role
      const role = response.role || "";
      if (role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Log in to your account</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">❌</div>
            <div className="alert-content">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <div className="alert-content">{success}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? <span className="loading-spinner"></span> : "Log In"}
          </button>
          
          <div className="auth-alt-action">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;