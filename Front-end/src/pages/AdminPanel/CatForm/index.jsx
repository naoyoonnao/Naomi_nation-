import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Field    from './Field';
import Dropzone from './Dropzone';
import "../AdminPanel.scss";     

const API = 'http://localhost:8080';

export default function CatForm({ onBack }) {
  /* ───────────────────────── категорії ───────────────────────── */
  const [categories, setCategories]   = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/cats`)
         .then(r => {
           const set = new Set(r.data.map(c => c.category));
           setCategories([...set]);
         })
         .catch(console.error);
  }, []);

  /* ───────────────────────── поля кота ───────────────────────── */
  const [name,  setName]  = useState('');
  const [color, setColor] = useState('');
  const [sex,   setSex]   = useState('');
  const [dob,   setDob]   = useState('');
  const [pedigree, setPedigree] = useState('');
  const [mother, setMother]     = useState('');
  const [father, setFather]     = useState('');
  const [status, setStatus]     = useState('');
  const [price,  setPrice]      = useState('');
  const [availability, setAvailability] = useState('AVAILABLE');

  /* ───────────────────────── фото ────────────────────────────── */
  const [mainImage,   setMainImage]   = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [gallery,         setGallery]         = useState([]);
  const [galleryPreview,  setGalleryPreview]  = useState([]);
  const galleryInputRef = useRef(null);

  const onMainChange = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (mainPreview) URL.revokeObjectURL(mainPreview);
    setMainImage(f);
    setMainPreview(URL.createObjectURL(f));
  };

  const onGalleryChange = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setGallery(prev => [...prev, ...files]);
    setGalleryPreview(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f)),
    ]);
  };

  const removeGallery = idx => {
    URL.revokeObjectURL(galleryPreview[idx]);
    setGallery(prev  => prev.filter((_, i) => i !== idx));
    setGalleryPreview(prev => prev.filter((_, i) => i !== idx));
  };

  /* ───────────────────────── submit ─────────────────────────── */
  const onSubmit = async e => {
    e.preventDefault();
    const category =
      selectedCat === '__new' ? newCategory.trim() : selectedCat;

    if (!mainImage)  return alert('Додайте головне фото 🙃');
    if (!category)   return alert('Оберіть або створіть категорію');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('category', category);
    fd.append('color', color.trim());
    fd.append('sex', sex);
    fd.append('dob', dob);
    fd.append('pedigree', pedigree.trim());
    fd.append('mother', mother.trim());
    fd.append('father', father.trim());
    fd.append('status', status);
    fd.append('price', price);
    fd.append('availability', availability);
    fd.append('mainImage', mainImage);
    gallery.forEach(g => fd.append('galleryImages', g));

    try {
      await axios.post(`${API}/api/cats`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (selectedCat === '__new' && newCategory)
        setCategories(prev => [...prev, newCategory.trim()]);
      alert('Кота додано 🐱');

      /* reset */
      if (mainPreview) URL.revokeObjectURL(mainPreview);
      galleryPreview.forEach(URL.revokeObjectURL);
      setName(''); setColor(''); setSex(''); setDob('');
      setPedigree(''); setMother(''); setFather('');
      setStatus(''); setPrice(''); setAvailability('AVAILABLE');
      setMainImage(null); setMainPreview(null);
      setGallery([]); setGalleryPreview([]);
      setSelectedCat(''); setNewCategory('');
    } catch (err) {
      console.error(err);
      alert('Помилка при додаванні кота');
    }
  };

  /* ───────────────────────── JSX ────────────────────────────── */
  return (
    <section className="admin">
      <button className="back-btn" onClick={onBack}>BACK</button>
      <h1>NEW POST</h1>

      <form onSubmit={onSubmit}>
        {/* Категорія */}
        <Field label="Категорія">
          <select value={selectedCat} onChange={e=>setSelectedCat(e.target.value)} required>
            <option value="">— виберіть —</option>
            {categories.map(c => <option key={c}>{c}</option>)}
            <option value="__new">+ Нова категорія</option>
          </select>
        </Field>
        {selectedCat==='__new' && (
          <Field label="">
            <input
              placeholder="Назва нової категорії"
              value={newCategory}
              onChange={e=>setNewCategory(e.target.value)}
            />
          </Field>
        )}

        {/* Головне фото */}
        <div className="photo-row">
          <Dropzone type="rect"   preview={mainPreview} onChange={onMainChange}/>
      
        </div>

        {/* Текстові поля */}
        <div className="fields-column">
          <Field label="Name"><input value={name} onChange={e=>setName(e.target.value)} required/></Field>
          <Field label="Color"><input value={color} onChange={e=>setColor(e.target.value)}/></Field>
          <Field label="Sex">
            <select value={sex} onChange={e=>setSex(e.target.value)}>
              <option value="">— select —</option><option>Female</option><option>Male</option>
            </select>
          </Field>
          <Field label="Date of birth">
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
          </Field>
          <Field label="Pedigree">
            <input type="url" value={pedigree} onChange={e=>setPedigree(e.target.value)}/>
          </Field>
          <Field label="Mother"><input value={mother} onChange={e=>setMother(e.target.value)}/></Field>
          <Field label="Father"><input value={father} onChange={e=>setFather(e.target.value)}/></Field>
          <Field label="Status">
            <select value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="">— select —</option>
              <option>for breeding</option><option>as a pet</option>
            </select>
          </Field>
          <Field label="Price (EUR)">
            <input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)}/>
          </Field>
          <Field label="Availability">
            <select value={availability} onChange={e=>setAvailability(e.target.value)}>
              <option>AVAILABLE</option><option>RESERVED</option><option>SOLD</option>
            </select>
          </Field>
        </div>

        {/* Галерея */}
        <Dropzone type="rect" gallery onChange={onGalleryChange}/>
        <div className="thumb-row">
          {galleryPreview.map((url,i)=>(
            <div key={i} className="thumb">
              <button type="button" className="close" onClick={()=>removeGallery(i)}>✕</button>
              <img src={url} alt={`thumb-${i}`}/>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="post-btn">POST</button>
        </div>
      </form>
    </section>
  );
}
