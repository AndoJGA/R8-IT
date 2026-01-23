import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./Css/prototype.css"
import ExplorePage from "./Pages/ExplorePage.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";


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
    }
]);

export default function App () {
    return <RouterProvider router={router}/>
}
