import { useState, useEffect } from "react";
import T from "../../components/T";
import { db } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import Icones from "../../components/Icones";
import ButtonMain from "../../components/ButtonMain";

import "../filmes/FichaFilme.css";
import "./FichaAula.css";

const FichaAula = ({ aulaId, onClose }) => {
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
                  : "Filme desconhecido",
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
          let tituloFilme = "Filme Base";
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
  }, [aulaId]);

  const handleOverlayClick = (e) => {
    if (e.target.className === "ficha-overlay") onClose();
  };

  const renderTextWithLines = (text) => {
    if (!text) return "Não preenchido.";
    return text.split("\n").map((str, index) => (
      <span key={index}>
        <T>{str}</T>
        <br />
      </span>
    ));
  };

  const renderList = (items, type = "ul") => {
    if (typeof items === "string") return <p>{renderTextWithLines(items)}</p>;
    if (!items || !Array.isArray(items)) return <p>Não preenchido.</p>;
    const validItems = items.filter((item) => item && item.trim() !== "");
    if (validItems.length === 0) return <p>Não preenchido.</p>;

    const listStyle1 = { marginTop: ".5rem" };
    const listStyle2 = { padding: "0", marginLeft: "1rem", marginTop: ".5rem" };
    const liStyle1 = { marginLeft: "2rem" };
    const liStyle2 = { margin: "0", fontSize: "1rem", color: "var(--black)" };

    if (type === "ol") {
      return (
        <ol style={listStyle1}>
          {validItems.map((item, idx) => (
            <li key={idx} style={liStyle1}>
              <T>{item}</T>
            </li>
          ))}
        </ol>
      );
    }
    return (
      <ul style={listStyle2}>
        {validItems.map((item, idx) => (
          <li key={idx} style={liStyle2}>
            • <T>{item}</T>
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
              <h1><T>{aula.titulo}</T></h1>
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
            </div>
            <ButtonMain className="btn-close" onClick={onClose}>
              <i>
                <Icones icone="fa-xmark" />
              </i>
            </ButtonMain>
            <div className="aula-meta-grid">
              <div className="meta-item">
                <span className="label"><T>Público Alvo</T></span>
                <span className="value"><T>{aula.publico}</T></span>
              </div>
              <div className="meta-item">
                <span className="label"><T>Duração</T></span>
                <span className="value">{aula.duracao} min</span>
              </div>

              {aula.filmesIds && aula.filmesIds.length > 1 ? (
                <div className="meta-item">
                  <span className="label"><T>Mídias</T></span>
                  <span className="value"><T>Múltiplos Filmes</T></span>
                </div>
              ) : filmeDetalhes ? (
                <div className="meta-item">
                  <span className="label"><T>Filme Base</T></span>
                  <span className="value"><T>{filmeDetalhes.titulo}</T></span>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="aula-body">
          <section className="aula-section">
            <h3>
              <i className="fa fa-bullseye"></i> <T>Objetivos Gerais</T>
            </h3>
            <div className="text-block-content">
              {renderList(aula.objetivos, "ul")}
            </div>
          </section>

          <section className="aula-section">
            <h3><T>Roteiro Metodológico</T></h3>

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
                        {idx + 1}. <T>{etapa.titulo}</T>{" "}
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
                            • <T>{t}</T>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontStyle: "italic", color: "#888" }}>
                        Sem tópicos descritos.
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="method-step">
                <h4><T>Roteiro Metodológico</T></h4>
                <p>{renderTextWithLines(aula.metodologia?.introducao)}</p>
                <p>{renderTextWithLines(aula.metodologia?.exibicao)}</p>
                <p>{renderTextWithLines(aula.metodologia?.atividade)}</p>
                <p>{renderTextWithLines(aula.metodologia?.fechamento)}</p>
              </div>
            )}

            {cenasDetalhadas.length > 0 && (
              <div className="embedded-cenas">
                <h5>
                  <i className="fa fa-film"></i> <T>Cenas Selecionadas para Exibição:</T>
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
                        <T>{cena.nomeFilme}</T>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="time">{cena.minutagem}</span>
                        <strong><T>{cena.titulo}</T></strong>
                      </div>
                      <p className="cena-desc-mini"><T>{cena.descricao}</T></p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {aula.dinamica && (
            <section className="sidebar-card">
              <h3>
                <i className="fa fa-users"></i> <T>Dinâmica Sugerida</T>
              </h3>
              <div className="method-step">
                <p>{renderTextWithLines(aula.dinamica)}</p>
              </div>
            </section>
          )}

          <section className="sidebar-card">
            <h3>
              <i className="fa fa-question-circle"></i> <T>Perguntas-guia</T>
            </h3>
            <div className="method-step">
              {renderList(aula.perguntasGuia, "ol")}
            </div>
          </section>

          <div className="sidebar-card">
            <h3><T>Handout / Resumo Técnico</T></h3>
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
