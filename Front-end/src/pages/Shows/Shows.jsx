import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header/Header";
import CatGalleryModal from "../../components/CatGalleryModal/CatGalleryModal";
import EventCard from "../../components/EventCard/EventCard";
import { SearchContext } from "../../context/SearchContext";
import "./Shows.scss";

export default function Shows() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ───────── modal state ──────────────────────────────────────────────────
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL ?? ""; // .env або proxy

  const { query: searchQuery } = useContext(SearchContext);

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

        // newest first
        data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

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
            {events
              .filter((e) =>
                searchQuery ? e.title.toLowerCase().includes(searchQuery) : true
              )
              .map((e) => (
                <EventCard
                  key={e._id}
                  event={e}
                  apiBase={API_BASE}
                  onOpenGallery={openGallery}
                />
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
