/* eslint-disable no-unused-vars */
// // import React, { useState, useEffect, useContext } from "react";
// // import { authHeader, API_URL } from "../services/authService";
// // import { AuthContext } from "../context/AuthContext";

// // const UserDashboard = () => {
// //   const [userData, setUserData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const { currentUser } = useContext(AuthContext);

// //   useEffect(() => {
// //     const fetchUserData = async () => {
// //       try {
// //         // Try to fetch from API
// //         const response = await fetch(`${API_URL}/user/profile`, {
// //           headers: {
// //             ...authHeader(),
// //             "Content-Type": "application/json",
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error("Failed to fetch user data");
// //         }

// //         const data = await response.json();
// //         setUserData(data);
// //       } catch (err) {
// //         setError(err.message);
// //         // Use data from auth context as fallback
// //         if (currentUser) {
// //           setUserData({
// //             email: currentUser.email,
// //             fullName: "User"  // We don't have this in the context
// //           });
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUserData();
// //   }, [currentUser]);

// //   if (loading) {
// //     return <div className="loader-container"><div className="loader"></div></div>;
// //   }

// //   return (
// //     <div className="dashboard-container">
// //       <div className="dashboard-header">
// //         <h2>User Dashboard</h2>
// //         <p className="dashboard-subtitle">Welcome back, {userData?.fullName || "User"}!</p>
// //       </div>
      
// //       {error && (
// //         <div className="alert alert-warning">
// //           <div className="alert-icon">⚠️</div>
// //           <div className="alert-content">{error} (Using available user data)</div>
// //         </div>
// //       )}
      
// //       <div className="dashboard-cards">
// //         <div className="dashboard-card profile-card">
// //           <div className="card-header">
// //             <h3>Profile Information</h3>
// //           </div>
// //           <div className="profile-content">
// //             <div className="profile-avatar">
// //               {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
// //             </div>
// //             <div className="profile-details">
// //               <div className="profile-item">
// //                 <span className="profile-label">Email:</span>
// //                 <span className="profile-value">{userData?.email}</span>
// //               </div>
// //               {userData?.fullName && (
// //                 <div className="profile-item">
// //                   <span className="profile-label">Name:</span>
// //                   <span className="profile-value">{userData.fullName}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="dashboard-card account-card">
// //           <div className="card-header">
// //             <h3>Account Status</h3>
// //           </div>
// //           <div className="account-content">
// //             <div className="status-item">
// //               <div className="status-icon active">✓</div>
// //               <div className="status-details">
// //                 <h4>Active</h4>
// //                 <p>Your account is in good standing</p>
// //               </div>
// //             </div>
// //             <div className="status-item">
// //               <div className="status-icon">👤</div>
// //               <div className="status-details">
// //                 <h4>User</h4>
// //                 <p>Your account type</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserDashboard;
// import React, { useState, useEffect, useContext } from "react";
// import { authHeader } from "../services/authService";
// import { AuthContext } from "../context/AuthContext";

// const UserDashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("profile");
//   const { currentUser } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
//           headers: {
//             ...authHeader(),
//             "Content-Type": "application/json",
//           },
//         });
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch user data");
//         }
        
//         const data = await response.json();
//         setUserData(data);
//       } catch (err) {
//         setError(err.message);
//         // Use data from auth context as fallback
//         if (currentUser) {
//           setUserData({
//             email: currentUser.email,
//             fullName: currentUser.displayName || "User",
//             joinDate: currentUser.metadata?.creationTime || "Unknown",
//             lastLogin: currentUser.metadata?.lastSignInTime || "Unknown",
//             accountType: "Standard"
//           });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [currentUser]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
//       <div className="flex items-center mb-6 border-b pb-4">
//         <div className="bg-blue-500 text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
//           {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "U"}
//         </div>
//         <div className="ml-4">
//           <h1 className="text-2xl font-bold">Welcome back, {userData?.fullName || "User"}!</h1>
//           <p className="text-gray-600">{userData?.email}</p>
//         </div>
//         {error && (
//           <div className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
//             <span className="mr-1">⚠️</span>
//             <span>Using local data</span>
//           </div>
//         )}
//       </div>
      
