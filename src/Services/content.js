import { tmdbFetch } from './tmdbClient';

export const getTrending = (type = 'all', time = 'week') =>
    tmdbFetch(`/trending/${type}/${time}`);

export const searchContent = (query) =>
    tmdbFetch('/search/multi', `&query=${encodeURIComponent(query)}`);

export const getDetails = (type, id) =>
    tmdbFetch(`/${type}/${id}`);