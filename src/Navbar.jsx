import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1 className="nav-title">Rail Reservation</h1>
                {isAuthenticated ? (
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <button onClick={logout} className="nav-btn">Logout</button>
                    </div>
                ) : (
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
