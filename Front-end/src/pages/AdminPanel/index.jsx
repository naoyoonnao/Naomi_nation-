import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import CategoryView from "./CategoryView";
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal"; // uncommented
import CatForm from "./CatForm";
import styles from "./AdminPanel.module.scss";
import TranslationsTab from "./TranslationsTab";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "cats", label: "Cats" },
  { key: "categories", label: "Categories" },
  { key: "events", label: "Events" },
  { key: "users", label: "Users" },
  { key: "translations", label: "Translations" },
];

export default function AdminPanel() {
  const [active, setActive] = useState("dashboard");
  const [search, setSearch] = useState("");

  // global data
  const [cats, setCats] = useState([]);
  const [events, setEvents] = useState([]);

  // derived
  const categories = [...new Set(cats.map((c) => c.category))];

  // state declarations
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // fetch cats & events once
  useEffect(() => {
    (async () => {
      try {
        const api = import.meta.env.VITE_API_URL || "";
        const [catsRes, eventsRes] = await Promise.all([
          fetch(`${api}/api/cats`).then((r) => r.json()),
          fetch(`${api}/api/events`).then((r) => r.json()),
        ]);
        setCats(catsRes);
        setEvents(eventsRes);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ---- Cats tab inner view management ----
  const [catsView, setCatsView] = useState("dashboard"); // dashboard|form|category
  const [selectedCategory, setSelectedCategory] = useState("");

  const renderTab = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "cats":
        if (catsView === "form")
          return <CatForm onBack={() => setCatsView("dashboard")} toast={toast} />;

        if (catsView === "category")
          return (
            <CategoryView
              title={selectedCategory}
              posts={cats.filter((c) => c.category === selectedCategory)}
              onBack={() => setCatsView("dashboard")}
              toast={toast}
            />
          );

        // default cats dashboard
        return (
          <Dashboard
            categories={categories}
            onAdd={() => setCatsView("form")}
            onSelect={(name) => {
              setSelectedCategory(name);
              setCatsView("category");
            }}
            onEventSaved={(ev) => setEvents((prev) => [ev, ...prev])}
          />
        );
      case "categories":
        return (
          <Dashboard
            categories={categories}
            onAdd={() => setCatsView("form")}
            onSelect={(name) => {
              setSelectedCategory(name);
              setCatsView("category");
              setActive("cats");
            }}
            onEventSaved={() => {}}
          />
        );
      case "events":
        return (
          <div>
            <button
              className={styles.addBtn}
              onClick={() => setShowAddEvent(true)}
            >
              + Add Event
            </button>

            <div className={styles.grid}>
              {events
                .filter((ev) => ev.title?.toLowerCase().includes(search.toLowerCase()))
                .map((ev) => (
                  <div key={ev._id} className={styles.card}>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => setEditingEvent(ev)}
                      >✏️</button>
                      <button
                        className={styles.deleteBtn}
                        onClick={async () => {
                          if (!confirm("Delete event?")) return;
                          try {
                            const api = import.meta.env.VITE_API_URL || "";
                            await fetch(`${api}/api/events/${ev._id}`, { method: "DELETE" });
                            setEvents((prev) => prev.filter((e) => e._id !== ev._id));
                            toast.success("Event deleted");
                          } catch (e) {
                            console.error(e);
                            toast.error("Delete failed");
                          }
                        }}
                      >🗑️</button>
                    </div>
                    <img
                      src={ev.mainImageUrl || `${import.meta.env.VITE_API_URL}/uploads/${ev.mainImage}`}
                      alt={ev.title}
                      className={styles.image}
                    />
                    <span className={styles.caption}>{ev.title}</span>
                  </div>
                ))}
            </div>

            {showAddEvent && (
              <AddEventModal
                onClose={() => setShowAddEvent(false)}
                toast={toast}
                onSaved={(ev) => {
                  setEvents((prev) => [ev, ...prev]);
                  setShowAddEvent(false);
                }}
              />
            )}

            {editingEvent && (
              <EditEventModal
                event={editingEvent}
                onClose={() => setEditingEvent(null)}
                toast={toast}
                onSaved={(ev) => {
                  setEvents((prev) => prev.map((e) => (e._id === ev._id ? ev : e)));
                  setEditingEvent(null);
                }}
                onDeleted={(id) => {
                  setEvents((prev) => prev.filter((e) => e._id !== id));
                  setEditingEvent(null);
                }}
              />
            )}
          </div>
        );
      case "translations":
        return <TranslationsTab />;
      case "users":
        return <p>Users management coming soon…</p>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.adminTabs}>
      <h1>Admin Panel</h1>
      <nav className={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={t.key === active ? styles.active : ""}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {(active === "cats" || active === "events") && (
        <input
          className={styles.search}
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      <section className={styles.content}>{renderTab()}</section>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
