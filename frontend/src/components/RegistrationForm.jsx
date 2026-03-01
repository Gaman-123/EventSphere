import { useState } from 'react';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, Hash, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationForm = ({ eventId, onRegistered }) => {
    const [formData, setFormData] = useState({
        student_name: '',
        student_email: '',
        roll_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post(`/api/events/${eventId}/register`, formData);
            setSuccess(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
            });
            if (onRegistered) onRegistered();
        } catch (err) {
            const detail = err.response?.data?.detail || "Registration failed";
            toast.error(detail);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
            >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Registered!</h4>
                <p className="text-slate-500 mb-6">See you at the event. A confirmation has been sent to your email.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-sm text-primary hover:underline"
                >
                    Register another student
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        value={formData.student_name}
                        onChange={e => setFormData({ ...formData, student_name: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="email"
                        required
                        placeholder="e.g. john@university.edu"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        value={formData.student_email}
                        onChange={e => setFormData({ ...formData, student_email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Roll Number</label>
                <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        required
                        placeholder="e.g. 21CS042"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        value={formData.roll_number}
                        onChange={e => setFormData({ ...formData, roll_number: e.target.value })}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> processing...
                    </>
                ) : "Confirm Registration"}
            </button>
        </form>
    );
};

export default RegistrationForm;
