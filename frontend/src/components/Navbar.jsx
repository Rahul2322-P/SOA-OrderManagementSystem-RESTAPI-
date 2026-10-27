import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Activity,
  FileCode2,
  Menu,
  X,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import orderService from '../api/orderService';
import { baseURL } from '../api/axiosClient';

export default function Navbar({ onOpenCreateModal, totalOrdersCount, onRefreshData }) {
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking', // checking | online | offline
    message: '',
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const checkHealth = async () => {
    try {
      setBackendHealth({ status: 'checking', message: 'Checking API...' });
      const res = await orderService.checkHealth();
      setBackendHealth({ status: 'online', message: typeof res === 'string' ? res : 'Connected' });
    } catch {
      setBackendHealth({ status: 'offline', message: 'Offline (Port 8050)' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'All Orders', path: '/orders' },
    { name: 'API Reference', path: '/api-docs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition transform">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                    OrderHub
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                    SOA REST
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Spring Boot & React Order Management System
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Backend Health Badge */}
            <div
              onClick={checkHealth}
              title={`Click to recheck health: ${backendHealth.message} at ${baseURL}`}
              className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition bg-slate-50 hover:bg-slate-100 border-slate-200"
            >
              <span className="relative flex h-2 w-2">
                {backendHealth.status === 'online' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendHealth.status === 'online'
                      ? 'bg-emerald-500'
                      : backendHealth.status === 'checking'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </span>
              <span className="text-slate-600 font-mono">
                {backendHealth.status === 'online'
                  ? 'API :8050'
                  : backendHealth.status === 'checking'
                  ? 'Connecting...'
                  : 'Backend Offline'}
              </span>
            </div>

            {/* Total Orders Badge */}
            {typeof totalOrdersCount === 'number' && (
              <span className="hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {totalOrdersCount} Orders
              </span>
            )}

            {/* Refresh Data Button */}
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                title="Refresh Orders Data"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Swagger Shortcut */}
            <a
              href={`${baseURL}/swagger-ui.html`}
              target="_blank"
              rel="noreferrer"
              title="Open Swagger OpenAPI Documentation"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Swagger</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Create Order Button */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition shadow-sm shadow-indigo-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Order</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>API Server: {baseURL}</span>
            <span
              className={`font-semibold ${
                backendHealth.status === 'online' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {backendHealth.status.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
