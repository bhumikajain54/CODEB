const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // If running on localhost, use the local backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:8080/api';
  }
  
  // For production (Netlify or Railway-hosted)
  // 1. Try REACT_APP_API_URL_SERVER (specific prod backend)
  // 2. Try REACT_APP_API_URL (generic backend var)
  // 3. Default to current domain + /api (works if served by backend)
  return process.env.REACT_APP_API_URL_SERVER || 
         process.env.REACT_APP_API_URL || 
         `${window.location.origin}/api`;
};

export const API_URL = getApiUrl();
