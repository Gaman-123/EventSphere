import { useState, useEffect } from 'react';
import { adminApi } from '../../api/axios';
import CalendarView from '../../components/CalendarView';
import { CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import SlideOverPanel from '../../components/SlideOverPanel';
import EventForm from '../../components/EventForm';

const AdminCalendar = () => {
    const [events, setEvents] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = () => {
        adminApi.get('/api/admin/events').then(res => setEvents(res.data));
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSelectSlot = (slotInfo) => {
        setSelectedEvent(null);
        setSelectedSlot(slotInfo);
        setIsPanelOpen(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedSlot(null);
        setSelectedEvent(event.resource);
        setIsPanelOpen(true);
    };

    return (
        <div className="space-y-8 h-screen flex flex-col -mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Event Schedule</h1>
                    <p className="text-slate-500">Master timeline of all campus bookings.</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        <span className="text-slate-700">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
                        <span className="text-slate-700">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                        <span className="text-slate-700">Conflict</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 glass-card p-6 min-h-[600px] mb-8">
                <CalendarView
                    events={events}
                    isAdmin={true}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                />
            </div>

            <SlideOverPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={selectedEvent ? "Edit Event" : "Create New Event"}
            >
                <div className="text-sm text-slate-500 mb-6">
                    {selectedSlot && !selectedEvent && `Selected timeslot: ${selectedSlot.start.toLocaleString()} to ${selectedSlot.end.toLocaleString()}`}
                </div>
                <EventForm
                    onSuccess={() => { setIsPanelOpen(false); fetchEvents(); }}
                    initialData={selectedEvent || (selectedSlot ? { start_time: selectedSlot.start, end_time: selectedSlot.end } : null)}
                />
            </SlideOverPanel>
        </div>
    );
};

export default AdminCalendar;
