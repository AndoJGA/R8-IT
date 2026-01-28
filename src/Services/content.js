import { tmdbFetch } from './tmdbClient';

export const getTrending = (type = 'all', time = 'week') =>
    tmdbFetch(`/trending/${type}/${time}`);

export const searchContent = (query) =>
    tmdbFetch('/search/multi', `&query=${encodeURIComponent(query)}`);

export const getCredits = (type, id) =>
    tmdbFetch(`/${type}/${id}/credits`);

export const getVideos = (type, id) =>
    tmdbFetch(`/${type}/${id}/videos`);

export const getRecommendations = (type, id) =>
    tmdbFetch(`/${type}/${id}/recommendations`);

export const getTVDetails = (id) =>
    tmdbFetch(`/tv/${id}`);

export const getTVEpisodeGroups = (id) =>
    tmdbFetch(`/tv/${id}/episode_groups`);

export const getTVSeasons = (id) =>
    tmdbFetch(`/tv/episode_group/${id}`);