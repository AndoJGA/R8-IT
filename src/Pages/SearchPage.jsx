import React, {useState} from "react";

import { searchContent } from "../services/content.js";
import { IMAGE_BASE } from "../services/tmdbClient.js";

const SearchPage = () => {
    const [loading, setLoading] = useState(false);
    const [contentArray, setContentArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState()

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);

        try {
            const data = await searchContent(searchTerm);

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

    return (
        <>
            <header>
                <input type="text" value={searchTerm} onChange={handleInputChange} />
                <button onClick={handleSearch}>🔍</button>
            </header>

            <main>
                {loading && <p>Searching...</p>}

                <div className="search-results-container">
                    {!loading && contentArray.map((item) => (
                        <div
                            key={item.id}
                            className="search-result-hero"
                            style={{
                                // Your exact requested gradient and backdrop logic
                                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,1)), 
                                      linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6)),  
                                      url("${IMAGE_BASE + item.poster_path}")`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                height: '450px',
                                width: '300px',
                                margin: '10px',
                                borderRadius: '15px'
                            }}
                        >
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}

export default SearchPage;