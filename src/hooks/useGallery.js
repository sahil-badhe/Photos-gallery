import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPhotos } from '../api/unsplash';

export const useGallery = () => {
    return useInfiniteQuery({
        queryKey: ['photos'],
        queryFn: fetchPhotos,
        getNextPageParam: (lastPage, allPages) => {
            // If last page is empty, no more pages
            if (!lastPage || lastPage.length === 0) return undefined;
            return allPages.length + 1;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
