import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLayerGroup, 
  faPlus, 
  faPenToSquare, 
  faTrashCan, 
  faXmark,
  faCircleExclamation,
  faCircleCheck,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/groups");
      const activeGroups = response.data.filter(group => group.active !== false);
      setGroups(activeGroups);
      setError(null);
    } catch (err) {
      setError("Failed to load groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/groups", {
        groupName: newGroupName,
      });
      setNewGroupName("");
      setSuccess("Group added successfully!");
      setShowForm(false);
      fetchGroups();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data || "Group Already Exists!!!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGroup = async () => {
    if (!editGroupName.trim()) {
      setError("Group name cannot be empty");
      return;
    }
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/groups/${editGroupId}`, {
        groupName: editGroupName
      });
      setEditGroupId(null);
      setEditGroupName("");
      setSuccess("Group updated successfully!");
      setShowForm(false);
      setIsEditing(false);
      fetchGroups();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data || "Error updating group");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:8080/api/groups/${groupId}`, config);
      setSuccess("Group deleted successfully!");
      fetchGroups();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response && err.response.status === 403 
        ? "Permission denied: You don't have authorization." 
        : `Error deleting group: ${err.response?.data || err.message}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const initiateEditGroup = (group) => {
    setEditGroupId(group.groupId);
    setEditGroupName(group.groupName);
    setIsEditing(true);
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setError(null);
    setNewGroupName("");
    setEditGroupName("");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Group Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Organize and manage your business groups.</p>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Group</span>
              </button>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between text-red-700 animate-in slide-in-from-top-2">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCircleExclamation} />
                <span className="text-sm font-semibold">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-700 animate-in slide-in-from-top-2">
              <FontAwesomeIcon icon={faCircleCheck} />
              <span className="text-sm font-semibold">{success}</span>
            </div>
          )}

          {showForm ? (
            /* Form Card */
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-w-2xl mx-auto">
              <div className="p-6 sm:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900">
                    {isEditing ? "Update Group" : "Create New Group"}
                  </h3>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 p-2">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Retail Division"
                      value={isEditing ? editGroupName : newGroupName}
                      onChange={(e) => isEditing ? setEditGroupName(e.target.value) : setNewGroupName(e.target.value)}
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-4">
                    <button 
                      onClick={isEditing ? handleEditGroup : handleAddGroup}
                      disabled={loading}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-200 active:scale-[0.98] disabled:opacity-70"
                    >
                      {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : (isEditing ? "Save Changes" : "Create Group")}
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="px-8 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Table Section */
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 md:px-8 py-4 md:py-5">Sr.No</th>
                      <th className="px-4 md:px-8 py-4 md:py-5">Group Name</th>
                      <th className="px-4 md:px-8 py-4 md:py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && groups.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 md:px-8 py-10 md:py-20 text-center">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary-500 text-3xl mb-4" />
                          <p className="text-slate-500 font-medium">Loading your groups...</p>
                        </td>
                      </tr>
                    ) : groups.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 md:px-8 py-10 md:py-20 text-center">
                          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-3xl" />
                          </div>
                          <h3 className="text-slate-900 font-bold text-lg mb-2">No groups found</h3>
                          <p className="text-slate-500 max-w-xs mx-auto">You haven't created any groups yet. Click the button above to get started.</p>
                        </td>
                      </tr>
                    ) : (
                      groups.map((group, index) => (
                        <tr key={group.groupId} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 md:px-8 py-4 md:py-6 text-sm font-medium text-slate-500">{index + 1}</td>
                          <td className="px-4 md:px-8 py-4 md:py-6">
                            <span className="text-base font-bold text-slate-900">{group.groupName}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                            <div className="flex justify-end items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => initiateEditGroup(group)}
                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                                title="Edit Group"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </button>
                              <button 
                                onClick={() => handleDeleteGroup(group.groupId)}
                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete Group"
                              >
                                <FontAwesomeIcon icon={faTrashCan} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupManagement;