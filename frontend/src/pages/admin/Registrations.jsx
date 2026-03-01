import { useState, useEffect } from 'react';
import { adminApi, api } from '../../api/axios';
import { Download, Search, Mail, User, Hash, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Registrations = () => {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        adminApi.get('/api/admin/events').then(res => {
            setEvents(res.data);
            if (res.data.length > 0) setSelectedEventId(res.data[0].id);
        });
    }, []);

    useEffect(() => {
        if (selectedEventId) {
            setLoading(true);
            adminApi.get(`/api/admin/events/${selectedEventId}/registrations`)
                .then(res => {
                    setRegistrations(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setRegistrations([]);
                    setLoading(false);
                });
        }
    }, [selectedEventId]);

    const filtered = registrations.filter(r =>
        r.student_name.toLowerCase().includes(search.toLowerCase()) ||
        r.roll_number.toLowerCase().includes(search.toLowerCase()) ||
        r.student_email.toLowerCase().includes(search.toLowerCase())
    );

    const exportCSV = () => {
        const headers = ["Roll Number", "Name", "Email", "Registered At"];
        const rows = filtered.map(r => [r.roll_number, r.student_name, r.student_email, r.registered_at]);
        const content = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `registrations_event_${selectedEventId}.csv`;
        a.click();
        toast.success("CSV Exported successfully");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Student Registrations</h1>
                    <p className="text-slate-500">Manage and export participant lists.</p>
                </div>
                <button
                    onClick={exportCSV}
                    disabled={filtered.length === 0}
                    className="btn-outline flex items-center gap-2 disabled:opacity-50"
                >
                    <Download className="w-5 h-5" /> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <label className="text-sm font-bold text-slate-500 uppercase px-2">Select Event</label>
                    <div className="space-y-2">
                        {events.map(event => (
                            <button
                                key={event.id}
                                onClick={() => setSelectedEventId(event.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedEventId === event.id
                                    ? 'bg-primary/10 border-primary text-white shadow-lg shadow-primary/5'
                                    : 'bg-white border border-slate-100 shadow-sm border-slate-200 text-slate-500 hover:border-slate-200'
                                    }`}
                            >
                                <p className="font-semibold text-sm line-clamp-1">{event.title}</p>
                                <p className="text-[10px] mt-1 opacity-60 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {format(new Date(event.start_time), 'MMM dd')}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, roll number or email..."
                            className="w-full bg-white border border-slate-100 shadow-sm border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="glass-card overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border border-slate-100 shadow-sm border-b border-slate-200">
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Student</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Roll No</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Email</th>
                                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filtered.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                                                    <User className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <span className="font-medium">{reg.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm bg-primary/5 text-primary-glow px-2 py-0.5 rounded border border-primary/10">
                                                {reg.roll_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{reg.student_email}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {reg.registered_at ? format(new Date(reg.registered_at), 'MMM dd, p') : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {(filtered.length === 0 && !loading) && (
                            <div className="py-20 text-center">
                                <Hash className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500">No registrations found for this event.</p>
                            </div>
                        )}
                        {loading && <div className="py-20 text-center animate-pulse text-slate-500">Fetching student list...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrations;
