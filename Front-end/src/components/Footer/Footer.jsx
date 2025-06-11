import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.colLeft}>
          <h3 className={styles.brand}>Naomi&nbsp;<span>nation</span></h3>
          <p className={styles.copy}>&copy; {year} Naomi Nation. All rights reserved.</p>
        </div>

        <nav className={styles.colMid} aria-label="Footer menu">
          <Link to="/"   >Home</Link>
          <Link to="/kittens">Kittens</Link>
          <Link to="/breeding">In breeding</Link>
          <Link to="/shows">Shows</Link>
          <Link to="/contacts">Contacts</Link>
        </nav>

        <div className={styles.colRight}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className={styles.iconFb}></a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className={styles.iconIg}></a>
        </div>
      </div>
    </footer>
  );
}
