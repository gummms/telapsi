import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ButtonMain from "../components/ButtonMain.jsx";
import heroDefault from "../assets/heroimg.jpg";
import "./Hero.css";

const Hero = () => {
  const { t } = useTranslation();
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
              {t("hero.title")} <span>{t("hero.title_highlight")}</span>.
            </h1>
          </div>
          <div className="hero-paragraph">
            <p>{t("hero.description")}</p>
          </div>
          <div className="hero-buttons">
            <ButtonMain path="#sobre" text={t("hero.about_button")} id="btn-sobre" />
          </div>
        </div>
        <img src={heroImg} alt={t("hero.hero_alt")} />
      </div>
    </section>
  );
};

export default Hero;
