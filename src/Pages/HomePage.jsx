import React from "react";
import TopPick from "../Components/TopPick.jsx";
import MoreContent from "../Components/MoreContent.jsx"; // Use useNavigate, not useNavigation

const HomePage = () => {

    return (
        <div>
            <TopPick />
            <MoreContent />
        </div>
    );
};

export default HomePage;
