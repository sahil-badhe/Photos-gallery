import { useState, useEffect } from 'react';

const ImageModal = ({ image, onClose, onLike, onComment }) => {
    const [inputValue, setInputValue] = useState('');
    const [comments, setComments] = useState([]);

    // Reset state on new image
    useEffect(() => {
        if (image) {
            setComments([
                { user: 'Sarah', text: 'Amazing shot!' },
                { user: 'Mike', text: 'Love the lighting.' },
            ]);
        }
    }, [image]);

    if (!image) return null;

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add to local list
        setComments([...comments, { user: 'You', text: inputValue }]);

        // Add to global Activity Sidebar
        if (onComment) onComment(image, inputValue);

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
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-black/50">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Image Section */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative overflow-hidden">
                    <img
                        src={image.urls.regular}
                        alt={image.alt_description}
                        className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
                    />
                </div>

                {/* Interaction Section */}
                <div className="w-full md:w-1/3 flex flex-col bg-white h-full max-h-[40vh] md:max-h-[90vh] border-l border-gray-100">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100 flex items-center space-x-3 bg-white z-10">
                        <a href={image.user.links.html} target="_blank" rel="noreferrer" className="flex-shrink-0">
                            <img src={image.user.profile_image.medium} alt={image.user.name} className="w-10 h-10 rounded-full border border-gray-100" />
                        </a>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{image.user.name}</h3>
                            <a href={image.user.links.html} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:underline">@{image.user.username}</a>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {image.description && (
                            <div className="pb-4 border-b border-gray-50 mb-4">
                                <p className="text-gray-800 text-sm leading-relaxed">{image.description}</p>
                            </div>
                        )}

                        {comments.map((c, i) => (
                            <div key={i} className="flex space-x-2 animate-fade-in">
                                <div className="flex-shrink-0 w-8 flex justify-center pt-0.5">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{c.user[0]}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm text-gray-900 mr-2">{c.user}</span>
                                    <span className="text-sm text-gray-700 leading-relaxed">{c.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer: Input only */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                        <form onSubmit={handleCommentSubmit} className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-blue-600 font-semibold text-sm disabled:opacity-50 hover:bg-blue-50 rounded-full transition-colors"
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ImageModal;
