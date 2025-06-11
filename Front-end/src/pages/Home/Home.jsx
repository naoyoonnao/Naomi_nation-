import React, { useEffect, useState } from 'react';
import ShowsTeaserSlider from "../../components/ShowsTeaserSlider/ShowsTeaserSlider";
import './Home.scss';
import Header from '../../components/Header/Header';
import MainSection from '../../components/MainSection/MainSection';
import CategorySlider from '../../components/CategorySlider/CategorySlider';
import axios from 'axios';

const API = 'http://localhost:8080';

// 1. Для надійності, ключі тепер з маленької літери.
const categoryLinks = {
  "кошенята": "/kittens",
  "дорослі": "/breeding",
};

export default function Home() {
  const [catsByCat, setCatsByCat] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/cats`)
      .then(res => {
        const map = {};
        res.data.forEach(c => {
          map[c.category] = (map[c.category] || []).concat(c);
        });
        setCatsByCat(map);
        setLoading(false);
      })
      .catch(err => {
        console.error('Помилка завантаження котів:', err);
        setError('Не вдалося завантажити котів');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section>
        <div className="wrapper">
          <Header />
          <MainSection />
        </div>
      </section>

      <div>
        <div className="wrapper">
          {loading && <p className="state-note">Loading...</p>}
          {error && <p className="state-note error">{error}</p>}

          {Object.entries(catsByCat).map(([catName, list]) => {
            // 2. ГОЛОВНЕ ВИПРАВЛЕННЯ:
            //    Перетворюємо назву категорії в маленькі літери перед пошуком.
            //    Тепер "Дорослі", "дорослі" або " ДОРОСЛІ " будуть працювати однаково.
            const link = categoryLinks[catName.toLowerCase().trim()];

            return (
              <CategorySlider
                key={catName}
                title={catName}
                cats={list}
                seeAllLink={link} // Передаємо знайдене посилання
              />
            );
          })}

          {!loading && !Object.keys(catsByCat).length && (
            <p className="state-note">Поки що немає постів 🙃</p>
          )}
        </div>
      </div>
      
      <ShowsTeaserSlider />
    </>
  );
}
