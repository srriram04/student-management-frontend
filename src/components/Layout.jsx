import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from "../utils/cn"
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  CalendarCheck, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Settings,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      active 
        ? "bg-indigo-600 text-white shadow-md" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/departments', icon: BookOpen, label: 'Departments' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/subjects', icon: GraduationCap, label: 'Subjects' },
    { to: '/admin/marks', icon: CalendarCheck, label: 'Marks' },
    { to: '/admin/attendance', icon: CalendarCheck, label: 'Attendance' },
  ];

  const studentNavItems = [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/subjects', icon: BookOpen, label: 'Subjects' },
    { to: '/student/marks', icon: GraduationCap, label: 'Marks' },
    { to: '/student/attendance', icon: CalendarCheck, label: 'Attendance' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white p-4 fixed h-full z-50">
        <div className="flex items-center gap-2 px-4 py-6 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">E</div>
          <h1 className="text-xl font-bold tracking-tight">EduStream</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header - Desktop & Mobile */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">E</div>
            <h1 className="text-lg font-bold">EduStream</h1>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 lg:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                  <UserIcon size={20} />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{user?.role}</p>
                </div>
                <ChevronDown size={16} className={cn("text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || `${user?.roll_no}@edustream.com`}</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-red-600 hover:bg-red-50 transition-colors text-sm font-bold"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
