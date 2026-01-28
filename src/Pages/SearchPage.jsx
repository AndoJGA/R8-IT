import React, { useState, useEffect } from "react"; // Added useEffect
import { searchContent } from "../services/content.js";
import { IMAGE_BASE, IMAGE_SMALL_POSTER } from "../services/tmdbClient.js";
import {useNavigate} from "react-router-dom";

const SearchPage = () => {

    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [contentArray, setContentArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Initialized with empty string

    // 1. Create the search function
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setContentArray([]); // Clear results if input is empty
            return;
        }

        setLoading(true);
        try {
            const data = await searchContent(query);
            const filteredResults = data.results.filter(item =>
                (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
            );
            setContentArray(filteredResults);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. useEffect handles the 3-second delay (Debounce)
    useEffect(() => {
        // Set a timer to run the search after 3 seconds
        const delayInputTimeoutId = setTimeout(() => {
            handleSearch(searchTerm);
        }, 1000);

        // Cleanup function: This clears the timer if the user types again
        // before the 3 seconds are up, resetting the clock.
        return () => clearTimeout(delayInputTimeoutId);
    }, [searchTerm]); // Only runs when searchTerm changes

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDetails = (item) => {
        console.log("You clicked: " + (item.title || item.name));
        navigate(`/details/${item.id}`, {state: {content: item}});
    };

    return (
        <div>
            <header className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="search-input"
                    placeholder="Type to search..."
                />
                {/* Button removed as requested */}
            </header>

            <main>
                {loading && <p>Searching...</p>}

                <div className="search-results-container">
                    {!loading && contentArray.filter(content => content.vote_count > 10).map((item) => (
                        <button
                            onClick={() => handleDetails(item)}
                            key={item.id}
                            className="search-result-hero"
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

export default SearchPage;