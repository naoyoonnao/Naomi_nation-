import { useTranslation } from "react-i18next";
import { useNavigate }   from "react-router-dom";

import Header      from "../../components/Header/Header";

import AboutImg    from "../../assets/About.png";
import SiameseImg  from "../../assets/sun.png";  
import OrientalImg from "../../assets/mama.png";
import Logo        from "../../assets/logo.svg";
import styles      from "./About.module.scss";
export default function About() {

  const { t } = useTranslation();
  const nav   = useNavigate();

  return (
    <div className={styles.aboutPage}>
      <Header />

      {/* HERO */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${AboutImg})` }}
      >
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <img src={Logo} alt="Naomi Nation" className={styles.logo} />

          {/* ---- Переклади ---- */}
          <h1>{t("aboutTitle")}</h1>
          <p className={styles.lead}>{t("aboutLead")}</p>

          <button className={styles.cta} onClick={() => nav("/kittens")}>  
            {t("OurKittens")}
          </button>
        </div>
      </section>

      {/* MAIN BLOCKS */}
      <main className={styles.main}>
        <article className={styles.section}>
          <img src={SiameseImg} alt="Siamese kittens" />
          <div className={styles.text}>
            <h2>{t("siameseTitle")}</h2>
            <p>{t("siameseText")}</p>
          </div>
        </article>

        <article className={`${styles.section} ${styles.reverse}`}>    
          <img src={OrientalImg} alt="Oriental shorthair with owner" />
          <div className={styles.text}>
            <h2>{t("orientalTitle")}</h2>
            <p>{t("orientalText")}</p>
          </div>
        </article>
      </main>
    </div>
  );
}
