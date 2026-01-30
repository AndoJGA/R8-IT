import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getCredits, getSeasonDetails, getContentDetails } from "../Services/content.js";
import genreData from "../Services/genres.js";
import { IMAGE_BASE } from "../Services/tmdbClient.js";
import "../Css/content-detail-section.css";

const ContentDetailSection = () => {
    const { id } = useParams();
    const location = useLocation();

    // 1. State Management
    const [fullDetails, setFullDetails] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [loadingCast, setLoadingCast] = useState(true);

    // Initial content passed from previous page (poster, name, etc.)
    const content = location.state?.content;

    // Detect Media Type
    const isTvShow = content?.media_type === "tv" || !!content?.first_air_date;
    const mediaType = isTvShow ? "tv" : "movie";

    // 2. Fetch Full Details (To get Seasons, Runtime, etc.)
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch basic details, cast, and (if TV) the first season episodes simultaneously
                const [detailsData, creditsData] = await Promise.all([
                    getContentDetails(mediaType, id),
                    getCredits(mediaType, id)
                ]);

                setFullDetails(detailsData);
                setCast(creditsData.cast || []);
            } catch (error) {
                console.error("Error fetching content data:", error);
            } finally {
                setLoading(false);
                setLoadingCast(false);
            }
        };

        fetchAllData();
    }, [id, mediaType]);

    if (loading && !content) return <div className="loader">Loading R8-It Vault...</div>;

    // We prefer fullDetails but fallback to 'content' if it's not loaded yet
    const displayData = fullDetails || content;

    if (!displayData) return <h1 className="error-msg">No data found for ID: {id}</h1>;

    return (
        <div className="extra-content-info">
            <div className="both-content">
                <h2>Explore {displayData.title || displayData.name}</h2>

                {/* ACTORS SECTION */}
                <div className="actors-details">
                    <h3>Starring</h3>
                    <div className="actors">
                        {loadingCast ? (
                            <p className="loading-text">Loading Cast...</p>
                        ) : (
                            cast.filter(actor => actor.profile_path !== null)
                                .slice(0, 16)
                                .map((actor) => (
                                    <div key={actor.id} className="actor-card glass-panel">
                                        <img
                                            src={IMAGE_BASE + actor.profile_path}
                                            alt={actor.name}
                                            className="actor-img"
                                        />
                                        <div className="actor-info">
                                            <p className="actual-name">
                                                {actor.name.length > 14 ? actor.name.slice(0, 12) + "..." : actor.name}
                                            </p>
                                            <p className="character-name">
                                                {actor.character.length > 14 ? actor.character.slice(0, 12) + "..." : actor.character}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* METADATA SECTION */}
                <div className="new-details">
                    <div className="detail">
                        <h3>Content Type</h3>
                        <p>{mediaType.toUpperCase()}</p>
                    </div>
                    <div className="detail">
                        <h3>Language</h3>
                        <p>{displayData.original_language?.toUpperCase()}</p>
                    </div>
                    <div className="detail">
                        <h3>{isTvShow ? "Seasons" : "Runtime"}</h3>
                        <p>
                            {isTvShow
                                ? displayData.number_of_seasons || "N/A"
                                : `${displayData.runtime || "0"} MIN`}
                        </p>
                    </div>
                </div>

                {/* SEASONS SECTION (TV ONLY) */}
                {isTvShow && displayData.seasons && (
                    <div className="tv-shows">
                        <h2>SEASONS</h2>
                        <div className="season-selector">
                            {displayData.seasons
                                .filter(s => s.season_number > 0)
                                .map((s) => (
                                    <div
                                        key={s.id}
                                        className={`season-card ${selectedSeason === s.season_number ? 'active' : ''}`}
                                        onClick={() => setSelectedSeason(s.season_number)}
                                    >
                                        <img src={IMAGE_BASE + s.poster_path} alt=""/>
                                        <div className="season-detail">
                                            <strong>Season {s.season_number}</strong>
                                            <p className="synopsis"><strong>SYNOPSIS </strong>{s.overview.length > 200 ? s.overview.slice(0,200) + " ..." : s.overview}</p>
                                            <div className="small-detail">
                                                <p><strong>Released </strong>   {s.air_date.slice(0,4)}</p>
                                                <p><strong>Episode </strong> {s.episode_count}</p>
                                                <p>⭐ {s.vote_average}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

            </div>


        </div>
    );
};

export default ContentDetailSection;