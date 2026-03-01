import { useState, useEffect } from 'react';
import { adminApi, api } from '../api/axios';
import toast from 'react-hot-toast';

const EventForm = ({ onSuccess, initialData = null }) => {
    const [venues, setVenues] = useState([]);
    const [departments, setDepartments] = useState([]);
    const adminUser = JSON.parse(localStorage.getItem('v_admin_user') || '{}');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        venue_id: initialData?.venue_id || '',
        department_id: initialData?.department_id || '',
        start_time: initialData?.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
        end_time: initialData?.end_time ? new Date(initialData.end_time).toISOString().slice(0, 16) : '',
        created_by: adminUser?.id || 1
    });

    useEffect(() => {
        api.get('/api/venues').then(res => {
            setVenues(res.data);
            if (!formData.venue_id && res.data.length > 0) {
                setFormData(prev => ({ ...prev, venue_id: res.data[0].id }));
            }
        });
        api.get('/api/departments').then(res => {
            setDepartments(res.data);
            if (!formData.department_id && res.data.length > 0) {
                setFormData(prev => ({ ...prev, department_id: res.data[0].id }));
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialData?.id) {
                await adminApi.put(`/api/admin/events/${initialData.id}`, formData);
                toast.success("Event updated successfully");
            } else {
                await adminApi.post('/api/admin/events', formData);
                toast.success("Event created and pending approval");
            }
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error(initialData?.id ? "Failed to update event" : "Failed to create event");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Event Title</label>
                <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Description</label>
                <textarea
                    rows={4}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Venue</label>
                    <select
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                        value={formData.venue_id}
                        onChange={e => setFormData({ ...formData, venue_id: parseInt(e.target.value) })}
                    >
                        {venues.length === 0 && <option value="">No venues found</option>}
                        {venues.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Department</label>
                    <select
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                        value={formData.department_id}
                        onChange={e => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                    >
                        {departments.length === 0 && <option value="">No depts found</option>}
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Start Time</label>
                    <input type="datetime-local" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">End Time</label>
                    <input type="datetime-local" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                </div>
            </div>
            <button type="submit" className="w-full btn-primary mt-4">
                {initialData?.id ? "Update Event" : "Create & Schedule"}
            </button>
        </form>
    );
};

export default EventForm;
