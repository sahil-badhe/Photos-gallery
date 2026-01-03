import { useState, useRef, useEffect } from 'react';

const ImageCard = ({ image, onClick, onLike, onComment }) => {
    const [showInput, setShowInput] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [userReaction, setUserReaction] = useState(null);
    const [commentText, setCommentText] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (showInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (commentText.trim()) {
            onComment(image, commentText);
            setCommentText('');
            setShowInput(false);
        }
    };

    return (
        <div
            className="relative break-inside-avoid mb-6 group cursor-zoom-in overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-5px_rgb(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 ease-out border border-white/50"
            onClick={() => onClick(image)}
        >
            <img
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                style={{ display: 'block' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <div className="w-full">
                    {showInput ? (
                        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-full animate-fade-in-up">
                            <input
                                ref={inputRef}
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onBlur={() => !commentText && setShowInput(false)}
                                placeholder="Type a comment..."
                                className="w-full px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                            />
                        </form>
                    ) : (
                        <div className="text-white text-sm font-medium w-full flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <img src={image.user.profile_image.small} alt={image.user.name} className="w-6 h-6 rounded-full border border-white/50" />
                                <span>{image.user.name}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowInput(true);
                                    }}
                                    className="bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full transition-colors text-white"
                                    title="Add comment"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </button>

                                {/* Compact Reaction System */}
                                <div className="relative">
                                    {showReactions && (
                                        <div className="absolute bottom-full right-0 mb-3 flex gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-xl animate-fade-in-up origin-bottom-right z-50" onClick={(e) => e.stopPropagation()}>
                                            {['❤️', '🔥', '👏', '😂', '😍'].map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onLike(image, emoji);
                                                        setUserReaction(emoji);
                                                        setShowReactions(false);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 hover:scale-125 transition-all duration-200 text-lg"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowReactions(!showReactions);
                                        }}
                                        className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center w-9 h-9 ${showReactions || userReaction ? 'bg-white text-rose-500 rotate-0 shadow-md scale-100' : 'bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm'}`}
                                        title="React"
                                    >
                                        {userReaction ? (
                                            <span className="text-lg leading-none animate-bounce-small">{userReaction}</span>
                                        ) : (
                                            showReactions ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                </svg>
                                            )
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ImageCard;
