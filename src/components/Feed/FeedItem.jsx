const FeedItem = ({ user, action, time, avatar }) => {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-default group border border-transparent hover:border-gray-100">
            <img
                src={avatar}
                alt={user}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all"
            />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    {user} <span className="text-gray-500 font-normal">{action}</span>
                </p>
                <p className="text-xs text-gray-400">{time}</p>
            </div>
        </div>
    );
};
export default FeedItem;