//       <div className="flex border-b mb-6">
//         <button 
//           onClick={() => setActiveTab("profile")}
//           className={`px-4 py-2 font-medium ${activeTab === "profile" 
//             ? "border-b-2 border-blue-500 text-blue-500" 
//             : "text-gray-500"}`}
//         >
//           Profile
//         </button>
//         <button 
//           onClick={() => setActiveTab("activity")}
//           className={`px-4 py-2 font-medium ${activeTab === "activity" 
//             ? "border-b-2 border-blue-500 text-blue-500" 
//             : "text-gray-500"}`}
//         >
//           Activity
//         </button>
//         <button 
//           onClick={() => setActiveTab("settings")}
//           className={`px-4 py-2 font-medium ${activeTab === "settings" 
//             ? "border-b-2 border-blue-500 text-blue-500" 
//             : "text-gray-500"}`}
//         >
//           Settings
//         </button>
//       </div>
      
//       {activeTab === "profile" && (
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-lg font-medium mb-4 flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//               </svg>
//               Personal Information
//             </h2>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{userData?.email}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Full Name</p>
//                 <p className="font-medium">{userData?.fullName || "Not provided"}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Member Since</p>
//                 <p className="font-medium">{userData?.joinDate || "Unknown"}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-lg font-medium mb-4 flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               Account Status
//             </h2>
//             <div className="space-y-4">
//               <div className="flex items-center bg-white p-3 rounded border">
//                 <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Active</p>
//                   <p className="text-sm text-gray-500">Your account is in good standing</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center bg-white p-3 rounded border">
//                 <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">{userData?.accountType || "Standard"}</p>
//                   <p className="text-sm text-gray-500">Your account type</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center bg-white p-3 rounded border">
//                 <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-medium">Last Login</p>
//                   <p className="text-sm text-gray-500">{userData?.lastLogin || "Unknown"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === "activity" && (
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
//           <p className="text-gray-500 text-center py-8">No recent activity to display</p>
//         </div>
//       )}
      
//       {activeTab === "settings" && (
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h2 className="text-lg font-medium mb-4">Account Settings</h2>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center p-3 bg-white rounded border">
//               <div>
//                 <p className="font-medium">Email Notifications</p>
//                 <p className="text-sm text-gray-500">Receive email updates</p>
//               </div>
//               <div>
//                 <div className="relative inline-block w-10 mr-2 align-middle select-none">
//                   <input type="checkbox" id="toggle" className="opacity-0 absolute" />
//                   <label htmlFor="toggle" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
//                     <span className="block h-6 w-6 rounded-full bg-white border-2 border-gray-300 transform transition-transform duration-200 ease-in"></span>
//                   </label>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-white rounded border">
//               <div>
//                 <p className="font-medium">Two-Factor Authentication</p>
//                 <p className="text-sm text-gray-500">Add extra security to your account</p>
//               </div>
//               <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                 Setup
//               </button>
//             </div>
            
//             <div className="flex justify-between items-center p-3 bg-white rounded border">
//               <div>
//                 <p className="font-medium">Password</p>
//                 <p className="text-sm text-gray-500">Change your password</p>
//               </div>
//               <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Dashboard = () => {
//     const [groups, setGroups] = useState([]);
//     const [newGroupName, setNewGroupName] = useState("");
//     const [editGroupId, setEditGroupId] = useState(null);
//     const [editGroupName, setEditGroupName] = useState("");
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchGroups();
//     }, []);

//     // Fetch All Groups
//     const fetchGroups = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/groups");
//             setGroups(response.data);
//         } catch (err) {
//             console.error("Error fetching groups:", err);
//         }
//     };

//     // Add a New Group
//     const handleAddGroup = async () => {
//         if (!newGroupName.trim()) {
//             setError("Group name cannot be empty");
//             return;
//         }
//         try {
//             const response = await axios.post("http://localhost:8080/api/groups", {
//                 groupName: newGroupName, // Ensure key matches the backend entity
//             });
    
