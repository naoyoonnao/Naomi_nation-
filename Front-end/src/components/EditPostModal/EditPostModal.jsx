import { useState, useRef, useMemo } from 'react';
import styles from './EditPostModal.module.scss';
import axios from 'axios';

const API  = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const fmt  = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const NEW  = '__new__';

export default function EditPostModal({
  post,
  categories = [],
  onClose,
  onUpdate,           // оновлений пост
  onDeleted,          // id видаленого поста
}) {
  /* ---------- state ---------- */
  const [catList, setCatList] = useState(categories.map((c) => c.name));
  const [data,    setData]    = useState({ ...post, category: post.category || '' });
  const [editable, setEd]     = useState({});
  const [preview,  setPrev]   = useState(post.mainImageUrl || `${API}/uploads/${post.mainImage}`);

  const [gallery,  setGallery] = useState(post.gallery || post.galleryImages || []);
  const [galEdit,  setGalEdit] = useState(false);
  const [toDelete, setDel]     = useState([]);
  const [newFiles, setNew]     = useState([]);

  const mainInp = useRef();
  const galInp  = useRef();

  /* ---------- helpers ---------- */
  const enable = (k) => setEd({ ...editable, [k]: true });
  const handle = (e) => setData({ ...data, [e.target.name]: e.target.value });

  /* ---------- category ---------- */
  const handleCategory = (e) => {
    const v = e.target.value;
    if (v === NEW) {
      const name = prompt('Нова категорія:')?.trim();
      if (name) {
        setCatList([...catList, name]);
        setData({ ...data, category: name });
      }
    } else setData({ ...data, category: v });
  };

  /* ---------- images ---------- */
  const pickMain = (e) => {
    const f = e.target.files[0];
    if (f) {
      setData({ ...data, mainImage: f });
      setPrev(URL.createObjectURL(f));
    }
  };

  const pickGallery = (e) => {
    const files = Array.from(e.target.files || []);
    setNew([...newFiles, ...files]);
    setGallery([...gallery, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeFromGallery = (idx) => {
    const img = gallery[idx];
    setGallery(gallery.filter((_, i) => i !== idx));
    if (typeof img === 'string' && !img.startsWith('blob:')) {
      setDel([...toDelete, img.split('/').pop()]);
    } else {
      setNew(newFiles.filter((_, i) => i !== idx));
    }
  };

  /* ---------- fields ---------- */
  const FIELDS = useMemo(
    () => [
      { key:'category',     label:'Category',      type:'select', options:[''].concat(catList).concat(NEW) },
      { key:'name',         label:'Name',          type:'text' },
      { key:'color',        label:'Color',         type:'text' },
      { key:'sex',          label:'Sex',           type:'text' },
      { key:'dob',          label:'Date of birth', type:'date' },
      { key:'pedigree',     label:'Pedigree',      type:'text' },
      { key:'mother',       label:'Mother',        type:'text' },
      { key:'father',       label:'Father',        type:'text' },
      { key:'status',       label:'Status',        type:'text' },
      { key:'price',        label:'Price',         type:'number' },
      { key:'availability', label:'Availability',  type:'select',
        options:['AVAILABLE','RESERVED','SOLD'] },
    ],
    [catList],
  );

  /* ---------- SAVE ---------- */
  const handleSave = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('_id', data._id);

    if (data.mainImage instanceof File) fd.append('mainImage', data.mainImage);
    FIELDS.forEach(({ key }) => fd.append(key, data[key] ?? ''));
    newFiles.forEach((f) => fd.append('newGalleryImages', f));
    fd.append('galleryImagesToDelete', JSON.stringify(toDelete));

    try {
      const { data: saved } = await axios.patch(
        `${API}/api/cats/${data._id}`,
        fd,
        { headers:{ 'Content-Type':'multipart/form-data' } },
      );
      alert('Зміни збережені ✅');
      onUpdate?.(saved);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Помилка при збереженні');
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async () => {
    const ok = window.confirm('Ви впевнені, що хочете видалити цей пост?');
    if (!ok) return;
    try {
      await axios.delete(`${API}/api/cats/${data._id}`);
      alert('Пост видалено ✅');
      onDeleted?.(data._id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Не вдалося видалити пост');
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* жовтий хрестик */}
        <button className={styles.close} onClick={onClose}>✕</button>

        <h2 className={styles.heading}>Edit post</h2>

        {/* MAIN IMAGE */}
        <div className={styles.row}>
          <span className={styles.label}>Main image:</span>
          <img src={preview} alt="" className={styles.thumb} />
          <button
            className={styles.pencil}
            type="button"
            onClick={() => mainInp.current.click()}
            title="Replace"
          >
            ✏️
          </button>
          <input
            ref={mainInp}
            type="file"
            accept="image/*"
            style={{ display:'none' }}
            onChange={pickMain}
          />
        </div>

        {/* GALLERY */}
        <div className={styles.row}>
          <span className={styles.label}>Gallery:</span>
          <div className={styles.gallery}>
            {gallery.map((g, i) => (
              <div key={i} className={styles.gThumb}>
                <img
                  src={
                    typeof g === 'string' && !g.startsWith('blob:')
                      ? `${API}/uploads/${g}` : g
                  }
                  alt=""
                />
                {galEdit && (
                  <button className={styles.del} onClick={() => removeFromGallery(i)}>✕</button>
                )}
              </div>
            ))}
            {galEdit && (
              <button className={styles.add} type="button" onClick={() => galInp.current.click()}>
                ＋
              </button>
            )}
            <input
              ref={galInp}
              type="file"
              accept="image/*"
              multiple
              style={{ display:'none' }}
              onChange={pickGallery}
            />
          </div>
          {!galEdit && (
            <button
              className={styles.pencil}
              type="button"
              onClick={() => setGalEdit(true)}
              title="Edit gallery"
            >
              ✏️
            </button>
          )}
        </div>

        {/* TEXT FIELDS */}
        <form onSubmit={handleSave} className={styles.form}>
          {FIELDS.map(({ key,label,type,options }) => (
            <div key={key} className={styles.row}>
              <span className={styles.label}>{label}:</span>

              {!editable[key] ? (
                <span className={styles.value}>
                  {key === 'dob' ? fmt(data[key]) : data[key] || '—'}
                </span>
              ) : type === 'select' ? (
                <select
                  name={key}
                  value={data[key]}
                  onChange={key === 'category' ? handleCategory : handle}
                  className={styles.select}
                  autoFocus
                >
                  {options.map((opt) =>
                    opt === ''  ? <option key="blank" value="">— виберіть —</option>
                  : opt === NEW ? <option key="new" value={NEW}>+ Нова категорія</option>
                  :              <option key={opt} value={opt}>{opt}</option>
                  )}
                </select>
              ) : (
                <input
                  name={key}
                  type={type}
                  value={type === 'date' ? fmt(data[key]) : data[key] ?? ''}
                  onChange={handle}
                  autoFocus
                />
              )}

              {!editable[key] && (
                <button className={styles.pencil} type="button" onClick={() => enable(key)}>
                  ✏️
                </button>
              )}
            </div>
          ))}

          {/* ACTION BUTTONS */}
          <div className={styles.actions}>
            <button type="submit" className={styles.save}>Save</button>
            <button type="button" className={styles.delete} onClick={handleDelete}>Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}
