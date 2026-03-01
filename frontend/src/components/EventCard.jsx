import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
    const percentage = Math.min((event.registration_count / 200) * 100, 100); // Mock capacity 200 for now

    const getStatusColor = () => {
        const start = new Date(event.start_time);
        const now = new Date();
        if (start.toDateString() === now.toDateString()) return 'bg-accent-pink shadow-[0_0_10px_rgba(236,72,153,0.5)]';
        if (start < now) return 'bg-slate-500';
        return 'bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]';
    };

    const getStatusLabel = () => {
        const start = new Date(event.start_time);
        const now = new Date();
        if (start.toDateString() === now.toDateString()) return 'LIVE TODAY';
        if (start < now) return 'PAST EVENT';
        return 'UPCOMING';
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="glass-card flex flex-col h-full bg-glass-gradient overflow-hidden group"
        >
            <div className="h-48 relative overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                {/* Department gradient bg */}
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary via-accent-purple to-accent-pink" />
                <Calendar className="w-16 h-16 text-slate-900/10 group-hover:scale-110 transition-transform duration-500" />

                <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 ${getStatusColor()}`}>
                        {getStatusLabel()}
                    </span>
                </div>

                <div className="absolute top-4 right-4">
                    <span className="bg-slate-50 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-semibold text-slate-900 border border-slate-200">
                        {event.department_name}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-4 line-clamp-1">{event.title}</h3>

                <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(event.start_time), 'MMM dd, yyyy • h:mm a')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {event.venue_name}
                    </div>
                </div>

                {/* Capacity bar */}
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Registration Status</span>
                        <span className={percentage > 90 ? 'text-accent-pink' : 'text-primary'}>
                            {event.registration_count} Spots Filled
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white border border-slate-100 shadow-sm rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`h-full rounded-full ${percentage > 90 ? 'bg-accent-pink' : 'bg-primary'}`}
                        />
                    </div>
                </div>

                <Link
                    to={`/events/${event.id}`}
                    className="w-full btn-outline flex items-center justify-center gap-2 group/btn"
                >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

export default EventCard;
