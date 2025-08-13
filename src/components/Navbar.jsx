import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./Navbar.scss";

export default function Navbar() {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.add("light-theme");
        } else {
            document.documentElement.classList.remove("light-theme");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <nav className="navbar">
            <div className="logo">Caio Cohen</div>

            <div className="nav-center">
                <ul className="nav-links">
                    <li><Link to="home" smooth duration={500}>Home</Link></li>
                    <li><Link to="portfolio" smooth duration={500}>Portfolio</Link></li>
                    <li><Link to="about" smooth duration={500}>About</Link></li>
                    <li><Link to="services" smooth duration={500}>Services</Link></li>
                    <li><Link to="contact" smooth duration={500}>Contact</Link></li>
                </ul>
            </div>

            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "dark" ? "🌙" : "☀️"}
            </button>
        </nav>
    );
}
