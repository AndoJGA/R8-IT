export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE = "https://image.tmdb.org/t/p/original";


export const tmdbFetch = async (endpoint, params = "") => {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}${params}`);
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
};