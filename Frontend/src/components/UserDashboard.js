import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrashCan,
  faCircleCheck,
  faCircleExclamation,
  faXmark,
  faLayerGroup,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const UserDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
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
      const response = await axios.get(`${API_URL}/groups`);
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setTotalGroups(activeGroups.length);
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
      await axios.post(`${API_URL}/groups`, {
        groupName: newGroupName,
      });

      setNewGroupName("");
      setError(null);
      setSuccess("Group added successfully!");
      setShowAddGroup(false);
      fetchGroups();

      setTimeout(() => setSuccess(null), 3000);
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
      await axios.put(`${API_URL}/groups/${editGroupId}`, {
        groupName: editGroupName
      });
      setEditGroupId(null);
      setEditGroupName("");
      setError(null);
      setSuccess("Group updated successfully!");
      setShowEditGroup(false);
      fetchGroups();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating group:", err);
      setError(err.response?.data || "Error updating group");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_URL}/groups/${groupId}`, config);

      setSuccess("Group deleted successfully!");
      fetchGroups();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting group:", err);
      if (err.response && err.response.status === 403) {
        setError("Permission denied: You don't have authorization to delete this group.");
      } else {
        setError(`Error deleting group: ${err.response?.data || err.message}`);
      }
      setTimeout(() => setError(null), 5000);
    }
  };

  const initiateEditGroup = (group) => {
    setEditGroupId(group.groupId);
    setEditGroupName(group.groupName);
    setShowEditGroup(true);
    setShowAddGroup(false);
  };

  const handleCancel = () => {
    setShowAddGroup(false);
    setShowEditGroup(false);
    setError(null);
    setNewGroupName("");
    setEditGroupName("");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Group Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Organize and manage your business groups effortlessly.</p>
            </div>
            {!showAddGroup && !showEditGroup && (
              <button
                onClick={() => setShowAddGroup(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                <span>Create Group</span>
              </button>
            )}
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 flex items-center justify-between p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCircleExclamation} />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCircleCheck} />
                <span className="text-sm font-medium">{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600 transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {!showAddGroup && !showEditGroup ? (
            <>
              {/* Stats Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-xl" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium">Total Groups</p>
                      <h3 className="text-2xl font-bold text-slate-900">{totalGroups}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Sr.No</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Group Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary-500 text-2xl mb-2" />
                          <p className="text-slate-500 text-sm">Loading your groups...</p>
                        </td>
                      </tr>
                    ) : groups.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center">
                          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-2xl" />
                          </div>
                          <p className="text-slate-500 font-medium">No groups found</p>
                          <p className="text-slate-400 text-sm mt-1">Start by creating your first group</p>
                        </td>
                      </tr>
                    ) : (
                      groups.map((group, index) => (
                        <tr key={group.groupId} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">{index + 1}</td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-900">{group.groupName}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center space-x-2">
                              <button
                                onClick={() => initiateEditGroup(group)}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                                title="Edit"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.groupId)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete"
                              >
                                <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Form Card (Add/Edit) */
            <div className="bg-white max-w-2xl mx-auto rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">
                  {showAddGroup ? "Create New Group" : "Update Group Details"}
                </h3>
                <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Corporate Accounts"
                      value={showAddGroup ? newGroupName : editGroupName}
                      onChange={(e) => showAddGroup ? setNewGroupName(e.target.value) : setEditGroupName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-10">
                  <button
                    onClick={showAddGroup ? handleAddGroup : handleEditGroup}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-200 active:scale-[0.98]"
                  >
                    {showAddGroup ? "Create Group" : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;