import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalculator, 
  faPlus, 
  faPenToSquare, 
  faTrashCan, 
  faXmark,
  faCircleExclamation,
  faCircleCheck,
  faSpinner,
  faFilter,
  faFileInvoice,
  faCalendarDays,
  faDollarSign,
  faHashtag,
  faTruck
} from "@fortawesome/free-solid-svg-icons";

const ManageEstimates = () => {
  const [estimates, setEstimates] = useState([]);
  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const [newEstimate, setNewEstimate] = useState({
    groupName: "",
    brandName: "",
    zoneName: "",
    service: "",
    quantity: "",
    costPerUnit: "",
    totalCost: "",
    deliveryDate: "",
    deliveryDetails: "",
  });

  const [editEstimateId, setEditEstimateId] = useState(null);
  const [editEstimate, setEditEstimate] = useState({
    groupName: "",
    brandName: "",
    zoneName: "",
    service: "",
    quantity: "",
    costPerUnit: "",
    totalCost: "",
    deliveryDate: "",
    deliveryDetails: "",
  });

  const [selectedChainId, setSelectedChainId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [filterGroup, setFilterGroup] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterZone, setFilterZone] = useState("");

  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchEstimates();
    fetchChains();
    fetchGroups();
    fetchBrands();
    fetchZones();
  }, []);

  useEffect(() => {
    if (selectedChainId) {
      const chainBrands = brands.filter(b => b.chain?.chainId.toString() === selectedChainId);
      setFilteredBrands(chainBrands);
      setNewEstimate(prev => ({ ...prev, brandName: "", zoneName: "" }));
      setFilteredZones([]);
    } else {
      setFilteredBrands([]);
    }
  }, [selectedChainId, brands]);

  useEffect(() => {
    if (newEstimate.brandName) {
      const brandZones = zones.filter(z => z.brand?.brandName === newEstimate.brandName);
      setFilteredZones(brandZones);
      setNewEstimate(prev => ({ ...prev, zoneName: "" }));
    } else {
      setFilteredZones([]);
    }
  }, [newEstimate.brandName, zones]);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/estimates`);
      setEstimates(response.data);
    } catch (err) {
      setError("Failed to load estimates.");
    } finally {
      setLoading(false);
    }
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

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/brands`);
      setBrands(response.data);
    } catch (err) {}
  };

  const fetchZones = async () => {
    try {
      const response = await axios.get(`${API_URL}/zones`);
      setZones(response.data);
    } catch (err) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEstimate(prev => ({ ...prev, [name]: value }));
    if (name === "chainId") setSelectedChainId(value);
  };

  const handleGroupChange = (e) => {
    const gId = e.target.value;
    const g = groups.find(group => group.groupId.toString() === gId);
    setSelectedGroupId(gId);
    setNewEstimate(prev => ({ ...prev, groupName: g ? g.groupName : "" }));
  };

  useEffect(() => {
    if (newEstimate.quantity && newEstimate.costPerUnit) {
      const total = parseFloat(newEstimate.quantity) * parseFloat(newEstimate.costPerUnit);
      setNewEstimate(prev => ({ ...prev, totalCost: total.toFixed(2) }));
    }
  }, [newEstimate.quantity, newEstimate.costPerUnit]);

  const handleAddEstimate = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/estimates`, newEstimate, { params: { chainId: selectedChainId } });
      setSuccess("Estimate created successfully!");
      setShowForm(false);
      fetchEstimates();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to add estimate.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEstimate = async (id) => {
    if (!window.confirm("Delete this estimate?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/estimates/${id}`);
      setSuccess("Estimate deleted.");
      fetchEstimates();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = (estimate) => {
    navigate('/create-invoice', { 
      state: { 
        ...estimate,
        estimateId: estimate.estimateId,
        chainId: estimate.chain?.chainId,
        companyName: estimate.chain?.companyName || estimate.chain?.chainName,
        amountPayable: estimate.totalCost,
      } 
    });
  };

  const getFilteredEstimates = () => {
    return estimates.filter(e => {
      const mGroup = !filterGroup || e.groupName === filterGroup;
      const mCompany = !filterCompany || (e.chain && e.chain.chainId.toString() === filterCompany);
      const mBrand = !filterBrand || e.brandName === filterBrand;
      const mZone = !filterZone || e.zoneName === filterZone;
      return mGroup && mCompany && mBrand && mZone;
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Estimate Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Create and manage service estimates and pricing.</p>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-200 active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Create Estimate</span>
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
            /* Large Form Card */
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
              <div className="p-6 sm:p-12">
                <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
                  <h3 className="text-2xl font-bold text-slate-900">New Estimate Details</h3>
                  <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 p-2">
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Row 1 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Group</label>
                    <select value={selectedGroupId} onChange={handleGroupChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-bold">
                      <option value="">Select Group</option>
                      {groups.map(g => <option key={g.groupId} value={g.groupId}>{g.groupName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Company</label>
                    <select value={selectedChainId} onChange={(e) => setSelectedChainId(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-bold">
                      <option value="">Select Company</option>
                      {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.companyName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Brand</label>
                    <select name="brandName" value={newEstimate.brandName} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-bold">
                      <option value="">Select Brand</option>
                      {filteredBrands.map(b => <option key={b.brandId} value={b.brandName}>{b.brandName}</option>)}
                    </select>
                  </div>

                  {/* Row 2 */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Provided</label>
                    <input type="text" name="service" value={newEstimate.service} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-bold" placeholder="Describe the service..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Zone</label>
                    <select name="zoneName" value={newEstimate.zoneName} onChange={handleInputChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all font-bold">
                      <option value="">Select Zone</option>
                      {filteredZones.map(z => <option key={z.id} value={z.zoneName}>{z.zoneName}</option>)}
                    </select>
                  </div>

                  {/* Row 3 - Pricing */}
                  <div className="bg-slate-50 p-6 rounded-3xl md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Quantity</label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faHashtag} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" name="quantity" value={newEstimate.quantity} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 font-bold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Cost per Unit</label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faDollarSign} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" name="costPerUnit" value={newEstimate.costPerUnit} onChange={handleInputChange} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-500 font-bold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Total Cost (Auto)</label>
                      <div className="w-full px-5 py-3 bg-primary-50 border border-primary-100 rounded-xl text-primary-700 font-black text-lg">
                        ₹ {newEstimate.totalCost || "0.00"}
                      </div>
                    </div>
                  </div>

                  {/* Row 4 - Logistics */}
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Delivery Date</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faCalendarDays} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" name="deliveryDate" value={newEstimate.deliveryDate} onChange={handleInputChange} className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 font-bold" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Delivery Details</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faTruck} className="absolute left-4 top-5 text-slate-400" />
                      <textarea name="deliveryDetails" value={newEstimate.deliveryDetails} onChange={handleInputChange} rows="1" className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 font-bold" placeholder="E.g. Ground Floor, Sector 5..." />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-10 mt-10 border-t border-slate-50">
                  <button onClick={handleAddEstimate} disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-[0.98]">
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Finalize & Create Estimate"}
                  </button>
                  <button onClick={handleCancel} className="px-10 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filters Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="flex items-center px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <FontAwesomeIcon icon={faFilter} className="text-slate-400 mr-3 text-xs" />
                  <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full bg-transparent py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer">
                    <option value="">All Groups</option>
                    {groups.map(g => <option key={g.groupId} value={g.groupName}>{g.groupName}</option>)}
                  </select>
                </div>
                <div className="flex items-center px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-full bg-transparent py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer">
                    <option value="">All Companies</option>
                    {chains.map(c => <option key={c.chainId} value={c.chainId}>{c.companyName}</option>)}
                  </select>
                </div>
                <div className="flex items-center px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="w-full bg-transparent py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer">
                    <option value="">All Brands</option>
                    {brands.map(b => <option key={b.brandId} value={b.brandName}>{b.brandName}</option>)}
                  </select>
                </div>
                <div className="flex items-center px-4 bg-slate-50 rounded-xl border border-slate-100">
                  <select value={filterZone} onChange={(e) => setFilterZone(e.target.value)} className="w-full bg-transparent py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer">
                    <option value="">All Zones</option>
                    {zones.map(z => <option key={z.zoneId} value={z.zoneName}>{z.zoneName}</option>)}
                  </select>
                </div>
                <button onClick={() => {setFilterGroup(""); setFilterCompany(""); setFilterBrand(""); setFilterZone("");}} className="text-primary-600 font-bold text-sm hover:underline">Clear Filters</button>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-5">Estimate</th>
                        <th className="px-6 py-5">Company/Brand</th>
                        <th className="px-6 py-5">Service</th>
                        <th className="px-6 py-5 text-center">Cost Analysis</th>
                        <th className="px-6 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading && estimates.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-20 text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary-500 text-3xl" /></td></tr>
                      ) : getFilteredEstimates().length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic font-medium">No estimates found matching your criteria.</td></tr>
                      ) : (
                        getFilteredEstimates().map((est, idx) => (
                          <tr key={est.estimateId} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-black text-xs border border-primary-100">#{idx+1}</div>
                                <div>
                                  <div className="text-sm font-bold text-slate-900">{est.groupName}</div>
                                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(est.deliveryDate).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-sm font-bold text-slate-800">{est.chain?.companyName || est.chain?.chainName}</div>
                              <div className="text-xs text-slate-500">{est.brandName} • {est.zoneName}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-sm text-slate-600 max-w-[200px] truncate" title={est.service}>{est.service}</div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="inline-block text-right">
                                <div className="text-xs text-slate-400 font-medium">{est.quantity} x ₹{est.costPerUnit}</div>
                                <div className="text-sm font-black text-slate-900 tracking-tight">₹{est.totalCost}</div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end items-center space-x-2">
                                <button onClick={() => handleGenerateInvoice(est)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-emerald-100 transition-all active:scale-95">Invoice</button>
                                <button onClick={() => handleDeleteEstimate(est.estimateId)} className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><FontAwesomeIcon icon={faTrashCan} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageEstimates;