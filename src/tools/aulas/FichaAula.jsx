import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import Icones from "../../components/Icones";
import ButtonMain from "../../components/ButtonMain";

import "../filmes/FichaFilme.css";
import "./FichaAula.css";

const FichaAula = ({ aulaId, onClose }) => {
  const { t } = useTranslation();
  const [aula, setAula] = useState(null);
  const [filmeDetalhes, setFilmeDetalhes] = useState(null);
  const [cenasDetalhadas, setCenasDetalhadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aulaSnap = await getDoc(doc(db, "aulas", aulaId));
        if (!aulaSnap.exists()) return;
        const aulaData = aulaSnap.data();
        setAula(aulaData);

        let cenasRicas = [];

        if (
          aulaData.cenas &&
          Array.isArray(aulaData.cenas) &&
          aulaData.cenas.length > 0
        ) {
          const promessas = aulaData.cenas.map(async (item) => {
            const cenaSnap = await getDoc(
              doc(db, "filmes", item.filmeId, "cenas", item.cenaId)
            );
            const filmeSnap = await getDoc(doc(db, "filmes", item.filmeId));

            if (cenaSnap.exists()) {
              return {
                ...cenaSnap.data(),
                nomeFilme: filmeSnap.exists()
                  ? filmeSnap.data().titulo
                  : t("lesson_sheet.unknown_movie"),
              };
            }
            return null;
          });

          const resultados = await Promise.all(promessas);
          cenasRicas = resultados.filter((r) => r !== null);
        } else if (
          aulaData.filmeId &&
          aulaData.cenasIds &&
          aulaData.cenasIds.length > 0
        ) {
          const fSnap = await getDoc(doc(db, "filmes", aulaData.filmeId));
          let tituloFilme = t("lesson_sheet.base_movie");
          if (fSnap.exists()) {
            setFilmeDetalhes(fSnap.data());
            tituloFilme = fSnap.data().titulo;
          }

          const promessasCenas = aulaData.cenasIds.map((cId) =>
            getDoc(doc(db, "filmes", aulaData.filmeId, "cenas", cId))
          );
          const cenasSnaps = await Promise.all(promessasCenas);

          cenasRicas = cenasSnaps
            .filter((s) => s.exists())
            .map((s) => ({
              ...s.data(),
              nomeFilme: tituloFilme,
            }));
        }

        cenasRicas.sort((a, b) => (a.minutagem || "").localeCompare(b.minutagem || ""));
        setCenasDetalhadas(cenasRicas);
      } catch (err) {
        console.error("Erro ao buscar dados da aula:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [aulaId, t]);

  const handleOverlayClick = (e) => {
    if (e.target.className === "ficha-overlay") onClose();
  };

  const renderTextWithLines = (text) => {
    if (!text) return t("lesson_sheet.not_filled");
    return text.split("\n").map((str, index) => (
      <span key={index}>
        {str}
        <br />
      </span>
    ));
  };

  const renderList = (items, type = "ul") => {
    if (typeof items === "string") return <p>{renderTextWithLines(items)}</p>;
    if (!items || !Array.isArray(items)) return <p>{t("lesson_sheet.not_filled")}</p>;
    const validItems = items.filter((item) => item && item.trim() !== "");
    if (validItems.length === 0) return <p>{t("lesson_sheet.not_filled")}</p>;

    const listStyle1 = { marginTop: ".5rem" };
    const listStyle2 = { padding: "0", marginLeft: "1rem", marginTop: ".5rem" };
    const liStyle1 = { marginLeft: "2rem" };
    const liStyle2 = { margin: "0", fontSize: "1rem", color: "var(--black)" };

    if (type === "ol") {
      return (
        <ol style={listStyle1}>
          {validItems.map((item, idx) => (
            <li key={idx} style={liStyle1}>
              {item}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <ul style={listStyle2}>
        {validItems.map((item, idx) => (
          <li key={idx} style={liStyle2}>
            • {item}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) return null;
  if (!aula) return null;

  const isMetodologiaArray = Array.isArray(aula.metodologia);

  return (
    <div className="ficha-overlay" onClick={handleOverlayClick}>
      <div className="ficha-container aula-container-width">
        <header className="ficha-header header-aula">
          <div className="aula-header-content">
            <div className="title-pdf">
              <h1>{aula.titulo}</h1>
              <ButtonMain
                className="btn"
                id="btn-print"
                onClick={() => window.print()}
              >
                <i>
                  <Icones icone="fa-print" />
                </i>
                {t("lesson_sheet.print")}
              </ButtonMain>
            </div>
            <ButtonMain className="btn-close" onClick={onClose}>
              <i>
                <Icones icone="fa-xmark" />
              </i>
            </ButtonMain>
            <div className="aula-meta-grid">
              <div className="meta-item">
                <span className="label">{t("lesson_sheet.audience")}</span>
                <span className="value">{aula.publico}</span>
              </div>
              <div className="meta-item">
                <span className="label">{t("lesson_sheet.duration")}</span>
                <span className="value">{aula.duracao} min</span>
              </div>

              {aula.filmesIds && aula.filmesIds.length > 1 ? (
                <div className="meta-item">
                  <span className="label">{t("lesson_sheet.medias")}</span>
                  <span className="value">{t("lesson_sheet.multi_movies")}</span>
                </div>
              ) : filmeDetalhes ? (
                <div className="meta-item">
                  <span className="label">{t("lesson_sheet.base_movie")}</span>
                  <span className="value">{filmeDetalhes.titulo}</span>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="aula-body">
          <section className="aula-section">
            <h3>
              <i className="fa fa-bullseye"></i> {t("lesson_sheet.objectives")}
            </h3>
            <div className="text-block-content">
              {renderList(aula.objetivos, "ul")}
            </div>
          </section>

          <section className="aula-section">
            <h3>{t("lesson_sheet.methodology")}</h3>

            {isMetodologiaArray ? (
              aula.metodologia.map((etapa, idx) => {
                if (!etapa.titulo) return null;
                const topicosValidos = etapa.topicos.filter(
                  (t) => t && t.trim() !== ""
                );

                return (
                  <div className="method-step" key={idx}>
                    <div className="title-time">
                      <h4>
                        {idx + 1}. {etapa.titulo}{" "}
                      </h4>
                      <h4 id="time">
                        {" "}
                        {etapa.duracao && `${etapa.duracao} min`}
                      </h4>
                    </div>
                    {topicosValidos.length > 0 ? (
                      <ul style={{ paddingLeft: "1rem", marginTop: ".2rem" }}>
                        {topicosValidos.map((t, i) => (
                          <li key={i} style={{ color: "var(--grayparagraph)" }}>
                            • {t}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontStyle: "italic", color: "#888" }}>
                        {t("lesson_sheet.no_topics")}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="method-step">
                <h4>{t("lesson_sheet.methodology")}</h4>
                <p>{renderTextWithLines(aula.metodologia?.introducao)}</p>
                <p>{renderTextWithLines(aula.metodologia?.exibicao)}</p>
                <p>{renderTextWithLines(aula.metodologia?.atividade)}</p>
                <p>{renderTextWithLines(aula.metodologia?.fechamento)}</p>
              </div>
            )}

            {cenasDetalhadas.length > 0 && (
              <div className="embedded-cenas">
                <h5>
                  <i className="fa fa-film"></i> {t("lesson_sheet.selected_scenes")}
                </h5>
                <ul>
                  {cenasDetalhadas.map((cena, idx) => (
                    <li key={idx}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          color: "#666",
                          marginBottom: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        {cena.nomeFilme}
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="time">{cena.minutagem}</span>
                        <strong>{cena.titulo}</strong>
                      </div>
                      <p className="cena-desc-mini">{cena.descricao}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {aula.dinamica && (
            <section className="sidebar-card">
              <h3>
                <i className="fa fa-users"></i> {t("lesson_sheet.suggested_dynamics")}
              </h3>
              <div className="method-step">
                <p>{renderTextWithLines(aula.dinamica)}</p>
              </div>
            </section>
          )}

          <section className="sidebar-card">
            <h3>
              <i className="fa fa-question-circle"></i> {t("lesson_sheet.guide_questions")}
            </h3>
            <div className="method-step">
              {renderList(aula.perguntasGuia, "ol")}
            </div>
          </section>

          <div className="sidebar-card">
            <h3>{t("lesson_sheet.technical_summary")}</h3>
            <div className="tech-note">
              {renderList(aula.resumoTecnico, "ul")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichaAula;
