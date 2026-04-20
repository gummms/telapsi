import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../services/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";

import FichaAula from "../tools/aulas/FichaAula";
import Icones from "../components/Icones";
import Spinner from "../components/Spinner";

import "../tools/aulas/AulasLista.css";
import "../tools/Content.css";
import "../components/Buttons.css";
import "./Planejamento.css";

const Planejamento = () => {
  const { t } = useTranslation();
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAulaId, setSelectedAulaId] = useState(null);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const q = query(collection(db, "aulas"));
        const querySnapshot = await getDocs(q);

        const aulasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffled = aulasData.sort(() => 0.5 - Math.random());
        const randomAulas = shuffled.slice(0, 8);

        setAulas(randomAulas);
      } catch (error) {
        console.error("Erro ao buscar aulas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAulas();
  }, []);

  return (
    <section id="planejamento">
      <div className="tool-header-publico">
        <h2>{t("planning.title")}</h2>
        <a href="/professor" className="link-completo">
          <span>{t("planning.view_all")}</span>
        </a>
      </div>
      <div className="planejamento">
        {loading ? (
          <Spinner />
        ) : (
          <div className="cards-grid-horizontal">
            {aulas.length === 0 ? (
              <div className="empty-state-box">
                <p>{t("planning.no_plans")}</p>
              </div>
            ) : (
              aulas.map((aula) => (
                <div key={aula.id} className="aula-card">
                  <div className="aula-info">
                    <div className="tags-row">
                      <span
                        className="tag"
                        id={
                          `${aula.duracao}` === "50"
                            ? "tag-50"
                            : `${aula.duracao}` === "90"
                            ? "tag-90"
                            : "tag-30"
                        }
                      >
                        {aula.duracao} {t("planning.duration_suffix")}
                      </span>
                      <span
                        className="tag"
                        id={
                          `${aula.publico}` === "Residentes"
                            ? "tag-residentes"
                            : `${aula.publico}` === "Acadêmicos"
                            ? "tag-academicos"
                            : "tag-profissionais"
                        }
                      >
                        {aula.publico}
                      </span>
                    </div>

                    <h3 className="aula-card-titulo">{aula.titulo}</h3>

                    {aula.filmeTitulo ? (
                      <p className="aula-card-filme-public">
                        <i className="aula-card-filme-icon">
                          <Icones icone="fa fa-film" />
                        </i>
                        {aula.filmeTitulo}
                      </p>
                    ) : (
                      <p className="aula-card-filme-vazio">{t("planning.no_movie")}</p>
                    )}
                    <div className="aula-card-actions">
                      <button
                        className="btn-ficha"
                        onClick={() => setSelectedAulaId(aula.id)}
                      >
                        {t("planning.view_plan")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedAulaId && (
          <FichaAula
            aulaId={selectedAulaId}
            onClose={() => setSelectedAulaId(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Planejamento;
