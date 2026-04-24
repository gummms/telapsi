import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/useAuth";
import T from "../components/T";
import Icones from "../components/Icones";
import ButtonMain from "../components/ButtonMain";

import "./Menu.css";
import "../components/Buttons.css";

const Menu = ({ isOpen, toggleMenu, onClose }) => {
  const { language, changeLanguage } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate("/");
  };

  const handleChangeLang = (lang) => {
    changeLanguage(lang);
    onClose();
  };

  return (
    <nav className="menu-navbar">
      <div className="menu-navbar-container">
        <div className="menu-brand">
          <h2>
            <ButtonMain path="/" className="btn" id="btn-nav-icon" onClick={onClose}>
              Telapsi
            </ButtonMain>
          </h2>
          <span className="menu-subtitle"><T>Área didática</T></span>
        </div>

        <ButtonMain className="menu-toggle-btn" onClick={toggleMenu}>
          <i>
            <Icones icone={isOpen ? "fa-xmark" : "fa-bars"} />
          </i>
        </ButtonMain>

        <ul className={isOpen ? "menu-links open" : "menu-links"}>
          <li className={`lang-switcher ${language === "en" ? "en-active" : "pt-active"}`}>
            <ButtonMain
              onClick={() => handleChangeLang("pt")}
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
              onClick={() => handleChangeLang("en")}
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
          <li>
            <ButtonMain onClick={handleLogout} className="btn" id="btn-logout">
              <i>
                <Icones icone="fa-right-from-bracket" />
              </i>
              <T>Sair</T>
            </ButtonMain>
          </li>
        </ul>
      </div>
      {/* Overlay for mobile */}
      {isOpen && <div className="menu-overlay" onClick={onClose}></div>}
    </nav>
  );
};

export default Menu;
