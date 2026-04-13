import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from "../utils/cn";
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
  ChevronDown
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

      {/* 🔥 MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-4 z-50 lg:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg font-bold">EduStream</h1>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <SidebarItem
                    key={item.to}
                    {...item}
                    active={location.pathname === item.to}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 🔥 DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white p-4 fixed h-full z-50">
        <div className="flex items-center gap-2 px-4 py-6 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">E</div>
          <h1 className="text-xl font-bold">EduStream</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
              active={location.pathname === item.to}
            />
          ))}
        </nav>
      </aside>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-40 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Mobile left */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu />
            </button>
            <h1 className="font-bold">EduStream</h1>
          </div>

          {/* Desktop title */}
          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">
              {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-lg">
                <UserIcon size={18} />
              </div>
              <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow p-2 z-50"
                >
                  <p className="text-sm font-bold px-2">{user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-2 text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;