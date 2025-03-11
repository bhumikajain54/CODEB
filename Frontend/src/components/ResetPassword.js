// import React, { useState } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { resetPassword } from "../services/authService";

// const ResetPassword = () => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
    
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     const token = new URLSearchParams(location.search).get("token");

//     if (!token) {
//       setError("Invalid reset token. Please request a new password reset link.");
//       setLoading(false);
//       return;
//     }

//     try {
//       await resetPassword(token, newPassword);
//       setMessage("Password reset successfully. Redirecting to login...");
//       setTimeout(() => navigate("/login"), 3000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h2>Reset Password</h2>
//           <p>Create a new password for your account</p>
//         </div>
        
//         {message && (
//           <div className="alert alert-success">
//             <div className="alert-icon">✅</div>
//             <div className="alert-content">{message}</div>
//           </div>
//         )}
        
//         {error && (
//           <div className="alert alert-error">
//             <div className="alert-icon">❌</div>
//             <div className="alert-content">{error}</div>
//           </div>
//         )}
        
//         {!message && (
//           <form onSubmit={handleSubmit} className="auth-form">
//             <div className="form-group">
//               <label htmlFor="newPassword">New Password</label>
//               <input
//                 type="password"
//                 name="newPassword"
//                 id="newPassword"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
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
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 placeholder="••••••••"
//               />
//             </div>
            
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn btn-primary btn-block"
//             >
//               {loading ? (
//                 <span className="loading-spinner"></span>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
            
//             <div className="auth-alt-action">
//               Remember your password? <Link to="/login">Log in</Link>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
// src/components/ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { validateResetToken, resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setValidatingToken(false);
      return;
    }

    // Validate the token when component mounts
    const validateToken = async () => {
      try {
        await validateResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setError(err.message || "Invalid or expired token. Please request a new password reset.");
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const token = new URLSearchParams(location.search).get("token");

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message || "Password reset successfully.");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Password reset successfully. You can now log in with your new password." } 
        });
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Reset Password</h2>
          </div>
          <div className="token-validating">
            <div className="loader"></div>
            <p>Validating your reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Create a new password for your account</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">❌</div>
            <div className="alert-content">{error}</div>
          </div>
        )}
        
        {message && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <div className="alert-content">{message}</div>
          </div>
        )}
        
        {!tokenValid && !message ? (
          <div className="invalid-token">
            <div className="error-icon">❌</div>
            <p>Your password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Reset Link
            </Link>
          </div>
        ) : !message && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Reset Password"
              )}
            </button>
            
            <div className="auth-alt-action">
              Remember your password? <Link to="/login">Log in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;