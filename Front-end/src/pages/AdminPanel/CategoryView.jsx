import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CategoryView.module.scss';
import EditPostModal from '../../components/EditPostModal/EditPostModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function CategoryView({ title = 'Категорія', posts: init = [] }) {
  const navigate = useNavigate();
  const [posts,   setPosts] = useState(init);
  const [editing, setEdit]  = useState(null);
  const [toast,   setToast] = useState('');

  const [cats, setCats] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then(setCats)
      .catch(console.error);
  }, []);

  const showToast = (txt) => {
    setToast(txt);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <section className={styles.wrap}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <button className={styles.back} onClick={() => navigate(0)}>← Назад</button>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.grid}>
        {posts.map((p) => (
          <div key={p._id} className={styles.card}>
            <button className={styles.editBtn} onClick={() => setEdit(p)}>✏️</button>
            <img
              src={`${API}/uploads/${p.mainImage}?v=${Date.now()}`}
              alt={p.name || p.title}
              className={styles.image}
            />
            <span className={styles.caption}>{p.name || p.title}</span>
          </div>
        ))}
      </div>

      {editing && (
        <EditPostModal
          post={editing}
          categories={cats}
          onClose={() => setEdit(null)}
          onUpdate={(upd) => {
            setPosts((prev) =>
              prev.map((p) => (p._id === upd._id ? upd : p))
            );
            showToast('Зміни збережені ✅');
          }}
          onDeleted={(id) => {
            setPosts((prev) => prev.filter((p) => p._id !== id));
            showToast('Пост видалено ✅');
          }}
        />
      )}
    </section>
  );
}
