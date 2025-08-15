import React from "react";
import "./Home.scss";
import minhaFoto from "../assets/CaioCohen.jpg";

export default function Home() {
  return (
    <section id="home" className="home-section">
      <div className="home-image">
        <img src={minhaFoto} alt="Caio Cohen" />
      </div>
      <div className="home-text">
        <h1>Caio Cohen</h1>
        <h2>Software Engineer | Angular, React Expert</h2>
        <p>
        Senior Software Engineer with a Bachelor's degree in Computer Science and 5+ years of experience building scalable web applications using Angular, React, Node.js, and cloud platforms like Azure and Firebase. Skilled in designing performant architectures, leading codebase refactoring efforts, and mentoring junior developers in agile teams. Known for delivering high-quality, maintainable solutions across the full stack. Currently, seeking remote opportunities with international companies to contribute technical expertise and drive impactful software development. 
        </p>
      </div>
    </section>
  );
}
