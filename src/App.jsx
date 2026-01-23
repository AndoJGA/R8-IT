import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./Css/prototype.css"
import ExplorePage from "./Pages/ExplorePage.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import ContentDetailPage from "./Pages/ContentDetailPage.jsx";
import NavBar from "./Components/NavBar.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <ExplorePage />,
    },
    {
        path: "/search",
        element: <SearchPage />,
    },{
        path: "/*",
        element: <NotFoundPage />
    },
    {
        path: "/details/:id",
        element: <ContentDetailPage />,
    },
]);

export default function App () {
    return(
        <>
            <nav>
                <NavBar />
                <RouterProvider router={router}/>
            </nav>
        </>
    )
}
