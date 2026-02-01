
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, BookOpen, Bookmark, LayoutDashboard, ChevronRight, PanelLeftClose, PanelLeftOpen, Terminal, LogOut, User } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../components/AuthModal';

const MainLayout = () => {
    const { questions, activeTech } = useApp();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Extract unique categories and include 'All'
    const categories = ['All', ...new Set(questions.map(q => q.category))];

    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeMobileSidebar = () => setIsSidebarOpen(false);
    const toggleDesktopSidebar = () => setIsDesktopCollapsed(!isDesktopCollapsed);

    return (
        <div className="flex h-screen bg-[#f9fafb] dark:bg-[#090c10] text-gray-900 dark:text-gray-100 overflow-hidden font-sans transition-colors duration-300">

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full z-40 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        <Terminal size={18} fill="none" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">CodeMastery</span>
                </div>
                <button onClick={toggleMobileSidebar} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                        onClick={closeMobileSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <AnimatePresence>
                {isDesktopCollapsed && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={toggleDesktopSidebar}
                        className="hidden lg:flex fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        title="Expand Sidebar"
                    >
                        <PanelLeftOpen size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-40 bg-white dark:bg-[#0d1117] border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none overflow-hidden",
                    isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
                    isDesktopCollapsed ? "lg:w-0 lg:border-r-0 lg:p-0" : "lg:w-72"
                )}
            >
                {/* Brand Header */}
                <div className="p-6 hidden lg:flex items-center justify-between min-w-[18rem]">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')} title="Switch Technology">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
                            <Terminal size={20} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white block leading-none">CodeMastery</span>
                            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {activeTech}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={toggleDesktopSidebar}
                        className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Collapse Sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar space-y-8 min-w-[18rem]">
                    <div>
                        <p className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                            Menu
                        </p>
                        <nav className="space-y-1">
                            <NavLink
                                to="/"
                                onClick={closeMobileSidebar}
                                className={({ isActive }) => clsx(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                            >
                                <LayoutDashboard className="mr-3 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/bookmarks"
                                onClick={closeMobileSidebar}
                                className={({ isActive }) => clsx(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                            >
                                <Bookmark className="mr-3 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                Bookmarks
                            </NavLink>
                            <NavLink
                                to="/notes"
                                onClick={closeMobileSidebar}
                                className={({ isActive }) => clsx(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                            >
                                <BookOpen className="mr-3 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                                My Resources
                            </NavLink>
                        </nav>
                    </div>

                    <div>
                        <p className="px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                            Topics
                        </p>
                        <nav className="space-y-1">
                            {categories.map((cat) => (
                                <NavLink
                                    key={cat}
                                    to={`/questions/${encodeURIComponent(cat)}`}
                                    onClick={closeMobileSidebar}
                                    className={({ isActive }) => clsx(
                                        "flex items-center px-3 py-2 text-sm font-medium rounded-xl group transition-all duration-200",
                                        isActive
                                            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                                    )}
                                >
                                    <span className={clsx(
                                        "w-1.5 h-1.5 rounded-full mr-3 transition-colors",
                                        location.pathname.includes(encodeURIComponent(cat)) || (cat === 'All' && location.pathname === '/questions/All')
                                            ? "bg-indigo-500"
                                            : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400"
                                    )} />
                                    <span className="truncate">{cat}</span>
                                    {location.pathname.includes(encodeURIComponent(cat)) && (
                                        <motion.div layoutId="active-pill" className="ml-auto">
                                            <ChevronRight size={14} className="text-gray-400" />
                                        </motion.div>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Footer User Profile / Auth */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 min-w-[18rem]">
                    {user ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                <button onClick={logout} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1">
                                    <LogOut size={10} /> Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            <User size={18} />
                            <span>Sign In / Join</span>
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f9fafb] dark:bg-[#090c10] lg:ml-0 mt-14 lg:mt-0 relative z-0 transition-all duration-300">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:bg-[url('/grid-dark.svg')] opacity-20 pointer-events-none"></div>
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative z-10">
                    <div className="max-w-6xl mx-auto h-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