//             console.log("Group Added:", response.data);
//             setNewGroupName(""); // Reset input field
//             setError(null);
//             fetchGroups(); // Refresh groups list
//         } catch (err) {
//             console.error("Error adding group:", err.response?.data);
//             setError(err.response?.data || "Error adding group");
//         }
//     };
    

//     // Edit an Existing Group
//     const handleEditGroup = async () => {
//         if (!editGroupName.trim()) {
//             setError("Group name cannot be empty");
//             return;
//         }
//         try {
//             await axios.put(`http://localhost:8080/api/groups/${editGroupId}`, editGroupName, {
//                 headers: { "Content-Type": "text/plain" },
//             });
//             setEditGroupId(null);
//             setEditGroupName("");
//             setError(null);
//             fetchGroups();
//         } catch (err) {
//             setError(err.response?.data || "Error updating group");
//         }
//     };

//     // Delete Group (Soft Delete)
//     const handleDeleteGroup = async (groupId) => {
//         if (!window.confirm("Are you sure you want to delete this group?")) return;
    
//         try {
//             // Remove the Authorization header since it's not required in the backend
//             const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`);
//             console.log("Delete response:", response.data);
//             alert("Group deleted successfully");
//             fetchGroups(); // Refresh list
//         } catch (err) {
//             console.error("Error deleting group", err);
//             alert(err.response?.data || "Error deleting group");
//         }
//     };
    

//     return (
//         <div className="dashboard">
//             <h2>Manage Groups</h2>

//             {/* Add New Group */}
//             <div className="group-form">
//                 <input
//                     type="text"
//                     placeholder="Enter Unique Group Name"
//                     value={newGroupName}
//                     onChange={(e) => setNewGroupName(e.target.value)}
//                 />
//                 <button onClick={handleAddGroup}>Add Group</button>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             {/* Groups Table */}
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Sr.No</th>
//                         <th>Group Name</th>
//                         <th>Edit</th>
//                         <th>Delete</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {groups.map((group, index) => (
//                         <tr key={group.id}>
//                             <td>{index + 1}</td>
//                             <td>{group.groupName}</td>
//                             <td>
//                                 <button
//                                     onClick={() => {
//                                         setEditGroupId(group.id);
//                                         setEditGroupName(group.groupName);
//                                     }}
//                                 >
//                                     Edit
//                                 </button>
//                             </td>
//                             <td>
//                                 <button className="delete" onClick={() => handleDeleteGroup(group.id)}>
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Edit Group Form */}
//             {editGroupId && (
//                 <div className="edit-group">
//                     <input
//                         type="text"
//                         value={editGroupName}
//                         onChange={(e) => setEditGroupName(e.target.value)}
//                     />
//                     <button onClick={handleEditGroup}>Update</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Dashboard = () => {
//     const [groups, setGroups] = useState([]);
//     const [newGroupName, setNewGroupName] = useState("");
//     const [editGroupId, setEditGroupId] = useState(null);
//     const [editGroupName, setEditGroupName] = useState("");
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchGroups();
//     }, []);

//     // Fetch All Groups
//     const fetchGroups = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/api/groups");
//             setGroups(response.data);
//             console.log("Fetched groups:", response.data);
//         } catch (err) {
//             console.error("Error fetching groups:", err);
//         }
//     };

//     // Add a New Group
//     const handleAddGroup = async () => {
//         if (!newGroupName.trim()) {
//             setError("Group name cannot be empty");
//             return;
//         }
//         try {
//             const response = await axios.post("http://localhost:8080/api/groups", {
//                 groupName: newGroupName,
//             });
    
//             console.log("Group Added:", response.data);
//             setNewGroupName("");
//             setError(null);
//             fetchGroups();
//         } catch (err) {
//             console.error("Error adding group:", err.response?.data);
//             setError(err.response?.data || "Error adding group");
//         }
//     };
    
