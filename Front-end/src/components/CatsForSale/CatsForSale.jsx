/* src/components/CatsForSale/CatsForSale.jsx */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CatGalleryModal from "../CatGalleryModal/CatGalleryModal";
import styles from "./CatsForSale.module.scss";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function CatsForSale({ categoryFilter, sexFilter }) {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState(null);

  /* ---- fetch & filter ---- */
  useEffect(() => {
    fetch(`${API}/api/cats`)
      .then((r) => r.json())
      .then((all) => {
        const normCat = categoryFilter?.toLowerCase();
        const normSex = sexFilter?.toLowerCase();

        const list = all
          .filter((c) =>
            !normCat || (c.category || "").toLowerCase().includes(normCat),
          )
          .filter((c) =>
            !normSex || (c.sex || "").toLowerCase() === normSex,
          )
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          );

        setCats(list);
      })
      .catch((e) => console.error("cats fetch", e))
      .finally(() => setLoading(false));
  }, [categoryFilter, sexFilter]); // ← обидва фільтри у залежностях

  if (loading)      return <p className={styles.note}>Loading…</p>;
  if (!cats.length) return <p className={styles.note}>No posts yet 🙃</p>;

  return (
    <>
      <div className={styles.list}>
        {cats.map((c) => (
          <article key={c._id} className={styles.card}>
            {/* photo */}
            <div className={styles.photoWrap} data-name={c.name}>
              <img
                src={c.mainImageUrl || `${API}/uploads/${c.mainImage}`}
                alt={c.name}
              />
            </div>

            {/* info */}
            <div className={styles.info}>
              <Field label="Name"          value={c.name} />
              <Field label="Color"         value={c.color} />
              <Field label="Sex"           value={c.sex} />
              <Field label="Date of birth" value={fmt(c.dob)} />
              <Field
                label="Pedigree"
                value={
                  c.pedigree ? (
                    <Link to={c.pedigree} target="_blank" rel="noopener">
                      View
                    </Link>
                  ) : null
                }
              />
              <Field label="Mother" value={c.mother} />
              <Field label="Father" value={c.father} />
              <Field label="Status" value={c.status} />
              <Field label="Price"  value={c.price} />

              <button
                className={styles.more}
                onClick={() =>
                  setGallery(
                    (c.galleryImages || []).map(
                      (g) => `${API}/uploads/${g}`,
                    ),
                  )
                }
              >
                See more photos
              </button>
            </div>

            {c.availability && (
              <span
                className={`${styles.badge} ${
                  styles[c.availability.toLowerCase()]
                }`}
              >
                {c.availability}
              </span>
            )}
          </article>
        ))}
      </div>

      {/* ----- modal ----- */}
      <CatGalleryModal
        images={gallery || []}
        open={!!gallery}
        onClose={() => setGallery(null)}
      />
    </>
  );
}

/* ------- helpers ------- */
function Field({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <strong>{label}: </strong>
      {value}
    </p>
  );
}

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("uk-UA");
}
