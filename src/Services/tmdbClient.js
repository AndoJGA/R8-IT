export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
/*For Posters*/
export const IMAGE_SMALL_POSTER = "https://image.tmdb.org/t/p/w342";
export const IMAGE_MINI_POSTER = "https://image.tmdb.org/t/p/w92";
/*For Backdrops*/
export const IMAGE_MINI_BACKDROP = "https://image.tmdb.org/t/p/w300";
export const IMAGE_MEDIUM_BACKDROP = "https://image.tmdb.org/t/p/w780";
export const IMAGE_HIGH_BACKDROP = "https://image.tmdb.org/t/p/w1280";

export const tmdbFetch = async (endpoint, params = "") => {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}${params}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
};