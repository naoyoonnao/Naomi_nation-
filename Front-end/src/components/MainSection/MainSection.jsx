import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate }   from "react-router-dom";     // 🆕
import Oriental          from "../../assets/Oriental.svg";
import Logo              from "../../assets/logo.svg";
import WhiteCat          from "../../assets/HomepageCat.png";
import "./MainSection.scss";

export default function MainSection() {
  const { t }    = useTranslation();
  const navigate = useNavigate();                     // 🆕

  const goToKittens = () => navigate("/kittens");     // 🆕 функція-обробник

  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="inside">
          <img className="logo" src={Logo} alt="Naomi Nation logo" />
          <h1>{t("welcomeMessage")}</h1>

          <p className="description">
            The Siamese cat is an elegant and vocal breed known for its slender
            body, blue almond-shaped eyes, and short coat with pointed
            coloration. The Oriental cat, a close relative, shares the Siamese’s
            sleek build but comes in a wide variety of colors and patterns.
          </p>

          <button className="cta" onClick={goToKittens}>
            {t("OurKittens")}
          </button>
        </div>
      </div>

      <img className="Cat"       src={WhiteCat}  alt="" />
      <img className="oriental"  src={Oriental}  alt="" />
    </div>
  );
}
