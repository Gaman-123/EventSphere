import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

const PublicLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen">
            <nav className="fixed top-0 left-0 w-full z-50 bg-slate-50/50 backdrop-blur-xl border-b border-slate-200">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent-purple rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                            <Layers className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            EventSphere
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                        <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>Events</Link>
                        <Link to="/admin" className="btn-outline !py-2 !px-4 text-sm">Organize Event</Link>
                    </div>
                </div>
            </nav>

            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
};

export default PublicLayout;
