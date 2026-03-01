import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/axios';
import { format } from 'date-fns';
import RegistrationForm from '../components/RegistrationForm';
import { MapPin, Calendar, Building2, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/events/${id}`)
            .then(res => {
                setEvent(res.data);
                setLoading(false);
            })
            .catch((err) => {
                toast.error("Event not found or closed");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="pt-40 text-center animate-pulse text-2xl">Loading event details...</div>;
    if (!event) return <div className="pt-40 text-center text-2xl">Event not found.</div>;

    const percentage = Math.min((event.registration_count / 200) * 100, 100);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="pt-20 min-h-screen">
            {/* Hero Header */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-dark to-dark z-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-transparent mix-blend-overlay" />

                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-50 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 mb-6 text-sm font-semibold tracking-wider text-primary-glow"
                    >
                        {event.department_name} • {event.venue_name}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-7xl font-bold mb-6"
                    >
                        {event.title}
                    </motion.h1>
                    <div className="flex gap-4">
                        <button onClick={copyLink} className="btn-outline !p-3 rounded-full hover:scale-110">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <Link to="/events" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> Back to events
                        </Link>

                        <div className="glass-card p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Date</span>
                                </div>
                                <p className="font-semibold">{format(new Date(event.start_time), 'MMM dd, yyyy')}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-accent-purple">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Time</span>
                                </div>
                                <p className="font-semibold">{format(new Date(event.start_time), 'h:mm a')}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-accent-pink">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Venue</span>
                                </div>
                                <p className="font-semibold">{event.venue_name}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-accent-cyan">
                                    <Building2 className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Organized by</span>
                                </div>
                                <p className="font-semibold">{event.department_name}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">About the Event</h2>
                            <div className="text-lg text-slate-500 leading-relaxed whitespace-pre-wrap">
                                {event.description || "No description provided."}
                            </div>
                        </div>
                    </div>

                    {/* Registration Panel */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8 bg-glass-gradient border-primary/20 ring-1 ring-primary/10 shadow-2xl shadow-primary/5"
                        >
                            <h3 className="text-2xl font-bold mb-6">Register Now</h3>

                            {/* Capacity visual */}
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-slate-500">Availability</span>
                                    <span className="text-lg font-bold">{event.registration_count} / 200</span>
                                </div>
                                <div className="h-2 w-full bg-white border border-slate-100 shadow-sm rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        className={`h-full ${percentage > 90 ? 'bg-accent-pink' : 'bg-primary'}`}
                                    />
                                </div>
                                {percentage > 90 && (
                                    <div className="flex items-center gap-2 text-xs text-accent-pink font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-pink animate-ping" />
                                        ALMOST FULL - SPOTS FILLING FAST
                                    </div>
                                )}
                            </div>

                            <RegistrationForm eventId={event.id} onRegistered={() => {
                                setEvent({ ...event, registration_count: event.registration_count + 1 });
                            }} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
