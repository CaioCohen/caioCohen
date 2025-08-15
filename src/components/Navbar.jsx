import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./Navbar.scss";

// importa as logos
import logoWhite from "/src/assets/logoWhite.png";
import logoBlack from "/src/assets/logoBlack.png";

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
            <div className="logo-container">
                <img
                    src={theme === "dark" ? logoWhite : logoBlack}
                    alt="Logo"
                    className="logo-img"
                />
                <span className="logo-text">Caio Cohen</span>
            </div>

            <div className="nav-center">
                <ul className="nav-links">
                    <li><Link to="home" smooth duration={500}>Home</Link></li>
                    <li><Link to="portfolio" smooth duration={500}>Portfolio</Link></li>
                    <li><Link to="skills" smooth duration={500}>Skills</Link></li>
                    <li><Link to="contact" smooth duration={500}>Contact</Link></li>
                </ul>
            </div>

            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "dark" ? "🌙" : "☀️"}
            </button>
        </nav>
    );
}
