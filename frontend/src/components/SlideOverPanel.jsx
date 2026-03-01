import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SlideOverPanel = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-xl bg-white border-l border-slate-200 shadow-2xl z-[101] flex flex-col"
                    >
                        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-200">
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white border border-slate-100 shadow-sm rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SlideOverPanel;
