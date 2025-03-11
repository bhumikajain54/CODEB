// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { register } from "../services/authService";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     passwordHash: "",
//     confirmPassword: "",
//     role: "USER" // Default role
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [verificationMessage, setVerificationMessage] = useState("");

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
//     setVerificationMessage("");

//     // Validate passwords match
//     if (formData.passwordHash !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     // Create registration object (excluding confirmPassword)
//     const { confirmPassword, ...registrationData } = formData;

//     try {
//       await register(registrationData);
//       // Show verification message instead of immediately navigating
//       setVerificationMessage(
//         "Registration successful. Please check your email to verify your account."
//       );
//     } catch (err) {
//       setError("Registration failed: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card register-card">
//         <div className="auth-header">
//           <h2>Create Account</h2>
//           <p>Join our platform today</p>
//         </div>
        
//         {error && (
//           <div className="alert alert-error">
//             <div className="alert-icon">❌</div>
//             <div className="alert-content">{error}</div>
//           </div>
//         )}
        
//         {verificationMessage && (
//           <div className="alert alert-success">
//             <div className="alert-icon">✅</div>
//             <div className="alert-content">{verificationMessage}</div>
//           </div>
//         )}
        
//         {!verificationMessage && (
//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="form-group">
//               <label htmlFor="fullName">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 id="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 required
//                 placeholder="John Doe"
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="your@email.com"
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="passwordHash">Password</label>
//               <input
//                 type="password"
//                 name="passwordHash"
//                 id="passwordHash"
//                 value={formData.passwordHash}
//                 onChange={handleChange}
//                 required
//                 placeholder="••••••••"
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="confirmPassword">Confirm Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 id="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 placeholder="••••••••"
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="role">Account Type</label>
//               <select
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="USER">User</option>
//                 <option value="ADMIN">Admin</option>
//               </select>
//             </div>
            
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary btn-block"
//             >
//               {loading ? (
//                 <span className="loading-spinner"></span>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
            
//             <div className="auth-alt-action">
//               Already have an account? <Link to="/login">Log in</Link>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Register;
// src/components/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    passwordHash: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!user.email || !user.passwordHash || !user.firstName || !user.lastName) {
      setError("All fields are required");
      return false;
    }

    if (user.passwordHash !== user.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Email validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password strength validation (optional)
    if (user.passwordHash.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash
      };
      
      const response = await register(userData);
      setSuccess(response.message || "Registration successful! Please check your email to verify your account.");
      
      // Clear form after successful registration
      setUser({
        firstName: "",
        lastName: "",
        email: "",
        passwordHash: "",
        confirmPassword: ""
      });
      
      // Redirect to a "check your email" page or login page after a delay
      setTimeout(() => {
        navigate("/login", { state: { message: "Registration successful! Please check your email to verify your account." } });
      }, 3000);
      
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
          <h2>Create an Account</h2>
          <p>Fill in your details to get started</p>
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
          <div className="name-fields">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="passwordHash">Password</label>
            <input
              type="password"
              id="passwordHash"
              name="passwordHash"
              value={user.passwordHash}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? <span className="loading-spinner"></span> : "Register"}
          </button>
          
          <div className="auth-alt-action">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;