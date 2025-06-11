import { useState } from "react";
import styles from "./EventCard.module.scss";

export default function EventCard({ event, apiBase, onOpenGallery }) {
  const [expanded, setExpanded] = useState(false);

  const imgSrc = `${apiBase}/uploads/${event.mainImage}`;
  const galleryCount = event.gallery?.length || 0;

  return (
    <article
      className={`${styles.card} ${expanded ? styles.expanded : ""}`}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className={styles.imgWrapper}>
        <img src={imgSrc} alt={event.title} loading="lazy" />
        <button
          className={styles.galleryBtn}
          title="See more photos"
          onClick={(e) => {
            e.stopPropagation();
            onOpenGallery(event);
          }}
        >
          📷 {galleryCount}
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.date}>
          {event.date ? new Date(event.date).toLocaleDateString() : "—"}
        </p>
        {event.description && (
          <p className={styles.desc}>{event.description}</p>
        )}
      </div>
    </article>
  );
}