//     // Edit an Existing Group
//     const handleEditGroup = async () => {
//         if (!editGroupName.trim()) {
//             setError("Group name cannot be empty");
//             return;
//         }
//         try {
//             // Send the groupName as a JSON object
//             const response = await axios.put(`http://localhost:8080/api/groups/${editGroupId}`, {
//                 groupName: editGroupName
//             });
//             console.log("Update response:", response.data);
//             setEditGroupId(null);
//             setEditGroupName("");
//             setError(null);
//             fetchGroups();
//         } catch (err) {
//             console.error("Error updating group:", err);
//             setError(err.response?.data || "Error updating group");
//         }
//     };

//     const handleDeleteGroup = async (groupId) => {
//         if (!window.confirm("Are you sure you want to delete this group?")) return;
    
//         try {
//             console.log("Attempting to delete group with ID:", groupId);
            
//             // Get the authentication token from wherever you store it
//             const token = localStorage.getItem("token"); // or sessionStorage, or from a context
            
//             const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            
//             const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`, config);
            
//             console.log("Delete response:", response.data);
//             alert("Group deleted successfully");
//             fetchGroups(); // Refresh list
//         } catch (err) {
//             console.error("Error deleting group:", err);
            
//             if (err.response && err.response.status === 403) {
//                 alert("Permission denied: You don't have authorization to delete this group.");
//             } else {
//                 alert(`Error deleting group: ${err.response?.data || err.message}`);
//             }
//         }
//     };
    
//     return (
//         <div className="dashboard">
//             <h2>Manage Groups</h2>

