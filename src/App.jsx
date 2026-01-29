// App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./Css/prototype.css"

import HomePage from "./Pages/HomePage.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import ContentDetailPage from "./Pages/ContentDetailPage.jsx";
import TopPick from "./Components/TopPick.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import NavBar from "./Components/NavBar.jsx";
import RatingsPage from "./Pages/RatingsPage.jsx";


const Layout = () => (
    <>
        <NavBar />
        <main>
            <Outlet /> {/* This is where the pages (Explore, Search, etc.) will render */}
        </main>
    </>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, // Wrap everything in the Layout
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/search", element: <SearchPage /> },
            { path: "/details/:id", element: <ContentDetailPage /> },
            { path: "/profile", element: <TopPick /> },
            { path: "/ratings/:id", element: <RatingsPage /> },
            { path: "*", element: <NotFoundPage /> },
        ]
    },
]);

export default function App () {
    return <RouterProvider router={router} />;
}