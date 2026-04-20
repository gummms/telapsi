import NavBar from "../sections/NavBar";
import Hero from "../sections/Hero";
import Sobre from "../sections/Sobre";
import Catalogo from "../sections/Catalogo";
import Planejamento from "../sections/Planejamento";
import FAQ from "../sections/FAQ";
import Footer from "../sections/Footer";

import "./Landpage.css";

const Landpage = () => {
  return (
    <>
      <div className="landpage">
        <NavBar />
        <Hero />
        <div className="container">
          <Catalogo />
          <Sobre />
          <Planejamento />
          <FAQ />
        </div>
        <>
          <Footer />
        </>
      </div>
    </>
  );
};

export default Landpage;
