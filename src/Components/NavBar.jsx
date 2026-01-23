import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className='navbar'>
            {/* NavLink automatically adds an "active" class when the URL matches */}
            <NavLink title="Home" to="/">
                <button>🛖</button>
            </NavLink>

            <NavLink title="Search" to="/search">
                <button>🔎</button>
            </NavLink>

            <NavLink title="Profile" to="/profile">
                <button>👤</button>
            </NavLink>
        </div>
    );
};

export default NavBar;