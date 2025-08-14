import React from "react";
import "./Skills.scss";
import skills from "./Skills.json";

// carrega imagens por nome a partir de /src/assets
const assets = import.meta.glob("/src/assets/*", { eager: true, as: "url" });
const byName = Object.fromEntries(
  Object.entries(assets).map(([path, url]) => [path.split("/").pop(), url])
);

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <h2 className="skills-title">Proficiency on the following tools and stacks...</h2>

      <ul className="skills-grid" role="list">
        {skills.map((s) => (
          <li key={s.Title} className="skill-pin" data-title={s.Title}>
            <img src={byName[s.Image]} alt={s.Title} loading="lazy" />
          </li>
        ))}
      </ul>
    </section>
  );
}
