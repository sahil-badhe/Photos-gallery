import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tx, id } from '@instantdb/react';
import Layout from './components/Layout';
import FeedList from './components/Feed/FeedList';
import GalleryGrid from './components/Gallery/GalleryGrid';
import ImageModal from './components/Gallery/ImageModal';
import StartupAnimation from './components/StartupAnimation';
import { db } from './db/instant';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);

  // Sync with InstantDB
  const { isLoading, error, data } = db.useQuery({ activities: {} });

  const activities = data?.activities || [];
  // Sort activities by creation time (newest first)
  const sortedActivities = [...activities].sort((a, b) => b.createdAt - a.createdAt);

  const handleReaction = (photo, emoji = '❤️') => {
    db.transact(tx.activities[id()].update({
      user: 'You',
      type: 'reaction',
      action: 'reacted',
      content: emoji,
      targetId: photo.id,
      targetThumbnail: photo.urls.thumb, // Save thumbnail for the feed
      createdAt: Date.now()
    }));
  };

  const handleComment = (photo, text) => {
    db.transact(tx.activities[id()].update({
      user: 'You',
      type: 'comment',
      action: 'commented',
      content: text,
      targetId: photo.id,
      targetThumbnail: photo.urls.thumb, // Save thumbnail for the feed
      createdAt: Date.now()
    }));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StartupAnimation onComplete={() => setShowAnimation(false)} />

      <div className={`transition-all duration-1000 ${showAnimation ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        <Layout
          gallery={<GalleryGrid onImageSelect={setSelectedImage} onLike={handleReaction} onComment={handleComment} />}
          feed={<FeedList activities={sortedActivities} />}
        />

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onLike={handleReaction}
            onComment={handleComment}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
