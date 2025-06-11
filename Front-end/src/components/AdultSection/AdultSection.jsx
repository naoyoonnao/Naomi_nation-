import React from "react";
import { useTranslation }  from "react-i18next";
import Oriental            from "../../assets/Oriental.svg";
import Logo                from "../../assets/logo.svg";
import Adult            from "../../assets/Adult.png";
import "../MainSection/MainSection.scss";

export default function Main() {
  const { t } = useTranslation();

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
        </div>
      </div>
      <img className="oriental"  src={Oriental} alt="" />
      <img className="Cat"       src={Adult} alt="" />
    </div>
  );
}