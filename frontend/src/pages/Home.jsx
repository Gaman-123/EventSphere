import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Calendar, ArrowRight, Star } from 'lucide-react';

const Home = () => {
    const [eventCount, setEventCount] = useState(0);

    useEffect(() => {
        api.get('/api/events').then(res => setEventCount(res.data.length)).catch(() => { });
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Hero Content */}
            <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
                >
                    <span className="text-primary font-medium flex items-center gap-2">
                        <Star className="w-4 h-4 fill-primary-glow" />
                        {eventCount} Live Events Happening Now
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-bold tracking-tight mb-8"
                >
                    Discover <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-purple to-accent-pink">Campus Events</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-slate-500 max-w-2xl mb-12"
                >
                    Your all-in-one platform for campus life. From coding workshops to cultural fests,
                    stay connected and never miss out on the action.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link to="/events" className="btn-primary flex items-center gap-2 text-lg">
                        Browse Events <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link to="/events" className="btn-outline flex items-center gap-2 text-lg">
                        <Calendar className="w-5 h-5" /> View Calendar
                    </Link>
                </motion.div>

                {/* Floating preview cards */}
                <div className="hidden lg:block absolute -left-20 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                    <div className="glass-card p-6 w-64 rotate-12 mb-8">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </div>
                    <div className="glass-card p-6 w-64 -rotate-6">
                        <div className="w-10 h-10 bg-accent-purple/20 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </div>
                </div>

                <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                    <div className="glass-card p-6 w-64 -rotate-12 mb-8">
                        <div className="w-10 h-10 bg-accent-pink/20 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </div>
                    <div className="glass-card p-6 w-64 rotate-6">
                        <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg mb-4" />
                        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </div>
                </div>
            </main>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-accent-purple/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>
        </div>
    );
};

export default Home;
