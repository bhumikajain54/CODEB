import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCopyright, 
  faPlus, 
  faPenToSquare, 
  faTrashCan, 
  faXmark,
  faCircleExclamation,
  faCircleCheck,
  faSpinner,
  faFilter,
  faBuilding,
  faFolderTree
} from "@fortawesome/free-solid-svg-icons";

const ManageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [selectedChainId, setSelectedChainId] = useState("");
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [editChainId, setEditChainId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterCompany, setFilterCompany] = useState("");
  const [filterGroup, setFilterGroup] = useState("");



  useEffect(() => {
    fetchBrands();
    fetchChains();
    fetchGroups();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/brands`);
      setBrands(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChains = async () => {
    try {
      const response = await axios.get(`${API_URL}/chains`);
      setChains(response.data);
    } catch (err) {
      console.error("Error fetching chains:", err);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups`);
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim() || !selectedChainId) {
      setError("Brand name and company selection are required.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/brands`, {
        brandName: newBrandName,
        chainId: selectedChainId
      });
      setNewBrandName("");
      setSelectedChainId("");
      setSuccess("Brand added successfully!");
      setShowForm(false);
      fetchBrands();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Brand already exists for this company!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBrand = async () => {
    if (!editBrandName.trim() || !editChainId) {
      setError("Brand name and company selection are required.");
      return;
    }
    try {
      setLoading(true);
      await axios.put(`${API_URL}/brands/${editBrandId}?chainId=${editChainId}`, {
        brandName: editBrandName
      });
      setSuccess("Brand updated successfully!");
      setShowForm(false);
      setIsEditing(false);
      fetchBrands();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error updating brand");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      setLoading(true);
      const canDeleteResponse = await axios.get(`${API_URL}/brands/can-delete/${brandId}`);
      if (!canDeleteResponse.data) {
        setError("Cannot delete brand as it is associated with zones");
        return;
      }
      await axios.delete(`${API_URL}/brands/${brandId}`);
      setSuccess("Brand deleted successfully!");
      fetchBrands();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting brand");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const initiateEditBrand = (brand) => {
    setEditBrandId(brand.brandId);
    setEditBrandName(brand.brandName);
    setEditChainId(brand.chain?.chainId || "");
    setIsEditing(true);
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setError(null);
    setNewBrandName("");
    setSelectedChainId("");
  };

  const filteredBrands = brands.filter(brand => {
    const matchesCompany = !filterCompany || (brand.chain && brand.chain.chainId.toString() === filterCompany);
    const matchesGroup = !filterGroup || (brand.chain?.group && brand.chain.group.groupId.toString() === filterGroup);
    return matchesCompany && matchesGroup;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Brand Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Manage product brands and associate them with companies.</p>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Brand</span>
              </button>
            )}
          </div>

          {/* Stats Cards Bar */}
          {!showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                  <FontAwesomeIcon icon={faCopyright} className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Brands</p>
                  <h3 className="text-2xl font-black text-slate-900">{brands.length}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                  <FontAwesomeIcon icon={faFolderTree} className="text-xl" />
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
            </div>
          )}

          {/* Filters Bar */}
          {!showForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100">
                  <FontAwesomeIcon icon={faFilter} className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Company</p>
                  <select 
                    value={filterCompany}
                    onChange={(e) => setFilterCompany(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Companies</option>
                    {chains.map(chain => (
                      <option key={chain.chainId} value={chain.chainId}>{chain.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center border border-slate-100">
                  <FontAwesomeIcon icon={faFolderTree} className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Group</p>
                  <select 
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Groups</option>
                    {groups.map(group => (
                      <option key={group.groupId} value={group.groupId}>{group.groupName}</option>
                    ))}
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
                    {isEditing ? "Update Brand" : "Add New Brand"}
                  </h3>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 p-2">
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nike"
                      value={isEditing ? editBrandName : newBrandName}
                      onChange={(e) => isEditing ? setEditBrandName(e.target.value) : setNewBrandName(e.target.value)}
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 px-1">
                      Select Company
                    </label>
                    <select
                      value={isEditing ? editChainId : selectedChainId}
                      onChange={(e) => isEditing ? setEditChainId(e.target.value) : setSelectedChainId(e.target.value)}
                      className="block w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Choose a company</option>
                      {chains.map(chain => (
                        <option key={chain.chainId} value={chain.chainId}>{chain.companyName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-4 pt-6">
                    <button 
                      onClick={isEditing ? handleEditBrand : handleAddBrand}
                      disabled={loading}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-200 active:scale-[0.98] disabled:opacity-70"
                    >
                      {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : (isEditing ? "Update Details" : "Add Brand")}
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
                      <th className="px-4 md:px-8 py-4 md:py-5">Brand Name</th>
                      <th className="px-4 md:px-8 py-4 md:py-5">Company</th>
                      <th className="px-4 md:px-8 py-4 md:py-5">Group</th>
                      <th className="px-4 md:px-8 py-4 md:py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && brands.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 md:px-8 py-10 md:py-20 text-center">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary-500 text-3xl mb-4" />
                          <p className="text-slate-500 font-medium">Fetching secure records...</p>
                        </td>
                      </tr>
                    ) : filteredBrands.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 md:px-8 py-10 md:py-20 text-center text-slate-400 italic">
                          No brands match your current view.
                        </td>
                      </tr>
                    ) : (
                      filteredBrands.map((brand, index) => (
                        <tr key={brand.brandId} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 md:px-8 py-4 md:py-6 text-sm font-medium text-slate-500">{index + 1}</td>
                          <td className="px-4 md:px-8 py-4 md:py-6">
                            <span className="text-base font-bold text-slate-900">{brand.brandName}</span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-sm text-slate-600 font-medium">
                            {brand.chain?.companyName || "N/A"}
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6">
                            <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200">
                              {brand.chain?.group?.groupName || "N/A"}
                            </span>
                          </td>
                          <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                            <div className="flex justify-end items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => initiateEditBrand(brand)}
                                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                              </button>
                              <button 
                                onClick={() => handleDeleteBrand(brand.brandId)}
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

export default ManageBrands;
