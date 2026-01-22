import React, { useEffect, useState } from "react";

import { getTrending } from "../services/content.js";
import { getLogo } from "../services/images.js";
import { IMAGE_BASE } from "../services/tmdbClient.js";
import genreData from "../services/genres.js";
import {randomIndex} from "../services/randomNumber.js";
console.log("Random Number: ", randomIndex);

const TopPick = () => {
    const [loading, setLoading] = useState(true);
    const [contentArray, setContentArray] = useState([]);

    // Helper to pick a random item from the trending list
    useEffect(() => {
        const fetchTopContent = async () => {
            setLoading(true);
            try {
                // Use the movie service to get trending
                const data = await getTrending('all', 'week');

                const rawItem = data.results.slice(randomIndex - 1, randomIndex);

                // Use the image service to enrich with logos
                const enrichedItems = await Promise.all(rawItem.map(async (item) => {
                    const type = item.media_type || 'movie';
                    const logoUrl = await getLogo(type, item.id);
                    return { ...item, logo_full_path: logoUrl };
                }));

                setContentArray(enrichedItems);
            } catch (error) {
                console.error("Failed to load trending content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopContent();
    }, []); // Empty dependency array means this runs once on mount

    console.log("Random Number: ", randomIndex);


    const handlePlay = () => console.log("Playing content...");

    if (loading) return <div className="loader">Loading Trending Content...</div>;

    return (
        <section>
            {contentArray.map((item) => (
                <div
                    className="hero"
                    key={item.id}
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), url("${IMAGE_BASE + item.backdrop_path}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        height: '80vh',
                    }}
                >
                    {/* Use the full logo URL we built in the service */}
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
            ))}
        </section>
    );
};

export default TopPick;