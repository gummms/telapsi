import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Icones from "../../components/Icones";
import ButtonMain from "../../components/ButtonMain";

import "./FichaFilme.css";

const FichaFilme = ({ filmeId, onClose }) => {
  const { t } = useTranslation();
  const [filme, setFilme] = useState(null);
  const [cenas, setCenas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null);

  useEffect(() => {
    if (!filmeId) return;

    const fetchData = async () => {
      try {
        const docRef = doc(db, "filmes", filmeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFilme({ id: docSnap.id, ...docSnap.data() });

          const cenasRef = collection(db, "filmes", filmeId, "cenas");
          const cenasSnap = await getDocs(cenasRef);

          const cenasData = cenasSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          cenasData.sort((a, b) => a.minutagem.localeCompare(b.minutagem));

          setCenas(cenasData);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filmeId]);

  const handleOverlayClick = (e) => {
    if (e.target.className === "ficha-overlay") {
      onClose();
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const { current } = carouselRef;

      const scrollAmount = current.clientWidth;

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };
  if (loading) return null;
  if (!filme) return null;

  return (
    <div className="ficha-overlay" onClick={handleOverlayClick}>
      <div className="ficha-container">
        <div className="ficha-left">
          <header className="ficha-header">
            <div className="ficha-header-btns">
              <ButtonMain
                className="btn"
                id="btn-print"
                onClick={() => window.print()}
              >
                <i>
                  <Icones icone="fa-print" />
                </i>
                {t("movie_card.print")}
              </ButtonMain>
              <ButtonMain className="btn-close" onClick={onClose}>
                <i>
                  <Icones icone="fa-xmark" />
                </i>
              </ButtonMain>
            </div>
            <div className="header-content">
              <div className="poster-container">
                {filme.urlCapa ? (
                  <img src={filme.urlCapa} alt={filme.titulo} />
                ) : (
                  <div className="poster-placeholder">{t("movie_card.no_cover")}</div>
                )}
              </div>
              <div className="header-info">
                <div className="title-cenas">
                  <h1>{filme.titulo}</h1>
                  <div className="scene-counter">
                    {t("movie_card.total_scenes")}: {cenas.length}
                  </div>
                </div>
                <div className="meta-line">
                  <span>{filme.ano}</span> • <span>{filme.genero1}</span>
                  <span>{filme.genero2}</span> • <span>{filme.duracao}min</span>{" "}
                  • <span>{filme.pais}</span>
                </div>
                <p>
                  <strong>{t("movie_card.original_title")}:</strong> {filme.tituloOriginal}
                </p>
                <p>
                  <strong>{t("movie_card.direction")}:</strong> {filme.direcao}
                </p>
                <p>
                  <strong>{t("movie_card.cast")}:</strong>{" "}
                  {filme.elenco && Array.isArray(filme.elenco)
                    ? filme.elenco.join(", ")
                    : filme.elenco}
                </p>
                <p className="sinopse">
                  <strong>{t("movie_card.synopsis")}:</strong> {filme.sinopse}
                </p>
              </div>
            </div>
          </header>
        </div>

        {/* CAROUSEL WRAPPER */}
        <div className="carousel-wrapper">
          {cenas.length > 0 && (
            <>
              <ButtonMain
                className="nav-btn prev"
                onClick={() => scrollCarousel("left")}
              >
                <i>
                  <Icones icone="fa-chevron-left" />
                </i>
              </ButtonMain>
              <ButtonMain
                className="nav-btn next"
                onClick={() => scrollCarousel("right")}
              >
                <i>
                  <Icones icone="fa-chevron-right" />
                </i>
              </ButtonMain>
            </>
          )}

          <div className="cenas-carousel" ref={carouselRef}>
            {cenas.length === 0 ? (
              <p className="sem-cenas">
                {t("movie_card.no_cenas_yet")}
              </p>
            ) : (
              cenas.map((cena) => (
                <div key={cena.id} className="cena-slide">
                  <div className="slide-left">
                    <div className="cena-header">
                      <h2>{cena.titulo}</h2>
                      <span className="time-pill">{cena.minutagem}</span>
                    </div>

                    <p className="cena-descricao">{cena.descricao}</p>
                    <div className="block-amarelo">
                      <h4>{t("movie_card.teaching_tips")}</h4>
                      <p>{cena.dicaAula}</p>
                    </div>
                    <div className="block-azul">
                      <h4>{t("movie_card.related_themes")}</h4>
                      <div className="tags-cloud">
                        {Array.isArray(cena.temasRelacionados) ? (
                          cena.temasRelacionados.map((tema, index) => (
                            <span key={`tema-${index}`} className="tema-pill">
                              {tema}
                            </span>
                          ))
                        ) : typeof cena.temasRelacionados === "string" ? (
                          cena.temasRelacionados
                            .split(",")
                            .map((tema, index) => (
                              <span key={`tema-split-${index}`} className="tema-pill">
                                {tema.trim()}
                              </span>
                            ))
                        ) : (
                          <span className="tema-pill">{t("movie_card.no_themes")}</span>
                        )}
                      </div>
                    </div>
                    <div className="cena-keywords">
                      <div className="block-cinza">
                        <h4>{t("movie_card.keywords")}</h4>
                        <div className="keywords-cloud">
                          {cena.palavrasChave &&
                            cena.palavrasChave.map((kw, i) => (
                              <span key={i} className="keyword-pill">
                                {kw}{" "}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="slide-right">
                    <div className="cena-grid-details">
                      <div className="detail-box">
                        <h3>{t("movie_card.clinical_correlation")}</h3>
                        <p>{cena.correlacaoClinica}</p>
                      </div>

                      <div className="detail-box">
                        <h3>{t("movie_card.debate_questions")}</h3>
                        <ul>
                          {cena.questoesDebate &&
                            cena.questoesDebate.map((q, i) => (
                              <li key={i}>
                                {i + 1}. {q}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="detail-box">
                        <h3>{t("movie_card.comparison_points")}</h3>

                        <>
                          <p>
                            <strong>{t("movie_card.in_movie")}:</strong>{" "}
                            {cena.pontosComparacao.noFilme}
                          </p>
                          <p>
                            <strong>{t("movie_card.in_clinic")}:</strong>{" "}
                            {cena.pontosComparacao.naClinica}
                          </p>
                          <p>
                            <strong>{t("movie_card.conceptual_aspect")}:</strong>{" "}
                            {cena.pontosComparacao.aspectoConceitual}
                          </p>
                          <p>
                            <strong>{t("movie_card.narrative_observation")}:</strong>{" "}
                            {cena.pontosComparacao.observacaoNarrativa}
                          </p>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaFilme;
