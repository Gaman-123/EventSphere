import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 border-l-4"
            style={{ borderLeftColor: color.includes('text-primary') ? '#3b82f6' : (color.includes('text-amber') ? '#f59e0b' : '#ec4899') }}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">{value}</h3>
                    {trend && <p className="text-xs text-green-400 mt-2">{trend}</p>}
                </div>
                <div className={`p-3 rounded-xl bg-white border border-slate-100 shadow-sm ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
