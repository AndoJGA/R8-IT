import React, { useEffect, useState } from "react";
import { getTrending } from "../services/content.js";
import { getLogo } from "../services/images.js";
import {
    IMAGE_BASE,
    IMAGE_MINI_BACKDROP,
    IMAGE_MEDIUM_BACKDROP,
    IMAGE_HIGH_BACKDROP
} from "../services/tmdbClient.js";
import genreData from "../services/genres.js";
import { randomIndex } from "../services/randomNumber.js";

const TopPick = () => {
    const [loading, setLoading] = useState(true);
    const [item, setItem] = useState(null);
    const [currentBackdrop, setCurrentBackdrop] = useState(""); // Holds the loaded image URL

    // 1. Fetch the data first
    useEffect(() => {
        const fetchTopContent = async () => {
            setLoading(true);
            try {
                const data = await getTrending('all', 'week');
                // Safely pick one item from the results
                const selectedItem = data.results[randomIndex % data.results.length];

                const type = selectedItem.media_type || 'movie';
                const logoUrl = await getLogo(type, selectedItem.id);

                setItem({ ...selectedItem, logo_full_path: logoUrl });
            } catch (error) {
                console.error("Failed to load trending content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopContent();
    }, []);

    // 2. Progressive Image Loading Logic
    useEffect(() => {
        if (!item?.backdrop_path) return;

        // The order of quality we want to load
        const qualityLevels = [
            IMAGE_MINI_BACKDROP,
            IMAGE_MEDIUM_BACKDROP,
            IMAGE_HIGH_BACKDROP,
            IMAGE_BASE
        ];

        const loadSequence = async () => {
            for (const baseUrl of qualityLevels) {
                const fullUrl = `${baseUrl}${item.backdrop_path}`;

                try {
                    // Pre-load the image in the background
                    await new Promise((resolve, reject) => {
                        const img = new Image();
                        img.src = fullUrl;
                        img.onload = resolve;
                        img.onerror = reject;
                    });

                    // Only update the UI once this specific quality is fully ready
                    setCurrentBackdrop(fullUrl);
                } catch (err) {
                    console.warn(`Failed to load backdrop quality: ${baseUrl}`);
                }
            }
        };

        loadSequence();
    }, [item]);

    const handlePlay = () => console.log("Playing content...");

    if (loading) return <div className="loader">Loading Trending Content...</div>;
    if (!item) return null;

    return (
        <section>
            <div
                className="hero"
                key={item.id}
                style={{
                    // Use a fallback solid color or gradient so the UI isn't "wonky" while waiting
                    backgroundColor: "#111",
                    backgroundImage: currentBackdrop
                        ? `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), url("${currentBackdrop}")`
                        : `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    height: '80vh',
                    transition: "background-image 0.4s ease-in-out" // Smooth transition between quality steps
                }}
            >
                {/* Logo Image */}
                {item.logo_full_path && (
                    <img
                        src={item.logo_full_path}
                        alt={item.title || item.name}
                        className="content-logo"
                        style={{ maxWidth: '300px' }}
                    />
                )}

                <div className="small-details">
                    <p>⭐ {Math.round(item.vote_average * 10) / 10}</p>
                    <p>{(item.release_date || item.first_air_date || "").slice(0, 4)}</p>
                    <p>{genreData[item.media_type]?.[item.genre_ids[0]] || "Genre"}</p>
                    <p>{genreData[item.media_type]?.[item.genre_ids[1]] || "Action"}</p>
                </div>

                <h4 className="overview">{item.overview}</h4>

                <div className="action-buttons">
                    <button onClick={handlePlay}> ▶ PLAY </button>
                    <button> MORE DETAIL </button>
                </div>
            </div>
        </section>
    );
};

export default TopPick;