//             {/* Add New Group */}
//             <div className="group-form">
//                 <input
//                     type="text"
//                     placeholder="Enter Unique Group Name"
//                     value={newGroupName}
//                     onChange={(e) => setNewGroupName(e.target.value)}
//                 />
//                 <button onClick={handleAddGroup}>Add Group</button>
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             {/* Groups Table */}
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Sr.No</th>
//                         <th>Group Name</th>
//                         <th>Edit</th>
//                         <th>Delete</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {groups.map((group, index) => (
//                         <tr key={group.groupId}>
//                             <td>{index + 1}</td>
//                             <td>{group.groupName}</td>
//                             <td>
//                                 <button
//                                     onClick={() => {
//                                         console.log("Edit clicked for group:", group);
//                                         setEditGroupId(group.groupId);
//                                         setEditGroupName(group.groupName);
//                                     }}
//                                 >
//                                     Edit
//                                 </button>
//                             </td>
//                             <td>
//                                 <button className="delete" onClick={() => handleDeleteGroup(group.groupId)}>
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Edit Group Form */}
//             {editGroupId && (
//                 <div className="edit-group">
//                     <input
//                         type="text"
//                         value={editGroupName}
//                         onChange={(e) => setEditGroupName(e.target.value)}
//                     />
//                     <button onClick={handleEditGroup}>Update</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [editGroupId, setEditGroupId] = useState(null);
    const [editGroupName, setEditGroupName] = useState("");
    const [error, setError] = useState(null);
    const [totalGroups, setTotalGroups] = useState(0);
    const [showAddGroup, setShowAddGroup] = useState(false);
    const [showEditGroup, setShowEditGroup] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchGroups();
    }, []);

    // Fetch All Groups
    const fetchGroups = async () => {
        try {
          setLoading(true);
          const response = await axios.get("http://localhost:8080/api/groups");
          const activeGroups = response.data.filter(group => group.active !== false);
          setGroups(activeGroups);
          setTotalGroups(activeGroups.length);
          console.log("Fetched groups:", response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching groups:", err);
          setError("Failed to load groups. Please try again.");
        } finally {
          setLoading(false);
        }
      };
    // Add a New Group
    const handleAddGroup = async () => {
        if (!newGroupName.trim()) {
            setError("Group name cannot be empty");
            return;
        }
        try {
            const response = await axios.post("http://localhost:8080/api/groups", {
                groupName: newGroupName,
            });
    
            console.log("Group Added:", response.data);
            setNewGroupName("");
            setError(null);
            setShowAddGroup(false);
            fetchGroups();
        } catch (err) {
            console.error("Error adding group:", err.response?.data);
            setError(err.response?.data || "Group Already Exists!!!");
        }
    };
    
    // Edit an Existing Group
    const handleEditGroup = async () => {
        if (!editGroupName.trim()) {
            setError("Group name cannot be empty");
            return;
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/groups/${editGroupId}`, {
                groupName: editGroupName
            });
            console.log("Update response:", response.data);
            setEditGroupId(null);
            setEditGroupName("");
            setError(null);
            setShowEditGroup(false);
            fetchGroups();
        } catch (err) {
            console.error("Error updating group:", err);
            setError(err.response?.data || "Error updating group");
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;
    
        try {
            console.log("Attempting to delete group with ID:", groupId);
            
            // Get the authentication token from wherever you store it
            const token = localStorage.getItem("token"); // or sessionStorage, or from a context
            
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            
            const response = await axios.delete(`http://localhost:8080/api/groups/${groupId}`, config);
            
            console.log("Delete response:", response.data);
            alert("Group deleted successfully");
            fetchGroups(); // Refresh list
        } catch (err) {
            console.error("Error deleting group:", err);
            
            if (err.response && err.response.status === 403) {
                alert("Permission denied: You don't have authorization to delete this group.");
            } else {
                alert(`Error deleting group: ${err.response?.data || err.message}`);
            }
        }
    };

    const initiateEditGroup = (group) => {
        setEditGroupId(group.groupId);
        setEditGroupName(group.groupName);
        setShowEditGroup(true);
        setShowAddGroup(false);
    };
    
    return (
        <div className="dashboard-container">
            {/* Header */}
            {/* <div className="header">
                <div className="logo">Invoice</div>
                <div className="section-title">| Manage Group Section</div>
            </div> */}

            <div className="main-content">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="menu-item">Dashboard</div>
                    <div className="menu-item active">Manage Groups</div>
                    <div className="menu-item">Manage Chain</div>
                    <div className="menu-item">Manage Brands</div>
                    <div className="menu-item">Manage SubZones</div>
                    <div className="menu-item">Manage Estimate</div>
                    <div className="menu-item">Manage Invoices</div>
                </div>

                {/* Main Content Area */}
                <div className="content-area">
                    {!showAddGroup && !showEditGroup && (
                        <>
                            {/* Total Groups Card */}
                            <div className="stats-card">
                                <div className="card-title">Total Groups</div>
                                <div className="card-value">{totalGroups}</div>
                            </div>

                            {/* Add Group Button */}
                            <button 
                                className="add-group-btn" 
                                onClick={() => setShowAddGroup(true)}
                            >
                                Add Group
                            </button>

                            {/* Groups Table */}
                            <table className="groups-table">
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Group Name</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group, index) => (
                                        <tr key={group.groupId}>
                                            <td>{index + 1}</td>
                                            <td>{group.groupName}</td>
                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => initiateEditGroup(group)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button 
                                                    className="delete-btn" 
                                                    onClick={() => handleDeleteGroup(group.groupId)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {/* Add Group Form */}
                    {showAddGroup && (
                        <div className="group-form">
                            <h3>Enter Group Name:</h3>
                            <input
                                type="text"
                                placeholder="Enter Unique Group Name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="form-input"
                            />
                            <button 
                                className="submit-btn"
                                onClick={handleAddGroup}
                            >
                                Add Group
                            </button>
                            {error && <div className="error-message">{error}</div>}
                        </div>
                    )}

                    {/* Edit Group Form */}
                    {showEditGroup && (
                        <div className="group-form">
                            <h3>Edit Group Name:</h3>
                            <input
                                type="text"
                                value={editGroupName}
                                onChange={(e) => setEditGroupName(e.target.value)}
                                className="form-input"
                            />
                            <button 
                                className="submit-btn"
                                onClick={handleEditGroup}
                            >
                                Update
                            </button>
                            {error && <div className="error-message">{error}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;