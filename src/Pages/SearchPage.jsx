import React, {useState} from "react";

const SearchPage = () => {
    const searchEndpoint = "https://api.themoviedb.org/3/search/multi";
    const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

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
            const searchUrl = `${searchEndpoint}?api_key=${tmdbApiKey}&query=${searchTerm}`;
            const response = await fetch(searchUrl);
            const data = await response.json();

            // 1. Filter out results that aren't Movies or TV shows (TMDB search can return 'person')
            // 2. Filter out results that don't have a poster_path or backdrop_path
            const filteredResults = data.results.filter(item =>
                (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
            );

            // 3. (Optional) You can do the Logo Fetching here too if you want search results to have logos!
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
                                      url("${imageBaseUrl + item.poster_path}")`,
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