import React, { useState, useEffect, useContext } from "react";
import { authHeader } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [stats, setStats] = useState({
    daysActive: 0,
    totalLogins: 0,
  });
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  // Function to fetch user profile directly from the API
  const getUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message || "Failed to fetch user profile");
    }
  };

  // Function to update user profile
  const updateUserProfile = async (updatedData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile/update`, {
        method: 'PUT',
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      throw new Error(err.message || "Failed to update user profile");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      setUsingFallbackData(false);
      
      try {
        // First try to get data from the API
        const data = await getUserProfile();
        
        setUserData(data);
        setFormData({
          fullName: data.fullName || "",
        });
        
        // Calculate stats
        if (data.createdAt) {
          const createdDate = new Date(data.createdAt);
          const today = new Date();
          const diffTime = Math.abs(today - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setStats({
            daysActive: diffDays,
            totalLogins: data.loginCount || 0,
          });
        }
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.message);
        setUsingFallbackData(true);
        
        // Use data from auth context as fallback
        if (currentUser) {
          const fallbackData = {
            email: currentUser.email,
            fullName: currentUser.displayName || "User",
            createdAt: currentUser.metadata?.creationTime || new Date().toISOString(),
            lastLogin: currentUser.metadata?.lastSignInTime || new Date().toISOString(),
            loginCount: 0,
            accountType: currentUser.role === "ADMIN" ? "Administrator" : "Standard User",
            passwordUpdatedAt: null
          };
          
          setUserData(fallbackData);
          setFormData({
            fullName: fallbackData.fullName,
          });
          
          // Calculate stats from fallback data
          if (fallbackData.createdAt) {
            const createdDate = new Date(fallbackData.createdAt);
            const today = new Date();
            const diffTime = Math.abs(today - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setStats({
              daysActive: diffDays,
              totalLogins: fallbackData.loginCount || 0,
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const updatedProfile = await updateUserProfile(formData);
      setUserData({
        ...userData,
        ...updatedProfile,
      });
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center mb-6 border-b pb-4">
        <div className="bg-blue-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
          {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Welcome back, {userData?.fullName || "User"}!</h1>
          <p className="text-gray-600">{userData?.email}</p>
        </div>
        {usingFallbackData && (
          <div className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
            <span className="mr-1">⚠️</span>
            <span>Using local data</span>
          </div>
        )}
      </div>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          {success}
        </div>
      )}
      
      {error && !usingFallbackData && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          {error}
        </div>
      )}
      
      <div className="flex border-b mb-6">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium ${activeTab === "profile" 
            ? "border-b-2 border-blue-500 text-blue-500" 
            : "text-gray-500"}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 font-medium ${activeTab === "activity" 
            ? "border-b-2 border-blue-500 text-blue-500" 
            : "text-gray-500"}`}
        >
          Activity
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-medium ${activeTab === "settings" 
            ? "border-b-2 border-blue-500 text-blue-500" 
            : "text-gray-500"}`}
        >
          Settings
        </button>
      </div>
      
      {activeTab === "profile" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </div>
              {!editMode && (
                <button 
                  onClick={toggleEditMode}
                  className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
              )}
            </h2>
            
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData?.fullName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {userData?.createdAt 
                      ? new Date(userData.createdAt).toLocaleDateString() 
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {userData?.lastLogin 
                      ? new Date(userData.lastLogin).toLocaleString() 
                      : "Unknown"}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Account Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex items-center bg-white p-3 rounded border">
                <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-gray-500">Your account is in good standing</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white p-3 rounded border">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{userData?.accountType || (currentUser?.role === "ADMIN" ? "Administrator" : "Standard User")}</p>
                  <p className="text-sm text-gray-500">Your account type</p>
                </div>
              </div>
              
              <div className="flex items-center bg-white p-3 rounded border">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Days Active</p>
                  <p className="text-sm text-gray-500">{stats.daysActive || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "activity" && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <p className="text-gray-500 text-center py-8">No recent activity to display</p>
        </div>
      )}
      
      {activeTab === "settings" && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded border">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates</p>
              </div>
              <div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" id="toggle" className="opacity-0 absolute" />
                  <label htmlFor="toggle" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                    <span className="block h-6 w-6 rounded-full bg-white border-2 border-gray-300 transform transition-transform duration-200 ease-in"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded border">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">
                  {userData?.passwordUpdatedAt 
                    ? `Last changed: ${new Date(userData.passwordUpdatedAt).toLocaleDateString()}` 
                    : "Change your password"}
                </p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <a href="/forgot-password">Update</a>
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded border">
              <div>
                <p className="font-medium">Email Status</p>
                <p className="text-sm text-gray-500">Your email verification status</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Verified
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;