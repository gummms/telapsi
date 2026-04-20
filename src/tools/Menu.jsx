import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/useAuth";
import Icones from "../components/Icones";
import ButtonMain from "../components/ButtonMain";

import "./Menu.css";
import "../components/Buttons.css";

const Menu = ({ isOpen, toggleMenu, onClose }) => {
  const { t, i18n } = useTranslation();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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
          <span className="menu-subtitle">{t("menu.educational_area")}</span>
        </div>

        <ButtonMain className="menu-toggle-btn" onClick={toggleMenu}>
          <i>
            <Icones icone={isOpen ? "fa-xmark" : "fa-bars"} />
          </i>
        </ButtonMain>

        <ul className={isOpen ? "menu-links open" : "menu-links"}>
          <li className={`lang-switcher ${i18n.language === 'en' ? 'en-active' : 'pt-active'}`}>
            <ButtonMain 
              onClick={() => changeLanguage("pt")} 
              className={`lang-btn ${i18n.language === 'pt' ? 'active' : ''}`}
            >
              PT
            </ButtonMain>
            <ButtonMain 
              onClick={() => changeLanguage("en")} 
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            >
              EN
            </ButtonMain>
          </li>
          <li>
            <ButtonMain onClick={handleLogout} className="btn" id="btn-logout">
              <i>
                <Icones icone="fa-right-from-bracket" />
              </i>
              {t("menu.logout")}
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
