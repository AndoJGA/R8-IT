import React from "react";
import {Link} from "react-router-dom";

const NotFoundPage = () => {
    return (
        <>
            <h1>You went off base go back to a safe place</h1>
            <Link to="/">
                <button>Go Home</button>
            </Link>
        </>
    )
}

export default NotFoundPage;