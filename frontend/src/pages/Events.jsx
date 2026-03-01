import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/axios';
import EventCard from '../components/EventCard';
import CalendarView from '../components/CalendarView';
import { Search, Filter, LayoutGrid, Calendar as CalendarIcon, SlidersHorizontal, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isSameDay } from 'date-fns';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid'); // 'grid' or 'calendar'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        setLoading(true);
        api.get('/api/events')
            .then(res => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDept === 'All' || event.department_name === selectedDept;
        const matchesDate = selectedDate ? isSameDay(new Date(event.start_time), selectedDate) : true;
        return matchesSearch && matchesDept && matchesDate;
    });

    const departments = ['All', ...new Set(events.map(e => e.department_name))];

    return (
        <div className="pt-32 px-6 pb-20 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Explore Events</h1>
                    <p className="text-slate-500">Find and register for upcoming campus activities.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setView('grid')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Grid
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'calendar' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500'}`}
                    >
                        <CalendarIcon className="w-4 h-4" /> Calendar
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-12 backdrop-blur-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search events, workshops, fests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                <div className="relative">
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        placeholderText="Filter by Date"
                        className="bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors w-40"
                        isClearable
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {departments.map(dept => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDept(dept)}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDept === dept ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="glass-card h-96 animate-pulse" />
                            ))
                        ) : filteredEvents.length > 0 ? (
                            filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="bg-white border border-slate-200 shadow-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <SlidersHorizontal className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No events found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="glass-card p-6 h-[600px]"
                    >
                        <CalendarView events={events} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;
