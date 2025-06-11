// src/pages/AdminPanel/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';
import AddEventModal  from "./AddEventModal";
import EditEventModal from "./EditEventModal";         // ← імпорт уже був, лишаємо
import { toast } from 'react-toastify';

export default function Dashboard({ categories, onAdd, onSelect, onEventSaved }) {
  const nav = useNavigate();

  const [mode,        setMode]     = useState('categories'); // 'categories' | 'events'
  const [showAddEvent,setShowAdd]  = useState(false);
  const [editing,     setEditing]  = useState(null);         // ← стан для модалки редагування
  const [events,      setEvents]   = useState([]);

  /* ───────── events list ───────── */
  useEffect(() => {
    if (mode === 'events') {
      fetch(`${import.meta.env.VITE_API_URL}/api/events`)
        .then(r => r.json())
        .then(setEvents)
        .catch(console.error);
    }
  }, [mode]);
 
  /* ───────── helper ───────── */
  const updateEvents = (ev) => {
    setEvents(prev =>
      prev.map(e => (e._id === ev._id ? ev : e))
    );
  };

  const handleDelete = (id) => {
    // одразу прибираємо картку зі стану, перезавантаження не потрібне
    setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <section className={styles.wrap}>
      <h1 className={styles.title}>CATagory</h1>

      {/* ───────── заголовковий рядок плиток ───────── */}
      <div className={styles.grid}>
        {mode === 'categories' && (
          <>
            {(categories || []).map(name => (
              <button
                key={name}
                className={styles.tile}
                onClick={() => onSelect(name)}
              >
                {name}
              </button>
            ))}

            <button
              className={styles.tile}
              onClick={() => setMode('events')}
            >
              Events
            </button>

            <button className={styles.addBtn} onClick={onAdd}>
              + Post
            </button>

            <button
              className={styles.addBtn}
              onClick={() => setShowAdd(true)}
            >
              + Event
            </button>
          </>
        )}

        {mode === 'events' && (
          <button
            className={styles.tile}
            onClick={() => setMode('categories')}
          >
            ← Back
          </button>
        )}
      </div>

      {/* ───────── грід івентів ───────── */}
      {mode === 'events' && (
        <div className={styles.grid}>
          {events.map(ev => (
            <div key={ev._id} className={styles.card}>
              {/* edit + delete overlay */}
              <div className={styles.cardActions}>
                <button
                  className={styles.editBtn}
                  title="Edit event"
                  onClick={() => setEditing(ev)}
                >
                  ✏️
                </button>
                <button
                  className={styles.deleteBtn}
                  title="Delete event"
                  onClick={async () => {
                    if (!confirm("Delete event?")) return;
                    try {
                      const api = import.meta.env.VITE_API_URL || "";
                      await fetch(`${api}/api/events/${ev._id}`, { method: "DELETE" });
                      handleDelete(ev._id);
                      toast.success("Event deleted");
                    } catch (e) {
                      console.error(e);
                      toast.error("Delete failed");
                    }
                  }}
                >
                  🗑️
                </button>
              </div>

              <img
                src={ev.mainImageUrl ||
                     `${import.meta.env.VITE_API_URL}/uploads/${ev.mainImage}`}
                alt={ev.title}
                className={styles.image}
              />
              <span className={styles.caption}>{ev.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* ───────── модалка додавання ───────── */}
      {showAddEvent && (
        <AddEventModal
          onClose={() => setShowAdd(false)}
          onSaved={(ev) => {
            onEventSaved(ev);
            setShowAdd(false);
            if (mode === 'events') setEvents([ev, ...events]);
          }}
        />
      )}

      {/* ───────── модалка редагування ───────── */}
      {editing && (
        <EditEventModal
          event={editing}
          onClose={() => setEditing(null)}
          onSaved={(ev) => {
            updateEvents(ev);      // локально оновлюємо грід
            setEditing(null);
          }}
          onDeleted={handleDelete} 
        />
      )}
    </section>
  );
}
