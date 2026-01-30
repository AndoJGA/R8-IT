import React, { useEffect } from "react"; // Added useEffect and useState to imports
import {useLocation, useParams} from "react-router-dom";

import {IMAGE_BASE} from "../services/tmdbClient.js";
import genreData from "../Services/genres.js";
import "../Css/contnt-detail-hero-section.css"

const ContentDetailHeroSection = () => {
    const { id } = useParams();
    const location = useLocation();


    const content = location.state?.content;

    // Effect Hook to handle the asynchronous API call
    useEffect(() => {
        const fetchCastData = async () => {
            if (!content) return;

            try {
                // Determine media type (defaulting to 'movie' if media_type is missing)
                const type = content.media_type || (content.first_air_date ? "tv" : "movie");
            } catch (error) {
                console.error("Failed to fetch credits:", error);
            }
        };

        fetchCastData();
    }, [id, content]);

    return (
        <div
            className="details-container"
            style={{
                backgroundImage: `url("${IMAGE_BASE + content.backdrop_path}")`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <div className="details">
                <div className="content-details">
                    <section className="basics">
                        <img className="content-logo" src={IMAGE_BASE + content.logo_full_path} alt=""/>
                        <div className="rating">
                            <p>⭐</p>
                            <div className="rating-detail">
                                <h4>{(content.vote_average).toFixed(1)} / 10</h4>
                                <h6>{content.vote_count?.toLocaleString()}</h6>
                            </div>
                        </div>
                    </section>
                    <section className="basic-details">
                        <div className="overview hover">
                            <h3>Synopsis</h3>
                            <p>{content.overview}</p>
                        </div>
                        <div className="genre-details hover">
                            <h3>Genre</h3>
                            <p> {genreData[content.media_type]?.[content.genre_ids[0]].length > 15 ?
                                genreData[content.media_type]?.[content.genre_ids[0]] :
                                genreData[content.media_type]?.[content.genre_ids[0]]+", "+ genreData[content.media_type]?.[content.genre_ids[1]] }
                                </p>
                        </div>
                        <div className="release-detail hover">
                            <h3>Release Date</h3>
                            <p>{(content.release_date||content.first_air_date).slice(0,4)}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default ContentDetailHeroSection;