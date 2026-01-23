import React, { useEffect, useState } from "react";
import TopPick from "../Components/TopPick.jsx";
import { getTrending } from "../services/content.js";
import { IMAGE_BASE } from "../services/tmdbClient.js";
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
            <main>
                <div className="trending">
                    <h1>Trending Content</h1>
                    <ul className="trending-list">
                        {contentArray.map((item) => (
                            <li key={item.id}>
                                <button
                                    className="movie-cards"
                                    // 3. Pass the specific item to the function
                                    onClick={() => handleDetails(item)}
                                    // 4. Style must be INSIDE the tag
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,1)), linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6)), url("${IMAGE_BASE + item.poster_path}")`,
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        height: '450px',
                                        width: '300px',
                                        borderRadius: '10px'
                                    }}
                                ></button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default ExplorePage;
