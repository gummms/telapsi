import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import T from "../components/T";
import Icones from "../components/Icones";
import ButtonMain from "../components/ButtonMain";

import "./NavBar.css";

const NavBar = () => {
  const { language, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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
            <T>Início</T>
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="#catalogo" className="btn" id="btn-nav" onClick={closeMenu}>
            <T>Guias Didáticos</T>
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="#planejamento" className="btn" id="btn-nav" onClick={closeMenu}>
            <T>Planos de Aula</T>
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="#sobre" className="btn" id="btn-nav" onClick={closeMenu}>
            <T>Sobre</T>
          </ButtonMain>
        </li>
        <li>
          <ButtonMain path="/professor" className="btn" id="btn-login" onClick={closeMenu}>
            <T>ÁREA DIDÁTICA</T>
          </ButtonMain>
        </li>
        <li className={`lang-switcher ${language === "en" ? "en-active" : "pt-active"}`}>
          <ButtonMain
            onClick={() => { changeLanguage("pt"); closeMenu(); }}
            className={`lang-btn ${language === "pt" ? "active" : ""}`}
            aria-label="Português (Brasil)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="28" height="20" style={{borderRadius:"3px",display:"block"}}>
              <rect width="28" height="20" fill="#009B3A"/>
              <polygon points="14,2 26,10 14,18 2,10" fill="#FEDF00"/>
              <circle cx="14" cy="10" r="4.5" fill="#002776"/>
              <path d="M9.7 9.2 Q14 7.2 18.3 9.2" stroke="white" strokeWidth="1.1" fill="none"/>
            </svg>
          </ButtonMain>
          <ButtonMain
            onClick={() => { changeLanguage("en"); closeMenu(); }}
            className={`lang-btn ${language === "en" ? "active" : ""}`}
            aria-label="English (US)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" width="28" height="20" style={{borderRadius:"3px",display:"block"}}>
              <rect width="28" height="20" fill="#B22234"/>
              <rect y="1.54" width="28" height="1.54" fill="white"/>
              <rect y="4.62" width="28" height="1.54" fill="white"/>
              <rect y="7.69" width="28" height="1.54" fill="white"/>
              <rect y="10.77" width="28" height="1.54" fill="white"/>
              <rect y="13.85" width="28" height="1.54" fill="white"/>
              <rect y="16.92" width="28" height="1.54" fill="white"/>
              <rect width="11.2" height="10.77" fill="#3C3B6E"/>
              <g fill="white">
                <circle cx="1.4" cy="1.35" r="0.7"/><circle cx="2.8" cy="2.69" r="0.7"/>
                <circle cx="4.2" cy="1.35" r="0.7"/><circle cx="5.6" cy="2.69" r="0.7"/>
                <circle cx="7.0" cy="1.35" r="0.7"/><circle cx="8.4" cy="2.69" r="0.7"/>
                <circle cx="9.8" cy="1.35" r="0.7"/>
                <circle cx="1.4" cy="4.04" r="0.7"/><circle cx="2.8" cy="5.38" r="0.7"/>
                <circle cx="4.2" cy="4.04" r="0.7"/><circle cx="5.6" cy="5.38" r="0.7"/>
                <circle cx="7.0" cy="4.04" r="0.7"/><circle cx="8.4" cy="5.38" r="0.7"/>
                <circle cx="9.8" cy="4.04" r="0.7"/>
                <circle cx="1.4" cy="6.73" r="0.7"/><circle cx="2.8" cy="8.08" r="0.7"/>
                <circle cx="4.2" cy="6.73" r="0.7"/><circle cx="5.6" cy="8.08" r="0.7"/>
                <circle cx="7.0" cy="6.73" r="0.7"/><circle cx="8.4" cy="8.08" r="0.7"/>
                <circle cx="9.8" cy="6.73" r="0.7"/>
              </g>
            </svg>
          </ButtonMain>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
