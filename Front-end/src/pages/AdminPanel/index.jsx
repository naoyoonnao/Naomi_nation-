import { useEffect, useState } from 'react';
import Dashboard    from './Dashboard';
import CategoryView from './CategoryView';
import CatForm      from './CatForm';
import './AdminPanel.scss';

const API = import.meta.env.VITE_API_URL || '';

export default function AdminPanel() {
  const [cats,  setCats] = useState([]);      
  const [view,  setView] = useState('dash');  
  const [active, setCat] = useState(null);   
  const [events, setEvents] = useState([]); 

  const handleEventSaved = (ev) => {
    setEvents((prev) => [ev, ...prev]);
  };


  useEffect(() => {
    fetch(`${API}/api/cats`)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(setCats)
      .catch(console.error);
  }, []);


  const categories = [...new Set(cats.map((c) => c.category))];


  if (view === 'form')
    return <CatForm onBack={() => setView('dash')} />;

  if (view === 'cat')
    return (
      <CategoryView
        title  ={active}
        posts  ={cats.filter((c) => c.category === active)}
        onBack ={() => setView('dash')}
      />
    );


  return (
    <Dashboard
      categories={categories}
      onAdd     ={() => setView('form')}
      onSelect  ={(name) => { setCat(name); setView('cat'); }}
      events={events}
      onEventSaved={handleEventSaved}
    />
  );
}
