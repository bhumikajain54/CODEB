import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileInvoice, 
  faCircleExclamation, 
  faCircleCheck, 
  faSpinner,
  faAngleLeft,
  faEnvelope,
  faIndianRupeeSign,
  faDownload,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

const CreateInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const estimateData = location.state || {};

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    estimateId: estimateData.estimateId || "",
    chainId: estimateData.chainId || "",
    service: estimateData.service || "",
    quantity: estimateData.quantity || "",
    costPerUnit: estimateData.costPerUnit || "",
    amountPayable: estimateData.amountPayable || "",
    amountPaid: estimateData.amountPayable || "",
    balance: "0",
    deliveryDate: estimateData.deliveryDate || "",
    deliveryDetails: estimateData.deliveryDetails || "",
    emailId: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [invoiceCreated, setInvoiceCreated] = useState(false);

  useEffect(() => {
    const generateInvoiceNumber = () => Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    setInvoice(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amountPaid") {
      const paid = parseFloat(value) || 0;
      const payable = parseFloat(invoice.amountPayable) || 0;
      setInvoice({ ...invoice, amountPaid: value, balance: Math.max(0, payable - paid).toFixed(2) });
    } else {
      setInvoice({ ...invoice, [name]: value });
    }
  };

  const handleCreateInvoice = async () => {
    if (!invoice.emailId) { setError("Email is required."); return; }
    try {
      setLoading(true);
      setError(null);
      const requestData = { estimateId: invoice.estimateId, emailId: invoice.emailId, amountPaid: parseFloat(invoice.amountPaid) || 0 };
      const response = await axios.post("http://localhost:8080/api/invoices/generate", requestData);
      const invoiceId = response.data?.id || response.data?.invoiceId;
      setInvoiceCreated(true);
      setSuccess("Invoice generated successfully!");
      
      if (invoiceId) {
        setTimeout(async () => {
          try {
            const pdfRes = await axios.get(`http://localhost:8080/api/invoices/${invoiceId}/pdf`, { responseType: "blob" });
            setPdfUrl(window.URL.createObjectURL(new Blob([pdfRes.data])));
          } catch (e) { setError("Invoice created, but PDF preview failed."); }
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", `Invoice-${invoice.invoiceNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!estimateData.estimateId) {
    return (
      <div className="flex bg-slate-50 min-h-screen items-center justify-center p-8">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl text-center max-w-lg border border-slate-100">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><FontAwesomeIcon icon={faCircleExclamation} className="text-3xl" /></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Estimate Found</h2>
          <p className="text-slate-500 mb-8">Please select an estimate from the management console to generate an invoice.</p>
          <button onClick={() => navigate('/estimates')} className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to Estimates</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all"><FontAwesomeIcon icon={faAngleLeft} /></button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Generate Invoice</h1>
              <p className="text-slate-500 text-sm">Finalizing financial record for Estimate #{invoice.estimateId}</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between text-red-700 animate-in slide-in-from-top-2">
              <div className="flex items-center space-x-3"><FontAwesomeIcon icon={faCircleExclamation} /><span>{error}</span></div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-700 animate-in slide-in-from-top-2">
              <FontAwesomeIcon icon={faCircleCheck} /><span>{success}</span>
            </div>
          )}

          {pdfUrl ? (
            /* Success Preview State */
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500 text-center p-8 md:p-12">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-inner">
                <FontAwesomeIcon icon={faCircleCheck} className="text-4xl" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Invoice Ready!</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">The invoice has been generated and sent to <strong>{invoice.emailId}</strong>. You can now download the PDF copy for your records.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                <button onClick={handleDownloadPdf} className="w-full sm:flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary-200 flex items-center justify-center space-x-3">
                  <FontAwesomeIcon icon={faDownload} /><span>Download PDF</span>
                </button>
                <button onClick={() => navigate('/manage-invoices')} className="w-full sm:flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center space-x-3">
                  <FontAwesomeIcon icon={faFileInvoice} /><span>Manage Invoices</span>
                </button>
              </div>
            </div>
          ) : (
            /* Form State */
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 sm:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Invoice Number</p>
                    <p className="text-lg font-bold text-slate-900">#INV-{invoice.invoiceNumber}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Estimate ID</p>
                    <p className="text-lg font-bold text-slate-900">{invoice.estimateId}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Chain ID</p>
                    <p className="text-lg font-bold text-slate-900">{invoice.chainId}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 pb-2">Service Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-2 px-1">Description</label>
                        <div className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-700 font-medium border border-slate-100">{invoice.service}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 px-1">Quantity</label>
                        <div className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-700 font-bold border border-slate-100">{invoice.quantity} units</div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 px-1">Rate</label>
                        <div className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-700 font-bold border border-slate-100">₹{invoice.costPerUnit} / unit</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 pb-2">Financials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 px-1">Total Payable</label>
                        <div className="text-2xl font-black text-slate-900">₹{invoice.amountPayable}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-primary-600 mb-2 px-1 underline underline-offset-4">Amount Being Paid</label>
                        <div className="relative">
                          <FontAwesomeIcon icon={faIndianRupeeSign} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                          <input 
                            type="number" 
                            name="amountPaid" 
                            value={invoice.amountPaid} 
                            onChange={handleInputChange} 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-primary-100 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10 font-black text-slate-900" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 px-1">Balance</label>
                        <div className={`text-2xl font-black ${parseFloat(invoice.balance) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>₹{invoice.balance}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-50 pb-2">Communication</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 px-1">Recipient Email Address</label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="email" 
                          name="emailId" 
                          value={invoice.emailId} 
                          onChange={handleInputChange} 
                          placeholder="client@company.com"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white font-bold transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-50">
                  <button 
                    onClick={handleCreateInvoice} 
                    disabled={loading || !invoice.emailId}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-primary-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" /> : <><FontAwesomeIcon icon={faFileInvoice} className="text-xl" /><span>Finalize & Generate Invoice</span></>}
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

export default CreateInvoice;