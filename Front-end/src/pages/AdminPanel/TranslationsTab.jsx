import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./AdminPanel.module.scss";

export default function TranslationsTab() {
  const API = import.meta.env.VITE_API_URL || "";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newRow, setNewRow] = useState({ key: "", en: "", ua: "" });

  // fetch all keys
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/i18n`);
        const data = await res.json();
        setRows(data);
      } catch (e) {
        toast.error("Failed to load translations");
      } finally {
        setLoading(false);
      }
    })();
  }, [API]);

  const handleSave = async (row) => {
    try {
      const res = await fetch(`${API}/api/i18n/${row.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ en: row.en, ua: row.ua }),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved");
    } catch {
      toast.error("Save error");
    }
  };

  const handleDelete = async (key) => {
    if (!confirm("Delete key?")) return;
    try {
      const res = await fetch(`${API}/api/i18n/${key}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRows((r) => r.filter((x) => x.key !== key));
      toast.success("Deleted");
    } catch {
      toast.error("Delete error");
    }
  };

  const handleAdd = async () => {
    if (!newRow.key) return toast.warn("Key required");
    try {
      const res = await fetch(`${API}/api/i18n`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
      if (res.status === 409) return toast.error("Key exists");
      if (!res.ok) throw new Error();
      const added = await res.json();
      setRows((r) => [...r, added]);
      setNewRow({ key: "", en: "", ua: "" });
      toast.success("Added");
    } catch {
      toast.error("Add error");
    }
  };

  const filtered = rows.filter((r) =>
    search ? r.key.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div>
      <h2>Translations</h2>
      <input
        placeholder="Search key…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table className={styles.transTable}>
          <thead>
            <tr>
              <th>Key</th>
              <th>EN</th>
              <th>UA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.key}>
                <td>{row.key}</td>
                <td>
                  <input
                    value={row.en}
                    onChange={(e) =>
                      setRows((rows) =>
                        rows.map((r) =>
                          r.key === row.key ? { ...r, en: e.target.value } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={row.ua}
                    onChange={(e) =>
                      setRows((rows) =>
                        rows.map((r) =>
                          r.key === row.key ? { ...r, ua: e.target.value } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(row)}>💾</button>
                  <button onClick={() => handleDelete(row.key)}>🗑️</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <input
                  placeholder="key"
                  value={newRow.key}
                  onChange={(e) => setNewRow({ ...newRow, key: e.target.value })}
                />
              </td>
              <td>
                <input
                  placeholder="en"
                  value={newRow.en}
                  onChange={(e) => setNewRow({ ...newRow, en: e.target.value })}
                />
              </td>
              <td>
                <input
                  placeholder="ua"
                  value={newRow.ua}
                  onChange={(e) => setNewRow({ ...newRow, ua: e.target.value })}
                />
              </td>
              <td>
                <button onClick={handleAdd}>＋</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
