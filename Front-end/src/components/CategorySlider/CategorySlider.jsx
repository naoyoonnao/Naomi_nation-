// src/components/CategorySlider/CategorySlider.jsx  —  responsive & edge‑padding
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./CategorySlider.module.scss";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";


export default function CategorySlider({ title = "", cats = [], onSelect, showSeeAll = false }) {
  return (
    <section className={styles.section} style={{ padding: "0 24px" }}>
      <div className={styles.inner}>
        {/*  title відображаємо лише, якщо передано  */}
        {title && <h2 className={styles.title}>{title}</h2>}

        {/*  ← arrows →  + viewport  */}
        <div className={styles.wrapper}>
          <button className={`prev-arrow ${styles.arrow}`} aria-label="Prev" />

          <div className={styles.viewport}>
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".prev-arrow", nextEl: ".next-arrow" }}
              loop
              spaceBetween={24}
              // ⬇ breakpoints – пропорційно стискається, без обрізання
              breakpoints={{
                0:    { slidesPerView: 1 },   // < 640
                640:  { slidesPerView: 1.5 },
                768:  { slidesPerView: 2 },
                960:  { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
            >
              {cats.map((c) => (
                <SwiperSlide key={c._id} className={styles.slide}>
                  <button className={styles.card} onClick={() => onSelect?.(c)}>
                    <img
                      src={c.mainImageUrl || `${API}/uploads/${c.mainImage}`}
                      alt={c.name}
                    />
                    {c.name && <span className={styles.name}>{c.name}</span>}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button className={`next-arrow ${styles.arrow} ${styles.right}`} aria-label="Next" />
        </div>

        {/*  See All – показуємо лише, якщо явно попросили  */}
        {showSeeAll && (
          <button className={styles.seeAll}>See All</button>
        )}
      </div>
    </section>
  );
}
