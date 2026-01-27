import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IMAGE_BASE, IMAGE_SMALL_POSTER } from "../Services/tmdbClient.js";
import { getTVDetails } from "../Services/content.js";

const Ratings = () => {
    const location = useLocation();
    const content = location.state?.content;
    const [extraDetails, setExtraDetails] = useState(null);

    useEffect(() => {
        const isTV = content?.media_type === 'tv' || content?.first_air_date;
        if (content?.id && isTV) {
            getTVDetails(content.id)
                .then(data => setExtraDetails(data))
                .catch(err => console.error("Failed to fetch TV details", err));
        }
    }, [content]);

    const getRatingData = (rating) => {
        // Handle null or undefined ratings passed into the function
        const val = rating || 0;
        if (val >= 9.5) return { label: "AWESOME", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.8)" };
        if (val >= 8.5) return { label: "GREAT", color: "#22c55e", bg: "rgba(34, 197, 94, 0.8)" };
        if (val >= 6.5) return { label: "GOOD", color: "#eab308", bg: "rgba(234, 179, 8, 0.8)" };
        if (val >= 5) return { label: "REGULAR", color: "#f97316", bg: "rgba(249, 115, 22, 0.8)" };
        if (val >= 3.5) return { label: "BAD", color: "#ef4444", bg: "rgba(239, 68, 68, 0.8)" };
        return { label: "GARBAGE", color: "#a855f7", bg: "rgba(168, 85, 247, 0.8)" };
    };

    if (!content) return <div className="loader">No Content Selected</div>;

    const currentRating = getRatingData(content?.vote_average);

    return (
        <div className="ratings-container"
             style={{
                 backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,1)),
                                   linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,1)),
                                   url("${IMAGE_BASE + content?.backdrop_path}")`,
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'cover',
                 width: '100%',
                 height: '100vh',
             }}
        >
            <div className="ratings-small-details">
                <img src={IMAGE_SMALL_POSTER + content?.poster_path} alt=""/>
                {/* FIXED: Added ?. before toFixed to prevent crash if vote_average is missing */}
                <h4>⭐ {content?.vote_average?.toFixed(1) || "0.0"} <strong>({content?.vote_count?.toLocaleString() || 0})</strong></h4>
                <h2>{content?.title || content?.name}</h2>

                <div className="date-details">
                    <p>{(content?.release_date || content?.first_air_date)?.slice(0, 4)}</p>
                    {/* FIXED: Safe access to extraDetails */}
                    <p>{extraDetails?.last_air_date ? `-${extraDetails.last_air_date.slice(0, 4)}` : ""}</p>
                </div>
                <button>Add To Watchlist</button>
                <button>Rate</button>
            </div>

            <div className="rating-details">
                <div className="helpers">
                    <h5 style={{color: "#3b82f6"}}>🟦 AWESOME</h5>
                    <h5 style={{color: "#22c55e"}}>🟩 GREAT</h5>
                    <h5 style={{color: "#eab308"}}>🟨 GOOD</h5>
                    <h5 style={{color: "#f97316"}}>🟧 REGULAR</h5>
                    <h5 style={{color: "#ef4444"}}>🟥 BAD</h5>
                    <h5 style={{color: "#a855f7"}}>🟪 GARBAGE</h5>
                </div>

                <div className="seasons-container">
                    <div className="seasons-list">
                        {extraDetails?.seasons?.filter(s => s.season_number > 0).map((season) => {
                            const sRating = getRatingData(season.vote_average);
                            return (
                                <button key={season.id} className="season"
                                        style={{
                                            backgroundColor: sRating.bg,
                                            border: `2px solid ${sRating.color}`,
                                        }}
                                >
                                    {/* FIXED: Added ?. before slice to prevent crash if name is missing */}
                                    <p>S {season.name?.slice(-2)}</p>
                                    <small>E {season.episode_count}</small>
                                    <strong>⭐ {season.vote_average || "N/A"}</strong>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ratings;