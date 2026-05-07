import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLayerGroup, 
  faLink, 
  faTag, 
  faMapLocationDot, 
  faFileInvoiceDollar, 
  faReceipt,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ activePage, isExpanded, setIsExpanded }) => {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: faChartLine },
    { name: "Manage Groups", path: "/groups", icon: faLayerGroup },
    { name: "Manage Chain", path: "/chains", icon: faLink },
    { name: "Manage Brands", path: "/brands", icon: faTag },
    { name: "Manage Zones", path: "/subzones", icon: faMapLocationDot },
    { name: "Manage Estimate", path: "/estimates", icon: faFileInvoiceDollar },
    { name: "Manage Invoices", path: "/manage-invoices", icon: faReceipt }
  ];

  return (
    <div className="relative h-full flex-shrink-0 w-20 z-[60]">
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`bg-white border-r border-slate-200 h-full flex flex-col transition-all duration-300 absolute left-0 top-0 overflow-hidden ${
          isExpanded ? "w-64 shadow-2xl" : "w-20"
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <Link to="/home" className={`flex items-center group transition-all duration-300 ${isExpanded ? 'space-x-3 px-6 w-full' : 'justify-center w-full'}`}>
            <div className="w-9 h-9 min-w-[36px] bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />
            </div>
            {isExpanded && (
              <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors whitespace-nowrap overflow-hidden">
                InvoiceFlow
              </span>
            )}
          </Link>
        </div>

        <div className={`pt-6 pb-6 overflow-y-auto overflow-x-hidden flex-1 ${isExpanded ? 'px-6' : 'px-4'}`}>
          {isExpanded ? (
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 transition-opacity duration-300">Main Menu</h2>
          ) : (
            <div className="h-4 mb-6"></div> /* Spacer when collapsed */
          )}
          
          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = activePage === item.name;
              return (
                <Link 
                  to={item.path} 
                  key={index} 
                  title={!isExpanded ? item.name : ""}
                  onClick={() => setIsExpanded(false)}
                >
                  <div className={`group flex items-center ${isExpanded ? 'px-4 py-3' : 'justify-center p-3'} text-sm font-bold rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}>
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className={`${isExpanded ? 'mr-4' : ''} w-4 text-center transition-transform duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`} 
                    />
                    {isExpanded && (
                      <span className="whitespace-nowrap overflow-hidden transition-all duration-300 opacity-100">
                        {item.name}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;