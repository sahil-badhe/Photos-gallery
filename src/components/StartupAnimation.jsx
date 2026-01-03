import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const StartupAnimation = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        const hasDoneOnboarding = localStorage.getItem('shotly_onboarding_done');
        if (hasDoneOnboarding) {
            setIsFirstVisit(false);
            // Repeat visitors just see a quick splash
            const timer = setTimeout(() => {
                setIsFinished(true);
                setTimeout(onComplete, 500);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // New visitors see the sequence
            const timers = [
                setTimeout(() => setStep(1), 800),  // Welcome
                setTimeout(() => setStep(2), 1600), // Subtext
                setTimeout(() => setStep(3), 2400), // CTA
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [onComplete]);

    const handleEnter = () => {
        localStorage.setItem('shotly_onboarding_done', 'true');
        setIsFinished(true);
        setTimeout(onComplete, 500);
    };

    return (
        <AnimatePresence>
            {!isFinished && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(100,100,255,0.05),transparent)] pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center max-w-sm w-full px-6"
                    >
                        {/* 1. Logo */}
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl mb-12"
                        >
                            <span className="text-4xl font-black text-white italic">S</span>
                        </motion.div>

                        {isFirstVisit ? (
                            <div className="text-center space-y-4">
                                {/* 2. Welcome */}
                                <AnimatePresence>
                                    {step >= 1 && (
                                        <motion.h1
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-4xl font-black text-slate-900 tracking-tight"
                                        >
                                            Welcome to Shotly
                                        </motion.h1>
                                    )}
                                </AnimatePresence>

                                {/* 3. Subtext */}
                                <AnimatePresence>
                                    {step >= 2 && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.5 }}
                                            className="text-slate-500 font-medium text-lg leading-relaxed"
                                        >
                                            React. Comment. Share moments.
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                {/* 4. CTA */}
                                <div className="pt-12">
                                    <AnimatePresence>
                                        {step >= 3 && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleEnter}
                                                className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-200 transition-all"
                                            >
                                                Tap to Enter
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <motion.h1
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-2xl font-black text-slate-900 tracking-widest uppercase"
                            >
                                Shotly
                            </motion.h1>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StartupAnimation;
