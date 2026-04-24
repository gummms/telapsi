import { useState, useEffect } from "react";
import T from "../../components/T";
import { useLanguage } from "../../context/LanguageContext";
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
  const { language } = useLanguage();
  const cleanGenre = (g) => g ? g.replace(/^\/+|\/+$/g, "").trim() : "";
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
          <h1><T>Guias didáticos</T></h1>
          <p><T>Guias didáticos que sobre como utilizar filmes na criação de aulas.</T></p>
        </div>
        {isAdmin && onAddNew && (
          <ButtonMain onClick={onAddNew} className="btn" id="btn-add-novo">
            <i>
              <Icones icone="fa-plus" />
            </i>
            <T>Adicionar Filme</T>
          </ButtonMain>
        )}
      </header>

      <div className="filmes-grid">
        {filmesFiltrados.length === 0 ? (
          <p><T>Nenhum filme encontrado.</T></p>
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
                        <T>Editar</T>
                      </ButtonMain>
                      <ButtonMain 
                        className="delete-opt" 
                        onClick={() => { setActiveMenu(null); setShowDeleteConfirm(filme); }}
                      >
                        <T>Excluir</T>
                      </ButtonMain>
                    </div>
                  )}
                </div>
              )}
              <div className="filme-capa">
                {filme.urlCapa ? (
                  <img src={filme.urlCapa} alt={filme.titulo} />
                ) : (
                  <div className="capa-placeholder"><T>Sem capa!</T></div>
                )}
              </div>

              <div className="filme-info">
                <h3>{language !== "pt" && filme.tituloOriginal ? filme.tituloOriginal : filme.titulo}</h3>
                <p className="filme-meta">
                  {filme.ano} • <T>{cleanGenre(filme.genero1)}</T>
                  {filme.genero2 && cleanGenre(filme.genero2) && <> • <T>{cleanGenre(filme.genero2)}</T></>} • {filme.duracao}min • <T>{filme.pais}</T>
                </p>

                <div className="filme-tags">
                  {filme.palavrasChave &&
                    filme.palavrasChave.map((tag) => (
                      <span key={tag} className="tag">
                        <T>{tag}</T>
                      </span>
                    ))}
                </div>

                <ButtonMain
                  className="btn-ficha"
                  onClick={() => setSelectedFilmeId(filme.id)}
                >
                  <T>Guia completo</T>
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
