import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icones from "../components/Icones";
import ButtonMain from "../components/ButtonMain";

import "./NavBar.css";

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h2>
        <ButtonMain path="/" className="btn" id="btn-nav-icon" onClick={closeMenu}>
          Telapsi
        </ButtonMain>
      </h2>

      <ButtonMain className="menu-toggle" onClick={toggleMenu}>
        <i>
          <Icones icone={isMenuOpen ? "fa-xmark" : "fa-bars"} />
        </i>
      </ButtonMain>

      <ul className={isMenuOpen ? "nav-links open" : "nav-links"}>
        <li>
          <ButtonMain path="/" className="btn" id="btn-nav" onClick={closeMenu}>
            {t("navbar.start")}
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="#catalogo" className="btn" id="btn-nav" onClick={closeMenu}>
            {t("navbar.guides")}
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="#sobre" className="btn" id="btn-nav" onClick={closeMenu}>
            {t("navbar.about")}
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="#planejamento" className="btn" id="btn-nav" onClick={closeMenu}>
            {t("navbar.lesson_plans")}
          </ButtonMain>
        </li>

        <li>
          <ButtonMain path="/professor" className="btn" id="btn-login" onClick={closeMenu}>
            {t("navbar.educational_area")}
          </ButtonMain>
        </li>
        <li className={`lang-switcher ${i18n.language === 'en' ? 'en-active' : 'pt-active'}`}>
          <ButtonMain 
            onClick={() => { changeLanguage("pt"); closeMenu(); }} 
            className={`lang-btn ${i18n.language === 'pt' ? 'active' : ''}`}
          >
            PT
          </ButtonMain>
          <ButtonMain 
            onClick={() => { changeLanguage("en"); closeMenu(); }} 
            className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
          >
            EN
          </ButtonMain>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
