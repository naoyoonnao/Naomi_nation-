import { useEffect, useState } from "react";
import CategorySlider from "../CategorySlider/CategorySlider";
import "./ShowsTeaserSlider.scss";

export default function ShowsTeaserSlider() {
  const [cats, setCats] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL ?? "";

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events`);
        const type = res.headers.get("content-type") || "";
        if (!res.ok || !type.includes("application/json")) return;

        const events = await res.json();
        if (!ignore) {
          setCats(
            events.map((e) => ({
              _id: e._id || e.id,
              name: "", // У слайдері "Shows" назви під фото не потрібні
              mainImageUrl: `${API_BASE}/uploads/${e.mainImage}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching shows:", err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [API_BASE]);

  // Не показуємо секцію, якщо немає даних
  if (!cats.length) return null;

  return (
    <section className="shows-teaser">
      <h2 className="shows-teaser__title">Shows</h2>

      {/* Тепер передаємо сюди `seeAllLink="/shows"`.
        Це увімкне кнопку "See All" і задасть їй правильне посилання.
      */}
      <CategorySlider 
        title="" 
        cats={cats} 
        seeAllLink="/shows"
      />
    </section>
  );
}
