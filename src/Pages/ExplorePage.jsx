import React, { useEffect, useState } from "react";
import TopPick from "../Components/TopPick.jsx";

import { getTrending } from "../services/content.js";
import { getLogo } from "../services/images.js";
import { IMAGE_BASE } from "../services/tmdbClient.js";
import genreData from "../services/genres.js";
import {randomIndex} from "../services/randomNumber.js";

const ExplorePage = () => {
    const [loading, setLoading] = useState(false);
    const [contentArray, setContentArray] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
        setLoading(true);
        try {
            const data = await getTrending('all', 'day');
            const rawItems = data.results.slice(randomIndex).concat(data.results.slice(0, randomIndex));


            setContentArray(rawItems);
        } catch (error) {
            console.error("Oops:", error);
        } finally {
            setLoading(false);
        }
    };

        fetchTrending();
    }, []);

    if (loading) return <div className="loader">Loading Trending Content...</div>;

    return (
        <div>
            <header>
                <TopPick/>
            </header>
            <main>
                <div className="trending">
                    <h1>Trending Content</h1>
                    <ul className="trending-list">
                        {!loading && contentArray.map((item) => (
                            <li key={item.id}> {/* Adding the key here fixes the warning */}
                                <button
                                    onClick={() => {console.log("You clicked: " + (item.title||item.name)) }}
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,1)), linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6)),  url("${IMAGE_BASE + item.poster_path}")`,
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
                <div className="other-content">

                </div>
            </main>
        </div>
    )
}

export default ExplorePage;