import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowRight, 
  faCheckCircle,
  faFileInvoice,
  faChartPie,
  faLock
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <div className="bg-white min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 mr-2"></span>
              New: Advanced Invoice Analytics
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Simplify Your <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Invoicing</span> <br />
              With Modern Flow
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              The all-in-one platform to manage groups, estimates, and invoices with secure role-based access control.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 hover:-translate-y-1 active:scale-95"
              >
                Get Started Free
                <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-1 active:scale-95 shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100/50 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Powerful features designed to help your team work smarter and faster.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faFileInvoice} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Invoice Management</h3>
              <p className="text-slate-500 leading-relaxed">Create, track, and manage professional invoices with custom estimates and branding.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faLock} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Auth</h3>
              <p className="text-slate-500 leading-relaxed">Enterprise-grade security with JWT authentication and role-based permissions.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faChartPie} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-slate-500 leading-relaxed">Gain insights into your business with comprehensive dashboards and reporting tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-8 md:p-20 relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built for every role</h2>
                <div className="space-y-4">
                  {[
                    "Admins get full control over users and settings",
                    "Users can manage their own data and invoices",
                    "Seamless role transitions and permissions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start text-slate-300">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1 mr-3" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/3 flex flex-col space-y-4">
                <Link 
                  to="/register" 
                  className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-bold text-center hover:bg-slate-100 transition-colors"
                >
                  Join as Admin
                </Link>
                <Link 
                  to="/register" 
                  className="bg-slate-800 text-white px-6 py-4 rounded-2xl font-bold text-center hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  Join as User
                </Link>
              </div>
            </div>
            {/* Decorative circles for the dark box */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>
          </div>
        </div>
      </section>
      
      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
              I
            </div>
            <span className="font-bold text-slate-900">InvoiceFlow</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 InvoiceFlow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;