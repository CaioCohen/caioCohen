import React, { useEffect, useMemo, useRef } from "react";
import "./Portfolio.scss";
import data from "./Portfolio.json";

// Mapeia imagens de /src/assets
const images = import.meta.glob("/src/assets/*", { eager: true, as: "url" });
const imageByName = Object.fromEntries(
  Object.entries(images).map(([path, url]) => [path.split("/").pop(), url])
);

export default function Portfolio() {
  const trackRef = useRef(null);

  // Duplicamos os itens em 3 blocos: [A][A][A]
  const blocks = 3;
  const items = useMemo(() => Array.from({ length: blocks }, () => data).flat(), []);

  // Util para descobrir a largura de um card + gap
  const getCardFullWidth = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return 320;
    const cardW = first.getBoundingClientRect().width;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "20") || 20;
    return cardW + gap;
  };

  const getBlockWidth = () => getCardFullWidth() * data.length;

  // Começa posicionado no bloco do meio
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Após próximo frame para garantir layout estável
    const id = requestAnimationFrame(() => {
      const blockW = getBlockWidth();
      track.scrollLeft = blockW; // meio
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Reposiciona de forma imperceptível quando encostar nas bordas
  const keepInMiddle = () => {
    const track = trackRef.current;
    if (!track) return;

    const blockW = getBlockWidth();
    const left = track.scrollLeft;

    // zonas de segurança: se foi muito para esquerda, empurra +1 bloco
    // se foi muito para direita, puxa -1 bloco
    const leftThreshold = blockW * 0.5;
    const rightThreshold = blockW * 1.5;

    if (left < leftThreshold || left > rightThreshold) {
      const prev = track.style.scrollBehavior;
      track.style.scrollBehavior = "auto";
      if (left < leftThreshold) {
        track.scrollLeft = left + blockW;
      } else if (left > rightThreshold) {
        track.scrollLeft = left - blockW;
      }
      track.style.scrollBehavior = prev || "smooth";
    }
  };

  const scrollByItem = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const delta = getCardFullWidth() * direction;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="portfolio-section">
      <h2 className="portfolio-title">Latest Works</h2>

      <div className="portfolio-track" ref={trackRef} onScroll={keepInMiddle}>
        {items.map((item, idx) => (
          <article key={`${item.Title}-${idx}`} className="portfolio-card">
            <div className="media">
              <img
                src={imageByName[item.Image]}
                alt={item.Title}
                loading="lazy"
              />
              <div className="overlay">
                <h3 className="card-title">{item.Title}</h3>
                <p className="card-summary">{item.Summary}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="portfolio-nav">
        <button onClick={() => scrollByItem(-1)} aria-label="Scroll left">◀</button>
        <button onClick={() => scrollByItem(1)} aria-label="Scroll right">▶</button>
      </div>
    </section>
  );
}
