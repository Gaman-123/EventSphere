import { useState, useEffect } from 'react';
import { adminApi, api } from '../../api/axios';
import { Plus, Edit2, CheckCircle, XCircle, Globe, Lock, MoreHorizontal, Users, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import SlideOverPanel from '../../components/SlideOverPanel';
import EventForm from '../../components/EventForm';

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const fetchEvents = () => {
        setLoading(true);
        adminApi.get('/api/admin/events').then(res => {
            setEvents(res.data);
            setLoading(false);
        }).catch(err => {
            toast.error("Failed to load events");
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleApprove = async (id) => {
        try {
            // Assuming a valid admin_id of 1 for demo
            await adminApi.put(`/api/admin/events/${id}/approve`, { admin_id: 1 });
            toast.success("Event approved successfully");
            fetchEvents();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to approve event");
        }
    };

    const handlePublish = async (id) => {
        try {
            await adminApi.put(`/api/admin/events/${id}/publish`);
            toast.success("Event published to public view");
            fetchEvents();
        } catch (err) {
            toast.error("Failed to publish event");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
                    <p className="text-slate-500">Review, approve, and schedule campus events.</p>
                </div>
                <button
                    onClick={() => { setEditingEvent(null); setIsPanelOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Create Event
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Event Title</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Venue & Dept</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Schedule</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Registrations</th>
                                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-lg group-hover:text-primary transition-colors">{event.title}</p>
                                            <div className="flex items-center gap-2 text-xs mt-1">
                                                {event.is_public ? (
                                                    <span className="flex items-center gap-1 text-green-400"><Globe className="w-3 h-3" /> Public</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-slate-500"><Lock className="w-3 h-3" /> Draft</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {event.venue_name}
                                            </div>
                                            <div className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded w-fit text-xs font-semibold">
                                                {event.department_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <p className="font-medium">{format(new Date(event.start_time), 'MMM dd, yyyy')}</p>
                                            <p className="text-slate-500 text-xs">{format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${event.status === 'approved'
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                            : event.status === 'pending'
                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span className="font-bold">{event.registration_count}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {event.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(event.id)}
                                                    className="p-2 hover:bg-green-500/20 rounded-lg text-green-400"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {event.status === 'approved' && !event.is_public && (
                                                <button
                                                    onClick={() => handlePublish(event.id)}
                                                    className="p-2 hover:bg-primary/20 rounded-lg text-primary"
                                                    title="Publish to Public Site"
                                                >
                                                    <Globe className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                className="p-2 hover:bg-slate-50 rounded-lg text-slate-500"
                                                title="Edit"
                                                onClick={() => { setEditingEvent(event); setIsPanelOpen(true); }}
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {events.length === 0 && !loading && (
                        <div className="py-20 text-center">
                            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-500">No events found in the database.</p>
                        </div>
                    )}
                </div>
            </div>

            <SlideOverPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingEvent ? "Edit Event" : "Create New Event"}
            >
                <EventForm onSuccess={() => { setIsPanelOpen(false); fetchEvents(); }} />
            </SlideOverPanel>
        </div>
    );
};

export default EventsManagement;
