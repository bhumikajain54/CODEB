// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { forgotPassword } from "../services/authService";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await forgotPassword(email);
//       setMessage("If the email exists, you will receive a password reset link.");
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
//           <h2>Forgot Password</h2>
//           <p>Enter your email to receive a reset link</p>
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
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="your@email.com"
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
//                 "Send Reset Link"
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

// export default ForgotPassword;
// src/components/ForgotPassword.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    
    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || "If the email exists, you will receive a password reset link.");
      setSubmitted(true);
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
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">❌</div>
            <div className="alert-content">{error}</div>
          </div>
        )}
        
        {submitted && message ? (
          <div className="password-reset-sent">
            <div className="success-icon">✅</div>
            <p className="success-message">{message}</p>
            <div className="reset-instructions">
              <p>Please check your inbox and follow the instructions in the email.</p>
              <p>If you don't see the email, please check your spam folder.</p>
            </div>
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
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
                "Send Reset Link"
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

export default ForgotPassword;