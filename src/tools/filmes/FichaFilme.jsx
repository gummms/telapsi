import { useState, useEffect, useRef } from "react";
import T from "../../components/T";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../services/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Icones from "../../components/Icones";
import ButtonMain from "../../components/ButtonMain";

import "./FichaFilme.css";

const FichaFilme = ({ filmeId, onClose }) => {
  const { language } = useLanguage();
  const cleanGenre = (g) => g ? g.replace(/^\/+|\/+$/g, "").trim() : "";
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
                <T>Imprimir / PDF</T>
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
                  <div className="poster-placeholder"><T>Sem imagem</T></div>
                )}
              </div>
              <div className="header-info">
                <div className="title-cenas">
                  <h1>{language !== "pt" && (filme.tituloOriginal || filme.titulo_en) ? (filme.tituloOriginal || filme.titulo_en) : (filme.titulo || filme.titulo_pt)}</h1>
                  <div className="scene-counter">
                    <T>Total de cenas</T>: {cenas.length}
                  </div>
                </div>
                <div className="meta-line">
                  <span>{filme.ano}</span> • <span><T>{cleanGenre(filme.genero1)}</T></span>
                  {filme.genero2 && cleanGenre(filme.genero2) && <><span> • </span><span><T>{cleanGenre(filme.genero2)}</T></span></>} • <span>{filme.duracao}min</span>{" "}
                  • <span><T>{filme.pais}</T></span>
                </div>
                <p>
                   <strong><T>Título original</T>:</strong> {filme.tituloOriginal || filme.titulo_en || filme.titulo}
                </p>
                <p>
                   <strong><T>Direção</T>:</strong> <T>{filme.direcao}</T>
                </p>
                <p>
                   <strong><T>Elenco</T>:</strong>{" "}
                  <T>{filme.elenco && Array.isArray(filme.elenco)
                    ? filme.elenco.join(", ")
                    : filme.elenco}</T>
                </p>
                <p className="sinopse">
                   <strong><T>Sinopse</T>:</strong> <T>{filme.sinopse || filme.sinopse_pt || ""}</T>
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
                <T>Nenhuma cena cadastrada para este filme ainda.</T>
              </p>
            ) : (
              cenas.map((cena) => (
                <div key={cena.id} className="cena-slide">
                  <div className="slide-left">
                    <div className="cena-header">
                      <h2><T>{cena.titulo}</T></h2>
                      <span className="time-pill">{cena.minutagem}</span>
                    </div>

                    <p className="cena-descricao"><T>{cena.descricao}</T></p>
                    <div className="block-amarelo">
                      <h4><T>Dicas de aula</T></h4>
                      <p><T>{cena.dicaAula}</T></p>
                    </div>
                    <div className="block-azul">
                      <h4><T>Temas relacionados</T></h4>
                      <div className="tags-cloud">
                        {Array.isArray(cena.temasRelacionados) ? (
                          cena.temasRelacionados.map((tema, index) => (
                            <span key={`tema-${index}`} className="tema-pill">
                              <T>{tema}</T>
                            </span>
                          ))
                        ) : typeof cena.temasRelacionados === "string" ? (
                          cena.temasRelacionados
                            .split(",")
                            .map((tema, index) => (
                              <span key={`tema-split-${index}`} className="tema-pill">
                                <T>{tema.trim()}</T>
                              </span>
                            ))
                        ) : (
                          <span className="tema-pill"><T>Sem temas</T></span>
                        )}
                      </div>
                    </div>
                    <div className="cena-keywords">
                      <div className="block-cinza">
                        <h4><T>Palavras-chave</T></h4>
                        <div className="keywords-cloud">
                          {cena.palavrasChave &&
                            cena.palavrasChave.map((kw, i) => (
                              <span key={i} className="keyword-pill">
                                <T>{kw}</T>{" "}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="slide-right">
                    <div className="cena-grid-details">
                      <div className="detail-box">
                        <h3><T>Correlação clínica</T></h3>
                        <p><T>{cena.correlacaoClinica}</T></p>
                      </div>

                      <div className="detail-box">
                        <h3><T>Questões para debate</T></h3>
                        <ul>
                          {cena.questoesDebate &&
                            cena.questoesDebate.map((q, i) => (
                              <li key={i}>
                                {i + 1}. <T>{q}</T>
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="detail-box">
                        <h3><T>Pontos de comparação</T></h3>

                        <>
                          <p>
                            <strong><T>No filme</T>:</strong>{" "}
                            <T>{cena.pontosComparacao.noFilme}</T>
                          </p>
                          <p>
                            <strong><T>Na clínica</T>:</strong>{" "}
                            <T>{cena.pontosComparacao.naClinica}</T>
                          </p>
                          <p>
                            <strong><T>Aspecto conceitual</T>:</strong>{" "}
                            <T>{cena.pontosComparacao.aspectoConceitual}</T>
                          </p>
                          <p>
                            <strong><T>Observação narrativa</T>:</strong>{" "}
                            <T>{cena.pontosComparacao.observacaoNarrativa}</T>
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
