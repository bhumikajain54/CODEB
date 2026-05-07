import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import ManageChain from "./components/ManageChain";
import AdminDashboard from "./components/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ManageBrands from "./components/ManageBrands";
import ManageZones from "./components/ManageZones";
import ManageEstimate from "./components/ManageEstimate";
import CreateInvoice from "./components/CreateInvoice";
import InvoiceManagement from "./components/InvoiceManagement";
import GroupManagement from "./components/GroupManagement";
import DashboardPortal from "./components/DashboardPortal";
import DashboardLayout from "./components/DashboardLayout";

// Layout for public pages (includes the default Navbar)
const PublicLayout = () => (
  <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">
    <Navbar />
    <div className="flex-1 w-full">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with standard Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes with Dashboard Layout */}
          <Route element={<PrivateRoute allowedRoles={["USER"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPortal />} />
              <Route path="/groups" element={<GroupManagement />} />
              <Route path="/chains" element={<ManageChain />} />
              <Route path="/brands" element={<ManageBrands />} />
              <Route path="/subzones" element={<ManageZones />} />
              <Route path="/estimates" element={<ManageEstimate />} />
              <Route path="/create-invoice" element={<CreateInvoice />} />
              <Route path="/manage-invoices" element={<InvoiceManagement />} />
            </Route>
          </Route>

          {/* Admin Routes with Dashboard Layout */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;