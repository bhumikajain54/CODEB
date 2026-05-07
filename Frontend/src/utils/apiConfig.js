const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // If running on localhost, use the local backend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL_LOCAL || 'http://localhost:8080/api';
  }
  
  // Otherwise, use the production/server backend
  return process.env.REACT_APP_API_URL_SERVER || process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
};

export const API_URL = getApiUrl();
