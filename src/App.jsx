import React from 'react';
import "./Css/prototype.css"
import ExplorePage from "./Pages/ExplorePage.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import NavBar from "./Components/NavBar.jsx";

const App = () => {
    return (
        <>
            <nav>
                <NavBar />
            </nav>
            <main>
                <ExplorePage />
            </main>
        </>
    )
}

export default App;