import React from 'react';
import { NavLink } from 'react-router-dom';
import "../Css/nav.css"

const NavBar = () => {
    return (
        <div className='navbar'>
            <div className="logo">
                <NavLink title="Home" to="/">
                    LOGO
                </NavLink>
            </div>

            <div className="content-type">
                <button className="active">Content</button>
                <button>Movie</button>
                <button>Shows</button>
                <button>🔍</button>
            </div>
            <div className="navs">
                {/* NavLink automatically adds an "active" class when the URL matches */}
                <NavLink title="download" to="/">
                    <h3>⬇️</h3>
                </NavLink>

                <NavLink title="calendar" to="/search">
                    <h3>📅</h3>
                </NavLink>

                <NavLink title="profile" to="/profile">
                    <h3>👤</h3>
                </NavLink>
            </div>
        </div>
    );
};

export default NavBar;