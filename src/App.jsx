import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tx, id } from '@instantdb/react';
import Layout from './components/Layout';
import FeedList from './components/Feed/FeedList';
import GalleryGrid from './components/Gallery/GalleryGrid';
import ImageModal from './components/Gallery/ImageModal';
import StartupAnimation from './components/StartupAnimation';
import IdentityModal from './components/IdentityModal';
import { db } from './db/instant';
import { fetchPhotoById } from './api/unsplash';

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
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);

  // Persistent User Identity from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('shotly_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync Data from InstantDB
  const { isLoading: queryLoading, error, data } = db.useQuery({
    activities: {}
  });

  const activities = data?.activities || [];
  // Sort activities by creation time (newest first)
  const sortedActivities = [...activities].sort((a, b) => b.createdAt - a.createdAt);

  const handleReaction = (photo, emoji = '❤️') => {
    if (!currentUser) {
      setPendingAction({ type: 'reaction', data: { photo, emoji } });
      setIsIdentityModalOpen(true);
      return;
    }

    db.transact(tx.activities[id()].update({
      userId: currentUser.id,
      user: currentUser.name,
      avatar: currentUser.avatar,
      type: 'reaction',
      action: 'reacted',
      content: emoji,
      targetId: photo.id,
      targetThumbnail: photo.urls.thumb,
      createdAt: Date.now()
    }));
  };

  const handleComment = (photo, text) => {
    if (!currentUser) {
      setPendingAction({ type: 'comment', data: { photo, text } });
      setIsIdentityModalOpen(true);
      return;
    }

    db.transact(tx.activities[id()].update({
      userId: currentUser.id,
      user: currentUser.name,
      avatar: currentUser.avatar,
      type: 'comment',
      action: 'commented',
      content: text,
      targetId: photo.id,
      targetThumbnail: photo.urls.thumb,
      createdAt: Date.now()
    }));
  };

  const handleIdentityComplete = (user) => {
    setCurrentUser(user);
    setIsIdentityModalOpen(false);

    // Resume the pending action
    if (pendingAction) {
      if (pendingAction.type === 'reaction') {
        handleReaction(pendingAction.data.photo, pendingAction.data.emoji);
      } else if (pendingAction.type === 'comment') {
        handleComment(pendingAction.data.photo, pendingAction.data.text);
      }
      setPendingAction(null);
    }
  };

  const handleActivityClick = async (activity) => {
    if (!activity.targetId) return;

    try {
      setIsActivityOpen(false);
      const photo = await fetchPhotoById(activity.targetId);
      setSelectedImage(photo);
    } catch (err) {
      console.error('Failed to open photo from activity:', err);
    }
  };

  const toggleActivity = () => {
    setIsActivityOpen(!isActivityOpen);
    if (!isActivityOpen) {
      setSelectedImage(null);
    }
  };

  const selectImage = (image) => {
    setSelectedImage(image);
    setIsActivityOpen(false);
  };

  const activeThemeColor = selectedImage?.color || null;

  return (
    <QueryClientProvider client={queryClient}>
      <StartupAnimation onComplete={() => setShowAnimation(false)} />

      <AnimatePresence>
        {isIdentityModalOpen && (
          <IdentityModal key="modal" onComplete={handleIdentityComplete} />
        )}
      </AnimatePresence>

      <div className={`transition-all duration-1000 ${showAnimation ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
        <Layout
          currentUser={currentUser}
          activeThemeColor={activeThemeColor}
          isFeedOpen={isActivityOpen}
          setIsFeedOpen={setIsActivityOpen}
          onToggleFeed={toggleActivity}
          onCloseFeed={() => setIsActivityOpen(false)}
          gallery={<GalleryGrid onImageSelect={selectImage} onLike={handleReaction} onComment={handleComment} />}
          feed={<FeedList activities={sortedActivities} onItemClick={handleActivityClick} />}
        />

        {selectedImage && (
          <ImageModal
            image={selectedImage}
            currentUser={currentUser}
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
