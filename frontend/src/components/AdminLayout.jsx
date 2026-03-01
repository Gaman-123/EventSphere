import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, MapPin, ListTodo, LogOut, ShieldCheck, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/axios';
import toast from 'react-hot-toast';

const AdminLayout = () => {
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('v_admin_key'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    // Clear old key-only sessions from previous session
    useEffect(() => {
        if (isAdmin && !localStorage.getItem('v_admin_user')) {
            localStorage.removeItem('v_admin_key');
            setIsAdmin(false);
        }
    }, [isAdmin]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/admin/login', { email, password });
            localStorage.setItem('v_admin_key', res.data.access_token);
            localStorage.setItem('v_admin_user', JSON.stringify(res.data.admin));
            setIsAdmin(true);
            toast.success(`Welcome back, ${res.data.admin.email}`);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Events', path: '/admin/events', icon: ListTodo },
        { name: 'Calendar', path: '/admin/calendar', icon: Calendar },
        { name: 'Registrations', path: '/admin/registrations', icon: Users },
        { name: 'Venues', path: '/admin/venues', icon: MapPin },
    ];

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card max-w-md w-full p-8"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-2">Admin Portal</h2>
                    <p className="text-slate-500 text-center mb-8">Access restricted to department heads and superadmins.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                placeholder="name@college.edu"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Sign In to Portal"}
                        </button>
                        <Link to="/" className="block text-center text-sm text-slate-500 hover:text-slate-700">Back to Public Site</Link>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside
                className={`h-screen fixed left-0 top-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="h-20 flex items-center px-6 border-b border-slate-200">
                    <LayoutDashboard className="w-8 h-8 text-primary shrink-0" />
                    {!isSidebarCollapsed && <span className="ml-3 font-bold text-xl">EventSphere</span>}
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!isSidebarCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    {!isSidebarCollapsed && (
                        <div className="p-3 bg-slate-50 rounded-xl mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active User</p>
                            <p className="text-sm font-medium text-slate-700 truncate">
                                {JSON.parse(localStorage.getItem('v_admin_user') || '{}').email}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            localStorage.removeItem('v_admin_key');
                            localStorage.removeItem('v_admin_user');
                            setIsAdmin(false);
                        }}
                        className="flex items-center w-full p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                <header className="h-20 flex items-center justify-between px-8 bg-slate-50/50 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent-purple overflow-hidden" />
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
