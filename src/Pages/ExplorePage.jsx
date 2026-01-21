import React, {useEffect, useState} from 'react';
import TopTenContent from "../Components/TopTenContent.jsx";


const ExplorePage = () => {
    const trending_endpoint = "https://api.themoviedb.org/3/trending/all/day";
    const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY;
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

    const [loading, setLoading] = useState(false);
    const [contentArray, setContentArray] = useState([]);


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const myNumber = getRandomInt(1, 20);
    console.log(myNumber);



    useEffect(() => {const fetchTrending = async () => {
        setLoading(true);
        try {
            const url = `${trending_endpoint}?api_key=${tmdbApiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            const rawItems = data.results.slice(myNumber).concat(data.results.slice(0, myNumber));

            setContentArray(rawItems);
        } catch (error) {
            console.error("Oops:", error);
        } finally {
            setLoading(false);
        }
    };

        fetchTrending();
    }, [tmdbApiKey]);

    return (
        <div>
            <header>
                <TopTenContent/>
            </header>
            <main>
                <div className="trending">
                    {loading && <p>Loading the Trending top 10....</p>}
                    <ul>
                        {!loading && contentArray.map((item) => (
                            <li>
                                <div
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2), rgba(0,0,0,1)), linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.6)),  url("${imageBaseUrl + item.poster_path}")`,
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        height: '450px',
                                        width: '300px',
                                    }}
                                ></div>
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