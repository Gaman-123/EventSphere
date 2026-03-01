import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { MapPin, Users, Info, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import SlideOverPanel from '../../components/SlideOverPanel';
import VenueForm from '../../components/VenueForm';

const Venues = () => {
    const [venues, setVenues] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const fetchVenues = () => {
        api.get('/api/venues').then(res => setVenues(res.data));
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Campus Venues</h1>
                    <p className="text-slate-500">View and manage booking capacity for all locations.</p>
                </div>
                <button
                    onClick={() => setIsPanelOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Venue
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {venues.map((venue) => (
                    <motion.div
                        whileHover={{ y: -5 }}
                        key={venue.id}
                        className="glass-card p-6 flex flex-col items-center text-center group"
                    >
                        <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                            <MapPin className="w-8 h-8 text-primary" />
                        </div>

                        <h3 className="text-xl font-bold mb-2">{venue.name}</h3>

                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                            <Users className="w-4 h-4" />
                            <span>Capacity: {venue.capacity} persons</span>
                        </div>

                        <div className="w-full pt-6 border-t border-slate-200 flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${venue.is_active ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                {venue.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button className="p-2 hover:bg-white border border-slate-100 shadow-sm rounded-lg text-slate-500">
                                <Info className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Booking Timeline Preview placeholder */}
            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Venue Availability Today</h3>
                <div className="space-y-8">
                    {venues.slice(0, 3).map(venue => (
                        <div key={venue.id} className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{venue.name}</span>
                                <span className="text-slate-500">8:00 AM - 6:00 PM</span>
                            </div>
                            <div className="h-6 w-full bg-white border border-slate-100 shadow-sm rounded-lg relative overflow-hidden">
                                <div className="absolute inset-y-0 left-[20%] right-[50%] bg-primary/20 border-x border-primary/40 flex items-center px-3 text-[10px] text-primary-glow font-bold">
                                    CODING WORKSHOP
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <SlideOverPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Add New Venue"
            >
                <VenueForm onSuccess={() => { setIsPanelOpen(false); fetchVenues(); }} />
            </SlideOverPanel>
        </div>
    );
};

export default Venues;
