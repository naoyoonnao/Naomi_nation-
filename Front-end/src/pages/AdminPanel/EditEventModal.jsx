// src/pages/AdminPanel/EditEventModal.jsx
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './EditEventModal.module.scss';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function EditEventModal({ event, onClose, onSaved, onDeleted }) {
  /* ───────── scalar fields ───────── */
  const [data, setData] = useState({
    _id:         event._id,
    title:       event.title ?? '',
    date:        event.date ? new Date(event.date).toISOString().slice(0, 10) : '',
    description: event.description ?? '',
  });

  /* ───────── main image ───────── */
  const [mainFile, setMainFile] = useState(null);
  const [mainPrev, setMainPrev] =
    useState(event.mainImageUrl || `${API}/uploads/${event.mainImage}`);

  /* ───────── gallery ───────── */
  const raw = event.gallery ?? event.galleryImages ?? [];
  const [galPrev, setGalPrev] = useState(
    raw.map((src) => (src.startsWith('http') ? src : `${API}/uploads/${src}`))
  );
  const [newGalFiles,  setNewGalFiles]  = useState([]);  // File[] just added
  const [removedNames, setRemovedNames] = useState([]);  // filenames removed

  /* якщо галерея порожня – підтягуємо повний обʼєкт */
  useEffect(() => {
    if (galPrev.length === 0) {
      axios.get(`${API}/api/events/${event._id}`)
        .then(({ data: full }) => {
          const extra = (full.gallery ?? full.galleryImages ?? []).map((src) =>
            src.startsWith('http') ? src : `${API}/uploads/${src}`
          );
          setGalPrev(extra);
        })
        .catch(console.error);
    }
  }, [event._id]);

  /* ───────── edit toggles ───────── */
  const [editable, setEditable] = useState({ title:false, date:false, description:false });
  const enable = (k) => setEditable({ ...editable, [k]: true });

  /* ───────── refs ───────── */
  const mainInp = useRef();
  const galInp  = useRef();

  /* ───────── handlers ───────── */
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const pickMain = (e) => {
    const f = e.target.files[0];
    if (f) {
      setMainFile(f);
      setMainPrev(URL.createObjectURL(f));
    }
  };

  const pickGallery = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewGalFiles((prev) => [...prev, ...files]);
    setGalPrev((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryItem = (idx) => {
    const preview = galPrev[idx];
    setGalPrev((prev) => prev.filter((_, i) => i !== idx));

    if (preview.startsWith('blob:')) {
      setNewGalFiles((prev) =>
        prev.filter((f) => URL.createObjectURL(f) !== preview)
      );
    } else {
      setRemovedNames((prev) => [...prev, preview.split('/').pop()]);
    }
  };

  /* ───────── SAVE ───────── */
  const save = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    if (mainFile) fd.append('mainImage', mainFile);
    newGalFiles.forEach((f) => fd.append('galleryImages', f));
    ['title','date','description'].forEach((k) => fd.append(k, data[k]));
    if (removedNames.length) fd.append('remove', JSON.stringify(removedNames));

    try {
      const { data: saved } = await axios.patch(
        `${API}/api/events/${data._id}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      window.alert('Зміни збережені ✅');
      onSaved?.(saved);
    } catch (err) {
      console.error(err);
      window.alert('Помилка! Зміни не збережено.');
    }
  };

  /* ───────── DELETE ───────── */
  const delEvent = async () => {
    const ok = window.confirm('Дійсно видалити цей івент?');
    if (!ok) return;
    try {
      await axios.delete(`${API}/api/events/${data._id}`);
      window.alert('Івент видалено');
      onDeleted?.(data._id);
      onClose();
    } catch (err) {
      console.error(err);
      window.alert('Не вдалося видалити івент');
    }
  };

  /* ───────── поля ───────── */
  const FIELDS = [
    { key:'title',       label:'Title',       type:'text'     },
    { key:'date',        label:'Date',        type:'date'     },
    { key:'description', label:'Description', type:'textarea' },
  ];

  const renderField = ({ key, label, type }) => (
    <div key={key} className={styles.row}>
      <span className={styles.label}>{label}:</span>

      {editable[key] ? (
        type === 'textarea' ? (
          <textarea
            name={key}
            value={data[key]}
            onChange={handleChange}
            autoFocus
          />
        ) : (
          <input
            name={key}
            type={type}
            value={data[key]}
            onChange={handleChange}
            autoFocus
          />
        )
      ) : (
        <span className={styles.value}>{data[key] || '—'}</span>
      )}

      {!editable[key] && (
        <button
          type="button"
          className={styles.pencil}
          title="Edit"
          onClick={() => enable(key)}
        >
          ✏️
        </button>
      )}
    </div>
  );

  /* ───────── JSX ───────── */
  return (
    <div className={styles.backdrop}>
      <form className={styles.modal} onSubmit={save}>
        <button type="button" className={styles.close} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.heading}>Edit event</h2>

        {/* Main image */}
        <span className={styles.label}>Main image:</span>
        <div className={styles.thumbWrap}>
          {mainPrev && <img src={mainPrev} className={styles.thumb} alt="main" />}
          <button
            type="button"
            className={styles.pencil}
            title="Replace"
            onClick={() => mainInp.current.click()}
          >
            ✏️
          </button>
          <input
            ref={mainInp}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={pickMain}
          />
        </div>

        {/* Gallery */}
        <span className={styles.label}>Gallery:</span>
        <div className={styles.gallery}>
          {galPrev.map((src, idx) => (
            <div key={idx} className={styles.galItem}>
              <img src={src} className={styles.galImg} alt="gallery" />
              <button
                type="button"
                className={styles.removeX}
                title="Remove"
                onClick={() => removeGalleryItem(idx)}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addGal}
            title="Add photo"
            onClick={() => galInp.current.click()}
          >
            +
          </button>
          <input
            ref={galInp}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={pickGallery}
          />
        </div>

        {/* Scalar fields */}
        {FIELDS.map(renderField)}

        {/* Action buttons */}
        <div className={styles.actions}>
          <button className={styles.save} type="submit">
            Save
          </button>
          <button type="button" className={styles.delete} onClick={delEvent}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
