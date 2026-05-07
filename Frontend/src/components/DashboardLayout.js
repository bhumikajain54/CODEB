import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine active page based on path
  let activePage = "Dashboard";
  if (path.includes("/groups")) activePage = "Manage Groups";
  if (path.includes("/chains")) activePage = "Manage Chain";
  if (path.includes("/brands")) activePage = "Manage Brands";
  if (path.includes("/subzones")) activePage = "Manage Zones";
  if (path.includes("/estimates")) activePage = "Manage Estimate";
  if (path.includes("/manage-invoices") || path.includes("/create-invoice")) activePage = "Manage Invoices";
  if (path.includes("/admin")) activePage = "Admin";

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased">
      {/* Sidebar gets full height */}
      <Sidebar 
        activePage={activePage} 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Navbar sits inside the main area, to the right of the sidebar */}
        <Navbar isDashboard={true} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
