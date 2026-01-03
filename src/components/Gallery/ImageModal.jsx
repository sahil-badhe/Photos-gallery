import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tx, id } from '@instantdb/react';
import { db } from '../../db/instant';

const ImageModal = ({ image, currentUser, onClose, onLike, onComment }) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef(null);

    // Sync comments from InstantDB
    const { isLoading, error, data } = db.useQuery({
        comments: {
            $: {
                where: { photoId: image?.id }
            }
        }
    });

    const comments = data?.comments || [];
    // Sort comments: neuesten zuerst (latest first)
    const sortedComments = [...comments].sort((a, b) => b.createdAt - a.createdAt);

    // Auto-scroll to top when new comment arrives
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [sortedComments.length]);

    if (!image) return null;

    const themeColor = image.color || '#000000';
    const softThemeColor = `${themeColor}15`;
    const borderThemeColor = `${themeColor}30`;

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text || !image || !currentUser) return;

        // Persist to InstantDB
        db.transact(
            tx.comments[id()].update({
                photoId: image.id,
                user: {
                    id: currentUser.id,
                    name: currentUser.name,
                    avatar: currentUser.avatar
                },
                text: text,
                createdAt: Date.now()
            })
        );

        // Also add to global Activity Sidebar (if needed for backward compatibility)
        if (onComment) onComment(image, text);

        setInputValue('');
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-black/50 border border-white/10">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-6 right-6 z-20 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative overflow-hidden group">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        style={{ backgroundColor: themeColor }}
                        className="absolute inset-0 blur-3xl scale-110"
                    />
                    <img
                        src={image.urls.regular}
                        alt={image.alt_description}
                        className="relative z-10 max-w-full max-h-[50vh] md:max-h-[85vh] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                </div>

                {/* Interaction Section */}
                <div className="w-full md:w-1/3 flex flex-col bg-white h-full max-h-[40vh] md:max-h-[90vh]">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-50 flex items-center space-x-4">
                        <a href={image.user.links.html} target="_blank" rel="noreferrer" className="flex-shrink-0">
                            <img src={image.user.profile_image.medium} alt={image.user.name} className="w-12 h-12 rounded-2xl border-2 border-slate-50 shadow-sm object-cover" />
                        </a>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{image.user.name}</h3>
                            <p className="text-xs text-slate-400 font-medium">@{image.user.username}</p>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {image.description && (
                            <div className="pb-6 border-b border-slate-50 mb-2">
                                <p className="text-slate-600 text-[13px] leading-relaxed font-medium italic">"{image.description}"</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-center py-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    style={{ borderTopColor: themeColor }}
                                    className="w-6 h-6 border-2 border-slate-100 rounded-full"
                                />
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {sortedComments.map((c) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex space-x-3"
                                >
                                    <img
                                        src={c.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user.name}`}
                                        alt={c.user.name}
                                        className="w-8 h-8 rounded-xl border border-slate-100 shadow-sm flex-shrink-0"
                                    />
                                    <div
                                        style={{ backgroundColor: softThemeColor, borderColor: borderThemeColor }}
                                        className="flex-1 p-3.5 rounded-2xl rounded-tl-none border shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-xs text-slate-900">{c.user.name}</span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[13px] text-slate-700 leading-relaxed">{c.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {!isLoading && sortedComments.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12 px-4"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 scale-110">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <p className="text-slate-900 font-black text-sm mb-1">Be the first to share a thought</p>
                                <p className="text-slate-400 text-xs font-medium">Your perspective matters ✨</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer: Input */}
                    <div className="p-6 border-t border-slate-50">
                        <form onSubmit={handleCommentSubmit} className="relative group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Write something meaningful..."
                                className="w-full pl-6 pr-16 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white transition-all text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                style={{
                                    borderColor: inputValue.trim() ? borderThemeColor : 'transparent',
                                    '--tw-ring-color': themeColor
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                style={{ color: themeColor }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-0 disabled:translate-x-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ImageModal;
