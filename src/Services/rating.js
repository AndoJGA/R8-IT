export const calculateShowRating = (scores, genres) => {
    const isComedy = genres.movie["35"] || genres.tv["35"];

    if (isComedy) {
        return (scores.Enjoyment * 0.2) +
            (scores.LOL * 0.4) +
            (scores.Visuals * 0.15) +
            (scores.delivery * 0.15) +
            (scores.pacing * 0.1);
    } else {
        return (scores.Enjoyment * 0.2) +
            (scores.story * 0.4) +
            (scores.Visuals * 0.15) +
            (scores.audio * 0.15) +
            (scores.pacing * 0.1);
    }
};