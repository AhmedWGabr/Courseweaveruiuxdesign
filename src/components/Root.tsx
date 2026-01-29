import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Library, Sparkles, Settings as SettingsIcon, WifiOff, Wifi, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
          className="fixed inset-0 bg-black/80 z-20 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-[#0F1115] border-r border-slate-800 flex flex-col transition-all duration-300 fixed h-full z-30 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 lg:px-6 border-b border-slate-800 justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger/Menu Button - All Screens */}
            <button
              onClick={() => {
                // Mobile: toggle slide-in menu
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  // Desktop/Tablet: toggle collapse
                  toggleSidebar();
                }
              }}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Menu'}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo - Show when expanded */}
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-semibold text-base lg:text-lg">CourseWeaver</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
              isActive('/') && location.pathname === '/'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title={sidebarCollapsed ? 'Dashboard' : ''}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link
            to="/library"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
              isActive('/library')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title={sidebarCollapsed ? 'Library' : ''}
          >
            <Library className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Library</span>}
          </Link>
          <Link
            to="/studio"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
              isActive('/studio')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title={sidebarCollapsed ? 'Studio' : ''}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Studio</span>}
          </Link>
          <Link
            to="/settings"
            onClick={closeMobileMenu}
            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
              isActive('/settings')
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title={sidebarCollapsed ? 'Settings' : ''}
          >
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
        </nav>

        {/* Offline Mode Toggle */}
        <div className="p-3 lg:p-4 border-t border-slate-800">
          <button
            onClick={toggleOfflineMode}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
              offlineMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title={sidebarCollapsed ? (offlineMode ? 'Offline Mode' : 'Online Mode') : ''}
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
            <p className="text-xs text-emerald-400 mt-2 px-3 lg:px-4">
              All features available offline
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300`}>
        {/* Mobile Hamburger Button - Only visible on mobile when sidebar is hidden */}
        {!mobileMenuOpen && (
          <div className="fixed top-4 left-4 z-20 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-10 h-10 bg-[#0F1115] border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors shadow-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <Outlet />
      </main>
    </div>
  );
}