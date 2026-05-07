import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../utils/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileInvoice, 
  faPlus, 
  faPenToSquare, 
  faTrashCan, 
  faXmark,
  faCircleExclamation,
  faCircleCheck,
  faSpinner,
  faSearch,
  faDownload,
  faSyncAlt,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [editInvoiceId, setEditInvoiceId] = useState(null);
  const [editInvoice, setEditInvoice] = useState({ emailId: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("invoiceNo");

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/invoices");
      setInvoices(Array.isArray(response.data) ? response.data : (response.data?.content || []));
      setError(null);
    } catch (err) {
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = async () => {
    try {
      setLoading(true);
      await api.put(`/invoices/${editInvoiceId}`, { emailId: editInvoice.emailId });
      setSuccess("Invoice updated!");
      setShowEdit(false);
      fetchInvoices();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Delete invoice?")) return;
    try {
      setLoading(true);
      await api.delete(`/invoices/${id}`);
      setSuccess("Invoice deleted.");
      fetchInvoices();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      setSuccess("Download started!");
    } catch (err) {
      setError("Download failed.");
    } finally {
      setLoading(false);
    }
  };

  const initiateEdit = (invoice) => {
    setEditInvoiceId(invoice.id);
    setEditInvoice(invoice);
    setShowEdit(true);
    setError(null);
  };

  const getFilteredInvoices = () => {
    if (!searchTerm.trim()) return invoices;
    return invoices.filter(inv => {
      const val = String(searchField === 'companyName' ? (inv.chain?.companyName || '') : inv[searchField] || '').toLowerCase();
      return val.includes(searchTerm.toLowerCase());
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-[1500px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Invoice Registry</h1>
              <p className="text-slate-500 mt-1 text-sm">Review and manage generated invoices and payment statuses.</p>
            </div>
            <button onClick={fetchInvoices} className="flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
              <FontAwesomeIcon icon={faSyncAlt} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats & Search */}
          {!showEdit && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                  <FontAwesomeIcon icon={faFileInvoice} className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Invoices</p>
                  <h3 className="text-2xl font-black text-slate-900">{invoices.length}</h3>
                </div>
              </div>

              <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="flex-1 relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search records..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary-500/10 font-medium transition-all"
                  />
                </div>
                <select 
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 outline-none cursor-pointer"
                >
                  <option value="invoiceNo">Invoice #</option>
                  <option value="companyName">Company</option>
                  <option value="serviceDetails">Service</option>
                </select>
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
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-700 animate-in slide-in-from-top-2">
              <FontAwesomeIcon icon={faCircleCheck} />
              <span className="text-sm font-semibold">{success}</span>
            </div>
          )}

          {showEdit ? (
            /* Edit Section */
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 max-w-4xl mx-auto">
              <div className="p-6 sm:p-12">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                  <h3 className="text-2xl font-bold text-slate-900">Update Invoice Info</h3>
                  <button onClick={() => setShowEdit(false)} className="text-slate-400 hover:text-slate-600"><FontAwesomeIcon icon={faXmark} className="text-xl" /></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Invoice No</p>
                      <p className="font-bold text-slate-900">{editInvoice.invoiceNo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Company</p>
                      <p className="font-bold text-slate-900">{editInvoice.chain?.companyName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Amount</p>
                      <p className="font-bold text-primary-600">{formatCurrency(editInvoice.amountPayable)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Date</p>
                      <p className="font-bold text-slate-900">{new Date(editInvoice.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Recipient Email</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        value={editInvoice.emailId} 
                        onChange={(e) => setEditInvoice({...editInvoice, emailId: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/10 font-bold"
                        placeholder="client@example.com"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex items-center space-x-4 pt-6">
                    <button onClick={handleEditInvoice} disabled={loading} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary-200">
                      {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Update Details"}
                    </button>
                    <button onClick={() => setShowEdit(false)} className="px-10 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Main Table */
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-5">Invoice Details</th>
                      <th className="px-6 py-5">Client Entity</th>
                      <th className="px-6 py-5">Service Provided</th>
                      <th className="px-6 py-5">Value (INR)</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading && invoices.length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-20 text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary-500 text-3xl" /></td></tr>
                    ) : getFilteredInvoices().length === 0 ? (
                      <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">No matching invoices found.</td></tr>
                    ) : (
                      getFilteredInvoices().map((inv, idx) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100"><FontAwesomeIcon icon={faFileInvoice} /></div>
                              <div>
                                <div className="text-sm font-black text-slate-900">{inv.invoiceNo}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Est ID: {inv.estimate?.estimateId || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm font-bold text-slate-800">{inv.chain?.companyName || 'N/A'}</div>
                            <div className="text-xs text-slate-500">ID: {inv.chain?.chainId}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm text-slate-600 max-w-[250px] truncate" title={inv.serviceDetails}>{inv.serviceDetails}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-sm font-black text-slate-900">{formatCurrency(inv.amountPayable)}</div>
                            <div className="text-[10px] text-slate-400 font-bold">{inv.qty} units</div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end items-center space-x-2">
                              <button onClick={() => handleDownloadInvoice(inv.id)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Download PDF"><FontAwesomeIcon icon={faDownload} /></button>
                              <button onClick={() => initiateEdit(inv)} className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="Edit"><FontAwesomeIcon icon={faPenToSquare} /></button>
                              <button onClick={() => handleDeleteInvoice(inv.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete"><FontAwesomeIcon icon={faTrashCan} /></button>
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

export default InvoiceManagement;