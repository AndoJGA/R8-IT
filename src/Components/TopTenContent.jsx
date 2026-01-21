import React, { useEffect, useState } from "react";
import genreData from "../genres.js";

const TopTenContent = () => {
    const endpoint = "https://api.themoviedb.org/3/trending/all/week";
    const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
    const imageBaseUrl = "https://image.tmdb.org/t/p/original";


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const myNumber = getRandomInt(1, 20);
    console.log(myNumber);





    const [loading, setLoading] = useState(false);
    const [contentArray, setContentArray] = useState([]);


    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                const url = `${endpoint}?api_key=${tmdbApiKey}`;
                const response = await fetch(url);
                const data = await response.json();

                // 1. Capture the items in a local variable first
                // Changed slice(2,3) to (0,10) to actually get 10 items
                const rawItems = data.results.slice(myNumber-1, myNumber);

                // 2. Use that local variable to fetch additional details
                const enrichedItems = await Promise.all(rawItems.map(async (item) => {
                    const type = item.media_type || 'movie';
                    const imageRes = await fetch(`https://api.themoviedb.org/3/${type}/${item.id}/images?api_key=${tmdbApiKey}`);
                    const imageData = await imageRes.json();

                    const englishLogo = imageData.logos?.find(logo => logo.iso_639_1 === 'en');

                    const logoPath = englishLogo?.file_path || imageData.logos?.[0]?.file_path || null;

                    return { ...item, logo_path: logoPath };
                }));

                // 3. Update the state once with the final enriched data
                setContentArray(enrichedItems);
            } catch (error) {
                console.error("Oops:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [tmdbApiKey]); // Added api key as dependency for safety


    const Play = () => {
        console.log("playing content");
    }



    return (
        <div>
            {loading && <p>Loading the Trending top 10....</p>}

            {!loading && contentArray.map((item) => (
                <div
                    className="top-ten-content"
                    key={item.id}
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,1)), linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6)),  url("${imageBaseUrl + item.backdrop_path}")`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        height: '80vh',
                    }}
                >
                    {item.logo_path && (
                        <img
                            src={"https://image.tmdb.org/t/p/original" + item.logo_path}
                            alt={item.title || item.name}
                            style={{ maxWidth: '300px' }} // Prevents massive logos
                        />
                    )}

                    <div className="small-details">
                        <p>{"⭐ " + Math.round((item.vote_average*10))/10}</p>
                        <p>{(item.release_date || item.first_air_date || "").slice(0, 4)}</p>
                        <p>
                            {genreData[item.media_type]?.[item.genre_ids[0]] || "Genre"}
                        </p>
                        <p>
                            {genreData[item.media_type]?.[item.genre_ids[1]] || "Action"}
                        </p>
                    </div>

                    <h4>{item.overview}</h4>

                    <div className="action-buttons">
                        <button onClick={Play}> ▶ PLAY </button>
                        <button> MORE DETAIL </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopTenContent;