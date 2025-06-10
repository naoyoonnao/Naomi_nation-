import { useState, useRef } from 'react';
import styles from './AddEvent.module.scss';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function AddEventModal({ onClose }) {
  /* ---- local state ---- */
  const [main, setMain] = useState(null);
  const [mainPrev, setMainPrev] = useState(null);
  const [galFiles, setGalFiles] = useState([]);   // File[]
  const [galPrev,  setGalPrev]  = useState([]);   // URLs

  const [title, setTitle]       = useState('');
  const [date,  setDate]        = useState('');   // YYYY‑MM‑DD
  const [desc,  setDesc]        = useState('');

  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const mainRef = useRef();
  const galRef  = useRef();

  /* ---- handlers ---- */
  const pickMain = (e) => {
    const f = e.target.files[0];
    if (f) {
      setMain(f);
      setMainPrev(URL.createObjectURL(f));
    }
  };

  const pickGallery = (e) => {
    const files = Array.from(e.target.files || []);
    setGalFiles([...galFiles, ...files]);
    setGalPrev([...galPrev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeGal = (idx) => {
    setGalFiles(galFiles.filter((_, i) => i !== idx));
    setGalPrev(galPrev.filter((_, i) => i !== idx));
  };

  /* ---- submit ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!main || !title.trim() || !date || !desc.trim()) {
      setError('Усі поля та головне фото обов’язкові');
      return;
    }
    setError('');

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('date', date);            // <-- API expects "date"
    fd.append('description', desc.trim());
    fd.append('mainImage', main);
    galFiles.forEach((f) => fd.append('galleryImages', f));

    try {
      const res = await fetch(`${API}/api/events`, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('HTTP error');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // clear form
      setMain(null); setMainPrev(null);
      setGalFiles([]); setGalPrev([]);
      setTitle(''); setDate(''); setDesc('');
    } catch (err) {
      console.error(err);
      setError('Не вдалося зберегти івент');
    }
  };

  /* ---- UI ---- */
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button type="button" className={styles.close} onClick={onClose}>×</button>
        <h2 className={styles.heading}>Add event</h2>

        {error   && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Івент додано успішно ✅</div>}

        {/* main image */}
        <label className={styles.label}>Main image:</label>
        <div className={styles.previewBox} onClick={() => mainRef.current.click()}>
          {mainPrev ? (
            <img src={mainPrev} alt="preview" />
          ) : (
            <span className={styles.placeholder}>＋</span>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={mainRef}
            onChange={pickMain}
          />
        </div>

        {/* gallery */}
        <label className={styles.label}>Gallery:</label>
        <div className={styles.galleryRow}>
          {galPrev.map((url, idx) => (
            <div key={idx} className={styles.gThumb}>
              <img src={url} alt="g" />
              <button type="button" className={styles.del} onClick={() => removeGal(idx)}>✕</button>
            </div>
          ))}
          <div className={styles.gThumb} onClick={() => galRef.current.click()}>
            <span className={styles.add}>＋</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            ref={galRef}
            onChange={pickGallery}
          />
        </div>

        {/* fields */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button type="submit" className={styles.save}>Save</button>
      </form>
    </div>
  );
}
