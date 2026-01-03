import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGallery } from '../../hooks/useGallery';
import ImageCard from './ImageCard';

const GalleryGrid = ({ onImageSelect, onLike, onComment }) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useGallery();
    const observerTarget = useRef(null);

    const photos = useMemo(() => {
        return data?.pages.flatMap(page => page) || [];
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return <div className="py-20 text-center text-gray-400 text-sm animate-pulse">Loading gallery...</div>;

    if (isError) {
        if (error.message === 'MISSING_KEY') {
            return (
                <div className="py-20 text-center px-4">
                    <div className="inline-block p-6 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 max-w-md">
                        <h3 className="font-bold text-lg mb-2">Setup Required</h3>
                        <p className="mb-4 text-sm">To see real photos, you need to add your Unsplash Access Key.</p>
                        <div className="bg-white p-3 rounded border border-amber-100 text-left text-xs font-mono mb-4 overflow-x-auto">
                            <span className="text-gray-500"># .env file</span><br />
                            VITE_UNSPLASH_ACCESS_KEY=your_key_here
                        </div>
                        <p className="text-xs text-amber-600">
                            Get one for free at <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer" className="underline font-semibold">unsplash.com/developers</a>
                        </p>
                    </div>
                </div>
            );
        }
        return (
            <div className="py-10 text-center px-4">
                <div className="inline-block p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                    <p className="font-semibold">Unable to load photos</p>
                    <p className="mt-1 opacity-80">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            <header className="pt-12 pb-16 mb-16 border-b border-slate-100 group/header transition-all duration-700">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] w-12 bg-indigo-500/30 transform origin-left transition-all duration-700 group-hover/header:w-16 group-hover/header:bg-indigo-500"></div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] block group-hover/header:text-slate-600 transition-colors">Curated Collection</span>
                    </div>

                    <h1 className="text-7xl lg:text-8xl xl:text-9xl font-[1000] tracking-[-0.04em] leading-[0.9] transition-all duration-700 flex items-baseline gap-2 cursor-default select-none group-hover/header:tracking-[-0.03em] overflow-visible">
                        <span className="text-slate-900 drop-shadow-sm py-4 -my-4 px-2 -mx-2">
                            Visuals
                        </span>

                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                            className="relative block"
                        >
                            <span className="text-slate-900 block transition-transform group-hover/header:scale-110 duration-500">•</span>
                        </motion.span>
                    </h1>
                </motion.div>
            </header>

            {photos.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                    <p className="text-lg font-medium">No photos found</p>
                    <p className="text-sm opacity-70 mt-1">Try checking your API limits or key.</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-2 xl:columns-3 gap-10 space-y-10">
                    {photos.map((photo) => (
                        <ImageCard key={photo.id} image={photo} onClick={onImageSelect} onLike={onLike} onComment={onComment} />
                    ))}
                </div>
            )}

            {/* Infinite Scroll Sentinel & Loading State */}
            <div ref={observerTarget} className="mt-8 text-center pb-12 h-20 flex items-center justify-center">
                {isFetchingNextPage ? (
                    <div className="flex items-center space-x-2 text-slate-400">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
                        <span className="text-sm font-medium">Curating more perspective...</span>
                    </div>
                ) : !hasNextPage && photos.length > 0 ? (
                    <span className="text-xs text-slate-300 uppercase tracking-widest opacity-60">End of Collection</span>
                ) : null}
            </div>

            <div className="text-center pb-4 text-xs text-slate-400 opacity-50 hover:opacity-100 transition-opacity">
                Photos provided by <a href="https://unsplash.com?utm_source=demo_app&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline decoration-slate-200">Unsplash</a>
            </div>
        </div>
    );
};
export default GalleryGrid;
