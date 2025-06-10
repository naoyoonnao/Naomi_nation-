import { useState } from "react";
import Header      from "../../components/Header/Header";
import CatsForSale from "../../components/CatsForSale/CatsForSale";
import styles      from "./Breeding.module.scss";
import AdultSection from "../../components/AdultSection/AdultSection";

export default function Breeding() {
  const [sex, setSex] = useState(null);      

  return (
    <>
      <Header />

      <section className={styles.top}>
      <AdultSection   activeSex={sex} onSelectSex={setSex} />

        <div className={styles.filters}>
          <button
            className={sex === "male" ? styles.active : ""}
            onClick={() => setSex("male")}
          >
            Male
          </button>
          <button
            className={sex === "female" ? styles.active : ""}
            onClick={() => setSex("female")}
          >
            Female
          </button>
        </div>
      </section>

      {/* список дорослих котів */}
      <CatsForSale categoryFilter="дорослі" sexFilter={sex} />
    </>
  );
}
