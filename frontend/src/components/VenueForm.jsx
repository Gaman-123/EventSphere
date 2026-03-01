import { useState } from 'react';
import { adminApi } from '../api/axios';
import toast from 'react-hot-toast';

const VenueForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        capacity: 100
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminApi.post('/api/venues', formData);
            toast.success("Venue added successfully");
            if (onSuccess) onSuccess();
        } catch (err) {
            toast.error("Failed to add venue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Venue Name</label>
                <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="e.g. Main Auditorium"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Capacity</label>
                <input
                    type="number"
                    required
                    min="1"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:outline-none"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-4 disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add Venue"}
            </button>
        </form>
    );
};

export default VenueForm;
