import React, { useEffect, useState } from 'react';
import ShowsTeaserSlider from "../../components/ShowsTeaserSlider/ShowsTeaserSlider";
import './Home.scss';

import Header      from '../../components/Header/Header';
import MainSection from '../../components/MainSection/MainSection';
import CategorySlider from '../../components/CategorySlider/CategorySlider';     // 🆕 слайдер

import axios from 'axios';

const API = 'http://localhost:8080';

export default function Home() {
  /* — стан, який уже був — */
  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);

  /* — нові стани — */
  const [catsByCat, setCatsByCat] = useState({});   // { "Кошенята": [..], ... }
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  /* ── GET усіх котів ───────────────────────────── */
  useEffect(() => {
    axios
      .get(`${API}/api/cats`)
      .then(res => {
        setCats(res.data);

        /* групуємо по category для слайдерів */
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
          {error    && <p className="state-note error">{error}</p>}

          {Object.entries(catsByCat).map(([catName, list]) => (
            <CategorySlider key={catName} title={catName} cats={list} />
          ))}

          {!loading && !Object.keys(catsByCat).length && (
            <p className="state-note">Поки що немає постів 🙃</p>
          )}
        </div>
      </div>

     
      {false && (  
        <div>
          <div className="wrapper">
            <div className="cat-list">
              {cats.map(cat => (
                <div
                  key={cat._id}
                  className="cat-card"
                  onClick={() => setSelectedCat(cat)}
                >
                  <img
                    src={`${API}/uploads/${cat.mainImage}`}
                    alt={cat.name}
                  />
                  <h2>{cat.name}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    
      {selectedCat && (
        <div className="overlay">
          <div className="overlay-content">
            <img
              src={`${API}/uploads/${selectedCat.mainImage}`}
              alt={selectedCat.name}
            />
            <span className="overlay-name">{selectedCat.name}</span>

            <div className="gallery">
              {selectedCat.galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={`${API}/uploads/${img}`}
                  alt={`${selectedCat.name} ${idx + 1}`}
                />
              ))}
            </div>

            <button onClick={() => setSelectedCat(null)}>Закрити</button>
          </div>
        </div>
      )}

     <ShowsTeaserSlider />
    </>
  );
}
