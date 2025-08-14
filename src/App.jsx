import React from "react";
import { Element } from "react-scroll";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Portfolio from "./components/Portfolio";
import Skills from "./components/Skills";
import Contact from "./components/Contact";

export default function App() {
  return (
    <>
      <Navbar />
      <Element name="home" className="section">
        <Home />
      </Element>

      <Element name="portfolio" className="section">
        <Portfolio />
      </Element>

      <Element name="skills" className="section">
        <Skills />
      </Element>

      <Element name="contact" className="section">
        <Contact />
      </Element>
    </>
  );
}
