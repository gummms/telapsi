import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Icones from "../components/Icones";
import "./Sobre.css";

const Sobre = () => {
  const { t } = useTranslation();

  return (
    <section id="sobre">
      <div className="sobre">
        <div className="sobre-text">
          <div className="sobre-title">
            <h2>{t("about.title")}</h2>
          </div>
          <div className="sobre-paragraph">
            <p>{t("about.description")}</p>
          </div>
          <div className="sobre-btn">
            <Link to="/professor" className="btn" id="btn-main">
              {t("about.learn_more")}
            </Link>
          </div>
        </div>
        <div className="sobre-extra">
          <div className="extra">
            <i className="extra-icon">
              <Icones icone="fa-scale-balanced" />
            </i>
            <div className="extra-text">
              <h3>{t("about.ethical_guidelines")}</h3>
              <p>{t("about.ethical_description")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
