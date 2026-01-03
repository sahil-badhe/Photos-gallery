const FeedList = ({ activities = [] }) => {
    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-50 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                </div>
                <p className="text-gray-900 font-bold text-base">Quiet around here...</p>
                <p className="text-gray-500 text-sm mt-1">Be the first to spark a conversation!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 py-8 bg-white/30 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 min-h-[600px] transition-all duration-500">
            <header className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/20"></div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Live Updates</h2>
                </div>
                <span className="text-xs font-bold text-white bg-slate-900 px-3 py-1 rounded-full shadow-lg shadow-slate-900/30">{activities.length}</span>
            </header>
            <div className="space-y-5">
                {activities.map((item) => (
                    <FeedItem key={item.id} activity={item} />
                ))}
            </div>
        </div>
    );
};

const FeedItem = ({ activity }) => {
    const timeAgo = activity.createdAt
        ? new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now';

    const isReaction = activity.type === 'reaction' || activity.action === 'reacted';

    // Theme Configuration
    const theme = isReaction
        ? {
            wrapper: "from-rose-50/60 via-white/80 to-white/40",
            border: "border-rose-500",
            ring: "ring-rose-200",
            iconBg: "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-200",
            bubble: "bg-rose-50/80 border-rose-100",
            thumbBorder: "border-rose-200"
        }
        : {
            wrapper: "from-blue-50/60 via-white/80 to-white/40",
            border: "border-blue-500",
            ring: "ring-blue-200",
            iconBg: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-200",
            bubble: "bg-white/90 border-blue-100 shadow-sm",
            thumbBorder: "border-blue-200"
        };

    return (
        <div className={`relative flex items-start p-5 rounded-2xl rounded-l-lg border-l-[6px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-r backdrop-blur-sm ${theme.wrapper} ${theme.border}`}>

            {/* Avatar Section */}
            <div className="relative mr-4">
                <div className={`p-0.5 bg-white rounded-full ring-2 ${theme.ring}`}>
                    <img
                        src="https://images.unsplash.com/placeholder-avatars/extra-large.jpg?bg=fff&crop=faces&dpr=1&h=150&w=150&fit=crop"
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white text-[10px] ${theme.iconBg}`}>
                    {isReaction ? '❤️' : '💬'}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0 mr-3">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-900 leading-snug mb-1.5">
                        <span className="font-bold text-gray-900">{activity.user || 'You'}</span>
                        <span className="text-gray-500 font-medium mx-1.5 text-xs opacity-80">
                            {isReaction ? 'reacted' : 'commented'}
                        </span>
                    </p>

                    {/* Activity Payload */}
                    <div className="relative">
                        {isReaction ? (
                            <span className="text-2xl transform origin-left hover:scale-125 transition-transform cursor-default inline-block filter drop-shadow-sm">
                                {activity.content}
                            </span>
                        ) : (
                            <div className={`relative text-gray-700 text-sm px-3.5 py-2 rounded-2xl rounded-tl-none border inline-block max-w-full break-words leading-relaxed ${theme.bubble}`}>
                                {activity.content}
                            </div>
                        )}
                    </div>

                    <span className="text-[10px] text-gray-400 font-semibold mt-2.5 flex items-center gap-1.5 uppercase tracking-wide opacity-50 group-hover:opacity-100 transition-opacity">
                        {timeAgo}
                    </span>
                </div>
            </div>

            {/* Thumbnail */}
            {activity.targetThumbnail && (
                <div className={`w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white border-2 p-0.5 shadow-sm group-hover:rotate-2 transition-transform duration-300 self-center ${theme.thumbBorder}`}>
                    <img
                        src={activity.targetThumbnail}
                        alt="Interacted media"
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    );
};

export default FeedList;
