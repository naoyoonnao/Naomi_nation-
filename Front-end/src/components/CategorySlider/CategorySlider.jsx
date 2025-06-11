import { Link } from "react-router-dom"; 
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./CategorySlider.module.scss";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function CategorySlider({ title = "", cats = [], onSelect, seeAllLink = "" }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [cats]);

  if (!Array.isArray(cats) || !cats.length) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.wrapper}>
          <button ref={prevRef} className={`prev-arrow ${styles.arrow}`} aria-label="Prev" />
          <div className={styles.viewport}>
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              loop={true}
              spaceBetween={24}
              // ОНОВЛЕНО: Налаштування для кращої адаптивності
              breakpoints={{
                0: { slidesPerView: 1.15, spaceBetween: 16 }, // Картинка буде більшою на мобільних
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2 },
                960: { slidesPerView: 3},
                1280: { slidesPerView: 4 },
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
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
          <button ref={nextRef} className={`next-arrow ${styles.arrow} ${styles.right}`} aria-label="Next" />
        </div>
        
        {seeAllLink && (
          <Link to={seeAllLink} className={styles.seeAll}>
            See All
          </Link>
        )}
      </div>
    </section>
  );
}
