import { useState } from "react";
import Menu from "../tools/Menu";
import Content from "../tools/Content";
import Footer from "../sections/Footer";
import Icones from "../components/Icones";

import "./Professor.css";

const Professor = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="professor">
      <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} onClose={() => setIsMenuOpen(false)} />
      
      <main className="professor-main">
        <div className="professor-container">
          <Content />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Professor;
