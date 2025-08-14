import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./Portfolio.scss";
import data from "./Portfolio.json";

// Mapeia imagens de /src/assets
const images = import.meta.glob("/src/assets/*", { eager: true, as: "url" });
const imageByName = Object.fromEntries(
  Object.entries(images).map(([path, url]) => [path.split("/").pop(), url])
);

export default function Portfolio() {
  const trackRef = useRef(null);
  const [openItem, setOpenItem] = useState(null); // item selecionado para o modal

  // triplica os itens para looping
  const blocks = 3;
  const items = useMemo(() => Array.from({ length: blocks }, () => data).flat(), []);

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const id = requestAnimationFrame(() => {
      const blockW = getBlockWidth();
      track.scrollLeft = blockW; // meio
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const keepInMiddle = () => {
    const track = trackRef.current;
    if (!track) return;
    const blockW = getBlockWidth();
    const left = track.scrollLeft;
    const leftThreshold = blockW * 0.5;
    const rightThreshold = blockW * 1.5;
    if (left < leftThreshold || left > rightThreshold) {
      const prev = track.style.scrollBehavior;
      track.style.scrollBehavior = "auto";
      if (left < leftThreshold) track.scrollLeft = left + blockW;
      else if (left > rightThreshold) track.scrollLeft = left - blockW;
      track.style.scrollBehavior = prev || "smooth";
    }
  };

  const scrollByItem = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const delta = getCardFullWidth() * direction;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Modal controls
  const openModal = useCallback((item) => setOpenItem(item), []);
  const closeModal = useCallback(() => setOpenItem(null), []);

  // Fecha com Esc e trava scroll de fundo
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    if (openItem) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openItem, closeModal]);

  return (
    <section className="portfolio-section">
      <h2 className="portfolio-title">Latest Works</h2>

      <div className="portfolio-track" ref={trackRef} onScroll={keepInMiddle}>
        {items.map((item, idx) => (
          <article
            key={`${item.Title}-${idx}`}
            className="portfolio-card"
            role="button"
            tabIndex={0}
            onClick={() => openModal(item)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openModal(item)}
            aria-label={`Open details for ${item.Title}`}
          >
            <div className="media">
              <img src={imageByName[item.Image]} alt={item.Title} loading="lazy" />
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

      {/* Modal */}
      {openItem && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${openItem.Title} details`}
          onClick={(e) => {
            // fecha ao clicar fora do conteúdo
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">✕</button>

            <div className="modal-header">
              <img
                src={imageByName[openItem.Image]}
                alt={openItem.Title}
                className="modal-cover"
              />
              <h3 className="modal-title">{openItem.Title}</h3>
            </div>

            {openItem.Description && (
              <div className="modal-body">
                {/* preserva quebras de linha do JSON */}
                {openItem.Description.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
