import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLayerGroup, 
  faLink, 
  faBuilding, 
  faMapMarkerAlt, 
  faClipboardList, 
  faFileInvoice,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

const DashboardPortal = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: "groups",
      title: "Group Management",
      description: "Organize and categorize your business units and primary groups.",
      icon: faLayerGroup,
      path: "/groups",
      color: "from-blue-600 to-indigo-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      id: "chains",
      title: "Chain Management",
      description: "Link your companies and business chains for unified reporting.",
      icon: faLink,
      path: "/chains",
      color: "from-purple-600 to-pink-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      id: "brands",
      title: "Brand Management",
      description: "Manage your diverse product brands and their associations.",
      icon: faBuilding,
      path: "/brands",
      color: "from-emerald-600 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      id: "zones",
      title: "Zone Management",
      description: "Define geographic regions and operational zones for your brands.",
      icon: faMapMarkerAlt,
      path: "/subzones",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      id: "estimates",
      title: "Estimate Management",
      description: "Create and track detailed project estimates and service quotes.",
      icon: faClipboardList,
      path: "/estimates",
      color: "from-rose-500 to-red-600",
      bgLight: "bg-rose-50",
      textColor: "text-rose-600"
    },
    {
      id: "invoices",
      title: "Invoice Registry",
      description: "Review generated invoices, track payments, and download PDFs.",
      icon: faFileInvoice,
      path: "/manage-invoices",
      color: "from-indigo-600 to-cyan-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600"
    }
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
<main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Main Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Select a module below to manage your business operations.</p>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => (
              <div 
                key={module.id}
                onClick={() => navigate(module.path)}
                className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer overflow-hidden border-b-4 hover:border-b-primary-500 active:scale-[0.98]"
              >
                {/* Background Decor */}
                <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${module.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${module.bgLight} ${module.textColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                    <FontAwesomeIcon icon={module.icon} className="text-2xl" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{module.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 text-sm font-medium">{module.description}</p>
                  
                  <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary-600 transition-all">
                    <span>Access Module</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Support / Info Footer */}
          <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need assistance?</h3>
                <p className="text-slate-400">Our support team is available 24/7 to help you with your invoicing workflow.</p>
              </div>
              <button className="mt-6 md:mt-0 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
                Contact Support
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPortal;
