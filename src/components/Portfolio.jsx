import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./Portfolio.scss";
import data from "./Portfolio.json";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// imagens
const images = import.meta.glob("/src/assets/*", { eager: true, as: "url" });
const imageByName = Object.fromEntries(
  Object.entries(images).map(([p, url]) => [p.split("/").pop(), url])
);

export default function Portfolio() {
  const trackRef = useRef(null);
  const recenteringRef = useRef(false); // evita loop de onScroll
  const [openItem, setOpenItem] = useState(null);

  // triplica os itens
  const blocks = 3;
  const items = useMemo(() => Array.from({ length: blocks }, () => data).flat(), []);

  const getMetrics = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return { cardW: 320, gap: 20, blockW: 320 * data.length };

    const cardW = first.getBoundingClientRect().width;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

    // comprimento correto do bloco: N*card + (N-1)*gap
    const blockW = cardW * data.length + gap * Math.max(0, data.length - 1);
    return { cardW, gap, blockW };
  };

  const getCardFullWidth = () => {
    const { cardW, gap } = getMetrics();
    return cardW + gap; // usado para pular 1 card nas setas
  };

  const getBlockWidth = () => getMetrics().blockW;

  // inicia no bloco do meio
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = requestAnimationFrame(() => {
      const blockW = getBlockWidth();
      const prevBeh = track.style.scrollBehavior;
      track.style.scrollBehavior = "auto";
      track.scrollLeft = blockW; // início do bloco central
      track.style.scrollBehavior = prevBeh || "smooth";
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const keepInMiddle = () => {
    const track = trackRef.current;
    if (!track || recenteringRef.current) return;

    const blockW = getBlockWidth();
    const left = track.scrollLeft;

    // zona segura mais ampla: 0.25 e 1.75 blocos
    const leftThreshold = blockW * 0.25;
    const rightThreshold = blockW * 1.5;

    if (left < leftThreshold || left > rightThreshold) {
      recenteringRef.current = true;

      const prevBeh = track.style.scrollBehavior;
      const prevSnap = track.style.scrollSnapType;

      // desliga animação e snap para realinhar sem o browser interferir
      track.style.scrollBehavior = "auto";
      track.style.scrollSnapType = "none";
      track.scrollLeft = left < leftThreshold ? left + blockW : left - blockW;

      // aplica no próximo frame e restaura estados
      requestAnimationFrame(() => {
        track.style.scrollBehavior = prevBeh || "smooth";
        track.style.scrollSnapType = prevSnap || "x mandatory";
        recenteringRef.current = false;
      });
    }
  };

  const scrollByItem = async (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const delta = getCardFullWidth() * direction;

    // desliga snap, faz scroll suave, espera terminar e recentra
    const prevSnap = track.style.scrollSnapType;
    track.style.scrollSnapType = "none";
    track.scrollBy({ left: delta, behavior: "smooth" });

    //await sleep(50); // dá tempo para a animação terminar
    keepInMiddle();
    track.style.scrollSnapType = prevSnap || "x mandatory";
  };

  // Modal
  const openModal = useCallback((item) => setOpenItem(item), []);
  const closeModal = useCallback(() => setOpenItem(null), []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeModal();
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

      {openItem && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${openItem.Title} details`}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">✕</button>

            <div className="modal-header">
              <img src={imageByName[openItem.Image]} alt={openItem.Title} className="modal-cover" />
              <h3 className="modal-title">{openItem.Title}</h3>
            </div>

            {openItem.Description && (
              <div className="modal-body">
                {openItem.Description.split("\n").map((line, i) => <p key={i}>{line}</p>)}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
