import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Library, Sparkles, Settings as SettingsIcon, WifiOff, Wifi, Menu, X } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { useState } from 'react';

export function Root() {
  const location = useLocation();
  const { offlineMode, toggleOfflineMode, sidebarCollapsed, toggleSidebar } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`min-h-screen ${offlineMode ? 'bg-black' : 'bg-[#050505]'} text-slate-200 flex`}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#0F1115] border-r border-slate-800 flex flex-col transition-all duration-300 fixed h-full z-30 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-semibold text-lg">CourseWeaver</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          {/* Mobile Close Button */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link
            to="/library"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/library')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Library className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Library</span>}
          </Link>
          <Link
            to="/studio"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/studio')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Studio</span>}
          </Link>
          <Link
            to="/settings"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
        </nav>

        {/* Offline Mode Toggle */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={toggleOfflineMode}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              offlineMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {offlineMode ? (
              <WifiOff className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Wifi className="w-5 h-5 flex-shrink-0" />
            )}
            {!sidebarCollapsed && (
              <span>{offlineMode ? 'Offline Mode' : 'Online Mode'}</span>
            )}
          </button>
          {!sidebarCollapsed && offlineMode && (
            <p className="text-xs text-emerald-400 mt-2 px-4">
              All features available offline
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Hamburger Button */}
        <div className="fixed top-4 left-4 z-20">
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              // On desktop, toggle sidebar collapse
              if (window.innerWidth >= 1024) {
                toggleSidebar();
              }
            }}
            className="w-10 h-10 bg-[#0F1115] border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}