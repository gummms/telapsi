import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../services/firebaseConfig";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";

import FichaFilme from "./FichaFilme";
import Spinner from "../../components/Spinner";
import Icones from "../../components/Icones";
import ButtonMain from "../../components/ButtonMain";

import "./CatalogoFilmes.css";
import "../Content.css";
import "../../components/Buttons.css";

const CatalogoFilmes = ({ onAddNew, onEdit }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.isAdmin === true;

  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilmeId, setSelectedFilmeId] = useState(null);
  
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "filmes"), orderBy("titulo"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filmesData = [];
      querySnapshot.forEach((doc) => {
        filmesData.push({ id: doc.id, ...doc.data() });
      });
      setFilmes(filmesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "filmes", id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Erro ao deletar filme:", error);
    }
  };

  const filmesFiltrados = filmes;

  if (loading) return <Spinner />;

  return (
    <div className="catalogo-container">
      <header className="tool-header">
        <div className="header-texts">
          <h1>{t("guides.title")}</h1>
          <p>{t("guides.description")}</p>
        </div>
        {isAdmin && onAddNew && (
          <ButtonMain onClick={onAddNew} className="btn" id="btn-add-novo">
            <i>
              <Icones icone="fa-plus" />
            </i>
            {t("guides.add_movie")}
          </ButtonMain>
        )}
      </header>

      <div className="filmes-grid">
        {filmesFiltrados.length === 0 ? (
          <p>{t("guides.no_movies")}</p>
        ) : (
          filmesFiltrados.map((filme) => (
            <div key={filme.id} className="filme-card">
              {isAdmin && (
                <div className="admin-actions">
                  <ButtonMain 
                    className="dot-menu-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === filme.id ? null : filme.id);
                    }}
                  >
                    <i>
                      <Icones icone="fa-ellipsis-v" />
                    </i>
                  </ButtonMain>
                  {activeMenu === filme.id && (
                    <div className="admin-dropdown">
                      <ButtonMain onClick={() => { setActiveMenu(null); onEdit(filme); }}>
                        {t("guides.edit")}
                      </ButtonMain>
                      <ButtonMain 
                        className="delete-opt" 
                        onClick={() => { setActiveMenu(null); setShowDeleteConfirm(filme); }}
                      >
                        {t("guides.delete")}
                      </ButtonMain>
                    </div>
                  )}
                </div>
              )}
              <div className="filme-capa">
                {filme.urlCapa ? (
                  <img src={filme.urlCapa} alt={filme.titulo} />
                ) : (
                  <div className="capa-placeholder">{t("guides.no_cover")}</div>
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

                <ButtonMain
                  className="btn-ficha"
                  onClick={() => setSelectedFilmeId(filme.id)}
                >
                  {t("guides.full_guide")}
                </ButtonMain>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Você realmente quer excluír o guia didático de <strong>{showDeleteConfirm.titulo}</strong>? Esta ação é permanente.
            </p>
            <div className="modal-actions">
              <ButtonMain className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                VOLTAR
              </ButtonMain>
              <ButtonMain className="btn-danger" onClick={() => handleDelete(showDeleteConfirm.id)}>
                EXCLUIR
              </ButtonMain>
            </div>
          </div>
        </div>
      )}

      {selectedFilmeId && (
        <FichaFilme
          filmeId={selectedFilmeId}
          onClose={() => setSelectedFilmeId(null)}
        />
      )}
    </div>
  );
};

export default CatalogoFilmes;
