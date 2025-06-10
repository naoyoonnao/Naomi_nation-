/* src/components/CatGalleryModal/CatGalleryModal.jsx */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./CatGalleryModal.module.scss";

export default function CatGalleryModal({ images = [], open, onClose }) {
  const [root, setRoot] = useState(null);
  const [active, setActive] = useState(0);    
  const [progress, setProgress] = useState(0);

  /* mount portal root */
  useEffect(() => {
    setRoot(document.body);
  }, []);

  /* lock scroll while modal open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open || !root) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>

        <div className={styles.sliderWrap}>
        <Swiper
          modules={[Navigation]}
          loop={true}
          navigation={{
            prevEl: `.${styles.prev}`,
            nextEl: `.${styles.next}`,
          }}
          onSlideChange={(sw) => {
            const ratio = (sw.realIndex + 1) / images.length;
            setProgress(ratio * 100);
            setActive(sw.realIndex); 
        }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img src={src} alt="gallery"  />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>

        <button className={`${styles.arrow} ${styles.prev}`}>❮</button>
        <button className={`${styles.arrow} ${styles.next}`}>❯</button>

        {/* indicators */}
        <div className={styles.dots}>
          {images.map((_, i) => (
            <span
              key={i}
              className={i === active ? styles.dotActive : styles.dot}
              style={{ width: `${100 / images.length}%` }}
            />
          ))}
        </div>
      </div>
    </div>,
    root
  );
}
