import React, { useEffect, useState } from "react";
import TopPick from "../Components/TopPick.jsx";
import { getTrending } from "../services/content.js";
import {IMAGE_BASE, IMAGE_SMALL_POSTER} from "../services/tmdbClient.js";
import { randomIndex } from "../services/randomNumber.js";
import { useNavigate } from "react-router-dom";
import {getLogo} from "../Services/images.js"; // Use useNavigate, not useNavigation

const ExplorePage = () => {
    const [loading, setLoading] = useState(false);
    const [contentArray, setContentArray] = useState([]);

    // 1. Call the hook at the top level
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                const data = await getTrending('all', 'day');
                const rawItems = data.results.slice(randomIndex).concat(data.results.slice(0, randomIndex));

                const enrichedItems = await Promise.all(rawItems.map(async (item) => {
                    const type = item.media_type || 'movie';
                    const logoUrl = await getLogo(type, item.id);
                    return { ...item, logo_full_path: logoUrl };
                }));

                setContentArray(enrichedItems);
            } catch (error) {
                console.error("Oops:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    // 2. Logic to handle navigation
    const handleDetails = (item) => {
        console.log("You clicked: " + (item.title || item.name));
        navigate(`/details/${item.id}`, {state: {content: item}});
    };

    if (loading) return <div className="loader">Loading Trending Content...</div>;

    return (
        <div>
            <header><TopPick /></header>
            <main className="trending-container">
                <h1>Trending Content</h1>
                <div className="trending">
                    {!loading && contentArray.filter(content => content.vote_count > 10).map((item) => (
                        <button
                            onClick={() => handleDetails(item)}
                            key={item.id}
                            className="trending-content"
                            style={{
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,1)), 
                                      linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6)),  
                                      url("${IMAGE_SMALL_POSTER + item.poster_path}")`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                            }}
                        >
                            <span className="button-text">
                                <h3>
                                {(item.name || item.title).length > 10
                                    ? (item.name || item.title).slice(0, 10) + " ..."
                                    : (item.name || item.title)}
                                </h3>
                                <p>{item.name ? "Tv Show" : "Movie"}</p>
                                <p>{item.vote_average.toFixed(1)} ({item.vote_count.toLocaleString()})</p>
                            </span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ExplorePage;
