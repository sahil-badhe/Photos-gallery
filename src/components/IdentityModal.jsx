import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IdentityModal = ({ onComplete }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const userId = crypto.randomUUID();
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;

        const identity = {
            id: userId,
            name: name.trim(),
            avatar
        };

        localStorage.setItem('shotly_user', JSON.stringify(identity));
        localStorage.setItem('shotly_username', name.trim());
        onComplete(identity);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl border border-white/50"
            >
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-8 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                        <span className="text-3xl font-black text-white italic">S</span>
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                        Experience Shotly
                    </h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed px-4">
                        Enter your name to continue and start sharing.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="relative group">
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                minLength={2}
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 group-hover:bg-white group-hover:border-slate-200"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                <div className="px-2 py-1 bg-indigo-50 text-[10px] font-black text-indigo-500 rounded uppercase tracking-wider">Min 2 chars</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={name.trim().length < 2}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-30 disabled:pointer-events-none"
                        >
                            Confirm & Continue
                        </button>
                    </form>

                    <p className="mt-8 text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Secure · Community · Real-time
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default IdentityModal;
