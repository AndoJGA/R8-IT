// App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./Css/prototype.css"

import ExplorePage from "./Pages/ExplorePage.jsx";
import SearchPage from "./Pages/SearchPage.jsx";
import ContentDetailPage from "./Pages/ContentDetailPage.jsx";
import TopPick from "./Components/TopPick.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import NavBar from "./Components/NavBar.jsx";


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
            { path: "/", element: <ExplorePage /> },
            { path: "/search", element: <SearchPage /> },
            { path: "/details/:id", element: <ContentDetailPage /> },
            { path: "/profile", element: <TopPick /> }, // Added this for your profile button
            { path: "*", element: <NotFoundPage /> },
        ]
    },
]);

export default function App () {
    return <RouterProvider router={router} />;
}