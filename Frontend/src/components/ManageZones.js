import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, 
  faPlus, 
  faPenToSquare, 
  faTrashCan, 
  faXmark,
  faCircleExclamation,
  faCircleCheck,
  faSpinner,
  faFilter,
  faBuilding,
  faTags,
  faLayerGroup
} from "@fortawesome/free-solid-svg-icons";

const ManageZones = () => {
  const [zones, setZones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  
  const [newZoneName, setNewZoneName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [editZoneId, setEditZoneId] = useState(null);
  const [editZoneName, setEditZoneName] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [filterBrandId, setFilterBrandId] = useState("");
  const [filterChainId, setFilterChainId] = useState("");
  const [filterGroupId, setFilterGroupId] = useState("");



  useEffect(() => {
    fetchZones();
    fetchBrands();
    fetchChains();
    fetchGroups();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/zones`);
      setZones(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load zones.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      setBrands(response.data);
    } catch (err) {}
  };

  const fetchChains = async () => {
    try {
      const response = await axios.get(`${API_URL}/chains`);
      setChains(response.data);
    } catch (err) {}
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (err) {}
  };

  const handleAddZone = async () => {
    if (!newZoneName.trim() || !selectedBrandId) {
      setError("Zone name and brand selection are required.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/zones?brandId=${selectedBrandId}`, { zoneName: newZoneName });
      setSuccess("Zone added successfully!");
      setShowForm(false);
      fetchZones();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Zone already exists for this brand!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditZone = async () => {
    if (!editZoneName.trim() || !editBrandId) {
      setError("Zone name and brand selection are required.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/zones/${editZoneId}?brandId=${editBrandId}`, { zoneName: editZoneName });
      setSuccess("Zone updated successfully!");
      setShowForm(false);
      setIsEditing(false);
      fetchZones();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error updating zone");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async (zoneId) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_URL}/zones/${zoneId}`, config);
      setSuccess("Zone deleted successfully!");
      fetchZones();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting zone");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const initiateEditZone = (zone) => {
    setEditZoneId(zone.id || zone.zoneId);
    setEditZoneName(zone.zoneName);
    setEditBrandId(zone.brand?.brandId || "");
    setIsEditing(true);
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setError(null);
    setNewZoneName("");
    setSelectedBrandId("");
  };

  const filteredZones = zones.filter(zone => {
    const matchesBrand = !filterBrandId || (zone.brand && zone.brand.brandId.toString() === filterBrandId);
    const matchesChain = !filterChainId || (zone.brand?.chain && zone.brand.chain.chainId.toString() === filterChainId);
    const matchesGroup = !filterGroupId || (zone.brand?.chain?.group && zone.brand.chain.group.groupId.toString() === filterGroupId);
    return matchesBrand && matchesChain && matchesGroup;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Zone Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Organize and manage geographic or organizational zones.</p>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Zone</span>
              </button>
            )}
          </div>

          {/* Stats Section */}
          {!showForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Zones</p>
                  <h3 className="text-2xl font-black text-slate-900">{zones.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Groups</p>
                  <h3 className="text-2xl font-black text-slate-900">{groups.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                  <FontAwesomeIcon icon={faBuilding} className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Chains</p>
                  <h3 className="text-2xl font-black text-slate-900">{chains.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                  <FontAwesomeIcon icon={faTags} className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Brands</p>
                  <h3 className="text-2xl font-black text-slate-900">{brands.length}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Filters Bar */}
          {!showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100">
                  <FontAwesomeIcon icon={faFilter} className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Group</p>
                  <select 
                    value={filterGroupId}
                    onChange={(e) => setFilterGroupId(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Groups</option>
                    {groups.map(g => <option key={g.groupId} value={g.groupId}>{g.groupName}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100">
                  <FontAwesomeIcon icon={faBuilding} className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Company</p>
                  <select 
                    value={filterChainId}
                    onChange={(e) => setFilterChainId(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Companies</option>
                    {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.companyName}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100">
                  <FontAwesomeIcon icon={faTags} className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Brand</p>
                  <select 
                    value={filterBrandId}
                    onChange={(e) => setFilterBrandId(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Brands</option>
                    {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

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
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-w-3xl mx-auto">
              <div className="p-6 sm:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {isEditing ? "Update Zone" : "Create New Zone"}
                  </h3>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 p-2">
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                      Zone Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. North Region"
                      value={isEditing ? editZoneName : newZoneName}
                      onChange={(e) => isEditing ? setEditZoneName(e.target.value) : setNewZoneName(e.target.value)}
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                      Select Brand
                    </label>
                    <select
                      value={isEditing ? editBrandId : selectedBrandId}
                      onChange={(e) => isEditing ? setEditBrandId(e.target.value) : setSelectedBrandId(e.target.value)}
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Choose a brand</option>
                      {brands.map(brand => (
                        <option key={brand.brandId} value={brand.brandId}>{brand.brandName} ({brand.chain?.companyName})</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-4 pt-6">
                    <button 
                      onClick={isEditing ? handleEditZone : handleAddZone}
                      disabled={loading}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-200 active:scale-[0.98] disabled:opacity-70"
                    >
                      {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : (isEditing ? "Update Zone" : "Create Zone")}
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
                      <th className="px-4 md:px-8 py-4 md:py-5">Zone Name</th>
                      <th className="px-4 md:px-8 py-4 md:py-5">Brand</th>
                      <th className="px-4 md:px-8 py-4 md:py-5">Company</th>
                      <th className="px-4 md:px-8 py-4 md:py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && zones.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 md:px-8 py-10 md:py-20 text-center">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary-500 text-3xl mb-4" />
                          <p className="text-slate-500 font-medium">Fetching zone data...</p>
                        </td>
                      </tr>
                    ) : filteredZones.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 md:px-8 py-10 md:py-20 text-center text-slate-400 italic">
                          No zones found for selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredZones.map((zone, index) => (
                        <tr key={zone.id || zone.zoneId} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 md:px-8 py-4 md:py-6 text-sm font-medium text-slate-500">{index + 1}</td>
                          <td className="px-4 md:px-8 py-4 md:py-6">
                            <span className="text-base font-bold text-slate-900">{zone.zoneName}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-sm text-slate-600 font-medium">
                            {zone.brand?.brandName || "N/A"}
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6">
                            <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                              {zone.brand?.chain?.companyName || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                            <div className="flex justify-end items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => initiateEditZone(zone)}
                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </button>
                              <button 
                                onClick={() => handleDeleteZone(zone.id || zone.zoneId)}
                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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

export default ManageZones;