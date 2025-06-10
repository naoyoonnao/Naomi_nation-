import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategorySlider from "../CategorySlider/CategorySlider";
import "./ShowsTeaserSlider.scss";

export default function ShowsTeaserSlider() {
  const [cats, setCats] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL ?? "";     

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/events`);
        const type = res.headers.get("content-type") || "";
        if (!res.ok || !type.includes("application/json")) return;

        const events = await res.json();
        if (!ignore) {
          setCats(
            events.map((e) => ({
              _id:          e._id || e.id,
              name:         "",                                            
              mainImageUrl: `${API_BASE}/uploads/${e.mainImage}`,
            }))
          );
        }
      } catch {
      }
    })();

    return () => { ignore = true; };
  }, [API_BASE]);

  if (!cats.length) return null;        

  return (
    <section className="shows-teaser">
    
      <CategorySlider title="" cats={cats} />

     
      <Link to="/shows" className="shows-teaser__btn">
        Read more
      </Link>
    </section>
  );
}
