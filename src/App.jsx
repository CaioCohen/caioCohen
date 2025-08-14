import React from "react";
import { Element } from "react-scroll";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Portfolio from "./components/Portfolio";

export default function App() {
  return (
    <>
      <Navbar />
      <Element name="home" className="section" style={{ background: "#222" }}>
        <Home />
      </Element>

      <Element name="portfolio" className="section" style={{ background: "#333" }}>
        <Portfolio />
      </Element>

      <Element name="about" className="section" style={{ background: "#444" }}>
        <h1>About Section</h1>
      </Element>

      <Element name="services" className="section" style={{ background: "#555" }}>
        <h1>Services Section</h1>
      </Element>

      <Element name="contact" className="section" style={{ background: "#666" }}>
        <h1>Contact Section</h1>
      </Element>
    </>
  );
}
