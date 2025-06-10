import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import CatGalleryModal from "../../components/CatGalleryModal/CatGalleryModal";
import "./Shows.scss";

/**
 * Shows.jsx – сторінка «SHOWS» з горизонтальними картками + готова модалка
 * CatGalleryModal (Swiper усередині) для перегляду фотографій події.
 * ---------------------------------------------------------------------------
 * ▸ Fetch /api/events  →  картки (фото ліворуч, дані праворуч).
 * ▸ «See more photos» відкриває <CatGalleryModal images={...} />.
 * ▸ images = event.gallery (массив імен файлів)  ||  [event.mainImage].
 * ▸ Шлях до кожного файлу: `${API_BASE}/uploads/${filename}`.
 */
export default function Shows() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ───────── modal state ──────────────────────────────────────────────────
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL ?? ""; // .env або proxy

  /* ───────── fetch events ─────────────────────────────────────────────── */
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        const type = res.headers.get("content-type") || "";
        if (!type.includes("application/json")) {
          throw new Error("Expected JSON – перевірте API або proxy");
        }
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        // Від нижчих до вищих карток
        data.sort((a, b) => (a.height ?? 0) - (b.height ?? 0));

        if (!ignore) setEvents(data);
      } catch (err) {
        if (!ignore) setError(err.message || String(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [API_BASE]);

  /* ───────── helpers ──────────────────────────────────────────────────── */
  function openGallery(event) {
    const imgs = event.gallery?.length ? event.gallery : [event.mainImage];
    const fullSrcs = imgs.map((img) => `${API_BASE}/uploads/${img}`);
    setGalleryImages(fullSrcs);
    setGalleryOpen(true);
  }

  function closeGallery() {
    setGalleryOpen(false);
    setGalleryImages([]);
  }

  /* ───────── render ───────────────────────────────────────────────────── */
  return (
    <div className="shows-page">
      <Header />

      <section className="container">
        <h1>SHOWS</h1>

        {loading && <p className="state">Loading…</p>}
        {error && <pre className="state error">⚠️ {error}</pre>}

        {!loading && !error && (
          <div className="events-grid">
            {events.map((e) => (
              <article className="event-card" key={e._id || e.id}>
                {/* фото */}
                <div className="event-card__img-wrapper">
                  <img
                    src={`${API_BASE}/uploads/${e.mainImage}`}
                    alt={e.title}
                    loading="lazy"
                  />
                </div>

                {/* дані */}
                <div className="event-card__body">
                  <div className="event-card__row">
                    <span className="label">Title:</span>
                    <span>{e.title}</span>
                  </div>
                  <div className="event-card__row">
                    <span className="label">Date:</span>
                    <span>
                      {e.date ? new Date(e.date).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  <div className="event-card__row">
                    <span className="label">Description:</span>
                    <span>{e.description || "—"}</span>
                  </div>

                  <button className="btn-more" onClick={() => openGallery(e)}>
                    See more photos
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ───────── CatGalleryModal  ─────────────────────────────────────── */}
      <CatGalleryModal
        images={galleryImages}
        open={galleryOpen}
        onClose={closeGallery}
      />
    </div>
  );
}
