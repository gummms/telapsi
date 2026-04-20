import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../services/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";

import FichaFilme from "../tools/filmes/FichaFilme";
import Spinner from "../components/Spinner";

import "./Catalogo.css";

const Catalogo = () => {
  const { t } = useTranslation();
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilmeId, setSelectedFilmeId] = useState(null);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const q = query(collection(db, "filmes"));
        const querySnapshot = await getDocs(q);

        const filmesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffled = filmesData.sort(() => 0.5 - Math.random());
        const randomFilmes = shuffled.slice(0, 8);

        setFilmes(randomFilmes);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilmes();
  }, []);

  return (
    <section id="catalogo" className="catalogo-publico-section">
      <div className="catalogo-container">
        <div className="tool-header-publico">
          <h2>{t("catalogo.title")}</h2>
          <a href="/professor" className="link-completo">
            <span>{t("catalogo.view_all")}</span>
          </a>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="cards-grid-horizontal">
            {filmes.map((filme) => (
              <div key={filme.id} className="filme-card">
                <div className="filme-capa">
                  {filme.urlCapa ? (
                    <img src={filme.urlCapa} alt={filme.titulo} />
                  ) : (
                    <div className="capa-placeholder">{t("catalogo.no_cover")}</div>
                  )}
                </div>

                <div className="filme-info">
                  <h3>{filme.titulo}</h3>
                  <p className="filme-meta">
                    {filme.ano} • {filme.genero1}
                    {filme.genero2} • {filme.duracao}min • {filme.pais}
                  </p>

                  <div className="filme-tags">
                    {filme.palavrasChave &&
                      filme.palavrasChave.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                  </div>

                  <button
                    className="btn-ficha"
                    onClick={() => setSelectedFilmeId(filme.id)}
                  >
                    {t("catalogo.full_guide")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFilmeId && (
        <FichaFilme
          filmeId={selectedFilmeId}
          onClose={() => setSelectedFilmeId(null)}
        />
      )}
    </section>
  );
};

export default Catalogo;
