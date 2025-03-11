// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { verifyEmail } from "../services/authService";

// const VerifyEmail = () => {
//   const [verificationStatus, setVerificationStatus] = useState({
//     success: false,
//     message: "Verifying your email...",
//     loading: true
//   });
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const token = queryParams.get("token");

//     if (!token) {
//       setVerificationStatus({
//         success: false,
//         message: "Invalid verification link.",
//         loading: false
//       });
//       return;
//     }

//     const performEmailVerification = async () => {
//       try {
//         await verifyEmail(token);
//         setVerificationStatus({
//           success: true,
//           message: "Email verified successfully! Redirecting to login...",
//           loading: false
//         });

//         // Redirect to login after 3 seconds
//         setTimeout(() => {
//           navigate("/login");
//         }, 3000);
//       } catch (error) {
//         setVerificationStatus({
//           success: false,
//           message: error.message || "Email verification failed.",
//           loading: false
//         });
//       }
//     };

//     performEmailVerification();
//   }, [location, navigate]);

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h2>{verificationStatus.success ? "Email Verified" : "Verifying Email"}</h2>
//         </div>
        
//         {verificationStatus.loading ? (
//           <div className="verification-loading">
//             <div className="loader"></div>
//             <p>Verifying your email address...</p>
//           </div>
//         ) : (
//           <div className={`verification-result ${verificationStatus.success ? 'success' : 'error'}`}>
//             <div className="verification-icon">
//               {verificationStatus.success ? '✅' : '❌'}
//             </div>
//             <p>{verificationStatus.message}</p>
            
//             {!verificationStatus.success && (
//               <Link to="/register" className="btn btn-primary">
//                 Back to Registration
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyEmail;
// src/components/VerifyEmail.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyEmail } from "../services/authService";

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    success: false,
    message: "Verifying your email...",
    loading: true
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      setVerificationStatus({
        success: false,
        message: "Invalid verification link.",
        loading: false
      });
      return;
    }

    const performEmailVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setVerificationStatus({
          success: true,
          message: response.message || "Email verified successfully! Redirecting to login...",
          loading: false
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { message: "Email verified successfully! You can now log in." } 
          });
        }, 3000);
      } catch (error) {
        setVerificationStatus({
          success: false,
          message: error.message || "Email verification failed.",
          loading: false
        });
      }
    };

    performEmailVerification();
  }, [location, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{verificationStatus.success ? "Email Verified" : "Verifying Email"}</h2>
        </div>
        
        {verificationStatus.loading ? (
          <div className="verification-loading">
            <div className="loader"></div>
            <p>Verifying your email address...</p>
          </div>
        ) : (
          <div className={`verification-result ${verificationStatus.success ? 'success' : 'error'}`}>
            <div className="verification-icon">
              {verificationStatus.success ? '✅' : '❌'}
            </div>
            <p>{verificationStatus.message}</p>
            
            {!verificationStatus.success && (
              <div className="verification-actions">
                <Link to="/register" className="btn btn-secondary">
                  Back to Registration
                </Link>
                <Link to="/" className="btn btn-primary">
                  Go to Home
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;