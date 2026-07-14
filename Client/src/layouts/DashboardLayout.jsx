import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, CarFront, Ticket, Users, Settings, LogOut, UserCog, BarChart3, CreditCard, UserCircle, Menu, X, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { cn } from '../utils/cn';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/vehicles', icon: CarFront, label: 'Vehicles' },
    { to: '/admin/slots', icon: Ticket, label: 'Parking Slots' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/staff', icon: UserCog, label: 'Staff' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/profile', icon: UserCircle, label: 'Profile' },
  ];

  const valetLinks = [
    { to: '/valet', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/valet/check-in', icon: CarFront, label: 'Vehicle Check-in' },
    { to: '/valet/retrieve', icon: Ticket, label: 'Vehicle Check-out' },
    { to: '/valet/customers', icon: Users, label: 'Manage Customers' },
    { to: '/valet/slots', icon: Ticket, label: 'Manage Slots' },
    { to: '/valet/reports', icon: BarChart3, label: 'Reports' },
    { to: '/valet/settings', icon: Settings, label: 'Settings' },
    { to: '/valet/profile', icon: UserCircle, label: 'Profile' },
  ];

  const customerLinks = [
    { to: '/customer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/customer/reports', icon: BarChart3, label: 'Reports' },
    { to: '/customer/settings', icon: Settings, label: 'Settings' },
    { to: '/customer/profile', icon: UserCircle, label: 'Profile' },
  ];

  const links = user?.role === 'Admin' ? adminLinks : user?.role === 'Valet' ? valetLinks : customerLinks;

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsDesktopCollapsed(!isDesktopCollapsed);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-themeBg">
      
      {/* Top Navigation Bar (Full Width) */}
      <header className="h-16 w-full glass border-b border-themeBorder flex items-center justify-between px-4 md:px-6 z-[60] shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-themeBg-paper text-themeText-secondary hover:text-themeText transition-colors focus:outline-none flex items-center justify-center w-10 h-10"
            aria-label="Open Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <CarFront className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-themeText tracking-tight whitespace-nowrap">
              ZEN <span className="text-primary">PARK</span>
            </span>
          </div>
        </div>
        
        {/* Top Navbar Right Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-themeBg-paper border border-themeBorder text-themeText-secondary hover:text-themeText transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] md:hidden transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed md:relative top-0 left-0 bottom-0 z-[70] h-full flex flex-col transition-all duration-300 ease-in-out shrink-0 border-r border-themeBorder",
            "bg-themeBg md:glass md:bg-transparent", 
            isDesktopCollapsed ? "md:w-20" : "w-[80%] max-w-sm md:w-64",
            isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          {/* Mobile Sidebar Header */}
          <div className="flex items-center gap-3 p-4 md:hidden border-b border-themeBorder shrink-0 h-16">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <CarFront className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-themeText tracking-tight whitespace-nowrap">
              ZEN <span className="text-primary">PARK</span>
            </span>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="ml-auto p-1.5 rounded-lg hover:bg-themeBg-paper text-themeText-secondary hover:text-themeText transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden md:flex absolute -right-3 top-6 bg-primary text-gray-900 rounded-full p-1 shadow-lg border border-themeBorder z-[100] hover:bg-primary/90 transition-colors"
          >
            {isDesktopCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide pt-4 md:pt-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/valet'}
                onClick={() => setIsMobileOpen(false)}
                title={isDesktopCollapsed ? link.label : ''}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium whitespace-nowrap",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-themeText-secondary hover:text-themeText hover:bg-themeBg-paper",
                  isDesktopCollapsed && "md:justify-center md:px-0"
                )}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                <span className={cn("transition-opacity", isDesktopCollapsed ? "md:hidden md:opacity-0" : "opacity-100")}>
                  {link.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-themeBorder">
            <div className={cn(
              "flex items-center gap-3 mb-2 rounded-xl bg-themeBg-paper border border-themeBorder transition-all",
              isDesktopCollapsed ? "md:justify-center md:bg-transparent md:border-transparent md:p-0" : "px-4 py-3"
            )}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className={cn("flex-1 min-w-0 transition-opacity", isDesktopCollapsed ? "md:hidden md:opacity-0" : "opacity-100")}>
                <p className="text-sm font-medium text-themeText truncate">{user?.name}</p>
                <p className="text-xs text-themeText-secondary truncate">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title={isDesktopCollapsed ? "Logout" : ""}
              className={cn(
                "flex items-center gap-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium whitespace-nowrap",
                isDesktopCollapsed ? "md:justify-center md:p-3" : "w-full px-4 py-2.5"
              )}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={cn("transition-opacity", isDesktopCollapsed ? "md:hidden md:opacity-0" : "opacity-100")}>
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-themeBg">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.02] pointer-events-none"></div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
