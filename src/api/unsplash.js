// Developer Note:
// 1. The .env file must be at the PROJECT ROOT (same level as package.json).
// 2. You must RESTART the Vite dev server after creating/editing the .env file.
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com';

export const fetchPhotos = async ({ pageParam = 1 }) => {
    // Safe guard: Check for key existence before making request
    if (!UNSPLASH_ACCESS_KEY || typeof UNSPLASH_ACCESS_KEY !== 'string') {
        throw new Error('MISSING_KEY');
    }

    try {
        const response = await fetch(
            `${BASE_URL}/photos?page=${pageParam}&per_page=20&order_by=latest`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Unsplash API Error:', response.status, errorData);
            throw new Error(errorData.errors?.[0] || `Unsplash API Error: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            console.error('Unexpected API response format:', data);
            throw new Error('Invalid response format from Unsplash');
        }
        return data;
    } catch (err) {
        console.error('Fetch Photos Failed:', err);
        throw err;
    }
};
export const fetchPhotoById = async (id) => {
    if (!UNSPLASH_ACCESS_KEY || typeof UNSPLASH_ACCESS_KEY !== 'string') {
        throw new Error('MISSING_KEY');
    }

    try {
        const response = await fetch(`${BASE_URL}/photos/${id}`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Unsplash API Error: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error('Fetch Photo By ID Failed:', err);
        throw err;
    }
};
