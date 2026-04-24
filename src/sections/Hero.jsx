import { useState, useEffect } from "react";
import T from "../components/T";
import ButtonMain from "../components/ButtonMain.jsx";
import heroDefault from "../assets/heroimg.jpg";
import "./Hero.css";

const Hero = () => {
  const [heroImg, setHeroImg] = useState(heroDefault);

  useEffect(() => {
    const images = [
      heroDefault,
      "https://film-grab.com/wp-content/uploads/photo-gallery/47%20(897).jpg?bwg=1547384614",
      "https://film-grab.com/wp-content/uploads/photo-gallery/61%20(273).jpg?bwg=1547211308",
      "https://film-grab.com/wp-content/uploads/photo-gallery/Perfect_Blue_029.jpg?bwg=1569600821",
      "https://film-grab.com/wp-content/uploads/photo-gallery/02%20(154).jpg?bwg=1547150748",
      "https://film-grab.com/wp-content/uploads/photo-gallery/02%20(154).jpg?bwg=1547150748"
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    setHeroImg(images[randomIndex]);
  }, []);

  return (
    <section id="hero">
      <div className="hero">
        <div className="hero-text">
          <div className="hero-title">
            <h1>
              <T>Use o cinema para ensinar sobre</T> <span><T>esquizofrenia</T></span>.
            </h1>
          </div>
          <div className="hero-paragraph">
            <p><T>O Telapsi é uma plataforma acadêmica feita para apoiar docentes na criação de aulas com auxílio de filmes.</T></p>
          </div>
          <div className="hero-buttons">
            <ButtonMain path="#sobre" id="btn-sobre">
              <T>Sobre o Telapsi</T>
            </ButtonMain>
          </div>
        </div>
        <img src={heroImg} alt="Cena de um filme" />
      </div>
    </section>
  );
};

export default Hero;
