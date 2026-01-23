import React, { useEffect, useState } from "react"; // Added useEffect and useState to imports
import {useLocation, useNavigate, useParams} from "react-router-dom";

import { IMAGE_BASE } from "../services/tmdbClient.js";
import { getCredits, getRecommendations, getVideos } from "../Services/content.js";
import genreData from "../Services/genres.js";

const ContentDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [cast, setCast] = useState([]);
    const [loadingCast, setLoadingCast] = useState(true);
    const [activeTab, setActiveTab] = useState("OVERVIEW");
    const [videos, setVideos] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const content = location.state?.content;

    // Effect Hook to handle the asynchronous API call
    useEffect(() => {
        const fetchCastData = async () => {
            if (!content) return;

            try {
                // Determine media type (defaulting to 'movie' if media_type is missing)
                const type = content.media_type || (content.first_air_date ? "tv" : "movie");

                const data = await getCredits(type, id);

                // Store only the top 5 actors for the summary line
                setCast(data.cast || []);
            } catch (error) {
                console.error("Failed to fetch credits:", error);
            } finally {
                setLoadingCast(false);
            }
        };

        fetchCastData();
    }, [id, content]);

    useEffect(() => {
        const fetchExtraData = async () => {
            const type = content.media_type || (content.first_air_date ? "tv" : "movie");

            // Fetch both in parallel for better performance
            const [videoData, recData] = await Promise.all([
                getVideos(type, id),
                getRecommendations(type, id)
            ]);

            // Filter for only YouTube trailers
            const trailers = videoData.results.filter(v => v.type === "Trailer" && v.site === "YouTube");
            setVideos(trailers);
            setRecommendations(recData.results);
        };

        if (id) fetchExtraData();
    }, [id, content]);

    // Data Transformation: Extract names and format into a string
    const starringList = cast
        .slice(0, 5)
        .map(actor => actor.name)
        .join(", ");

    if (!content) return <h1>No data found for ID: {id}</h1>;


    const renderTabContent = () => {
        switch (activeTab) {
            case "OVERVIEW":
                return (
                    <>
                        <h3>{content.overview}</h3>
                        <p>staring:
                            <strong> {loadingCast ? "Loading Cast ..." : starringList || "N/A"}</strong>
                        </p>
                        <p>genre:
                            <strong> {genreData[content.media_type]?.[content.genre_ids[0]] || "Genre"}</strong>
                            <strong>, {genreData[content.media_type]?.[content.genre_ids[1]] || "Action"}</strong>
                        </p>
                    </>
                );
            case "TRAILERS":
                return (
                    <div className="trailers-placeholder">
                        {videos.length > 0 ? (
                            <iframe
                                width="80%"
                                height="350"
                                src={`https://www.youtube.com/embed/${videos[0].key}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <p>No trailers available.</p>
                        )}
                    </div>
                );
            case "MORE LIKE THIS":
                return (
                    <>
                        <h3>Recommended Content</h3>
                        <div className="recommendations">
                            {recommendations.slice(0, 10).map(rec => (
                                <img
                                    key={rec.id}
                                    src={IMAGE_BASE + rec.poster_path}
                                    alt={rec.title}
                                    onClick={() => navigate(`/details/${rec.id}`, { state: { content: rec } })}
                                />
                            ))}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };


    return (
        <div
            className="details-container"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6), rgba(0,0,0,1)), linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1)), url("${IMAGE_BASE + content.backdrop_path}")`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: '100%',
                height: '100vh',
            }}
        >
            <div className="poster-details">
                <img src={IMAGE_BASE + content.poster_path} alt=""/>
            </div>

            <div className="content-details">
                <section className="basic-details">
                    <section className="logo-side">
                        <img src={IMAGE_BASE + content.logo_full_path}
                             style={{
                                 maxWidth: '300px',
                             }}
                             alt=""/>
                        <div className="small-details">
                            <p>{(content.release_date||content.first_air_date).slice(0,4)}</p>
                            <p>|</p>
                        </div>
                    </section>
                    <section className="rating-side">
                        <h1>{(content.vote_average).toFixed(1)}⭐</h1>
                    </section>
                </section>

                <section className="basic-buttons">
                    <button onClick={() => setActiveTab("OVERVIEW")}>OVERVIEW</button>
                    <button onClick={() => setActiveTab("TRAILERS")}>TRAILERS</button>
                    <button onClick={() => setActiveTab("MORE LIKE THIS")}>MORE LIKE THIS</button>
                </section>

                <section className="overview-section">
                    {renderTabContent()}
                </section>

            </div>

        </div>
    );
}

export default ContentDetailPage;