import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const StartupAnimation = ({ onComplete }) => {
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFinished(true);
            setTimeout(onComplete, 500); // Allow fade-out animation
        }, 2500); // Slightly longer for premium feel
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isFinished && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-rose-100"
                >
                    {/* Animated Background Glow */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 bg-white/30 backdrop-blur-3xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex flex-col items-center gap-8 relative z-10"
                    >
                        {/* Logo Box */}
                        <div className="w-24 h-24 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center text-5xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-[2rem]"></div>
                            <motion.span
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="relative"
                            >
                                A
                            </motion.span>

                            {/* Outer Glow */}
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        </div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">
                                Antigravity
                            </h1>
                            <div className="flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-slate-300"></div>
                                <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase opacity-80">
                                    Discover • React • Share
                                </p>
                                <div className="h-[1px] w-8 bg-slate-300"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StartupAnimation;
