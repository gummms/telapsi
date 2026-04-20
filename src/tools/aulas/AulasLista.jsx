import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../services/firebaseConfig";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";

import FichaAula from "./FichaAula";
import Icones from "../../components/Icones";
import Spinner from "../../components/Spinner";
import ButtonMain from "../../components/ButtonMain";

import "./AulasLista.css";
import "../Content.css";
import "../../components/Buttons.css";

const AulasLista = ({ onCreateNew, onEdit }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.isAdmin === true;

  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAulaId, setSelectedAulaId] = useState(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "aulas"),
      where("ownerId", "==", "admin-default")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const aulasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAulas(aulasData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const aulasAgrupadas = useMemo(() => {
    const grupos = {};
    aulas.forEach((aula) => {
      const titulo = aula.titulo || t("lessons.untitled");
      if (!grupos[titulo]) {
        grupos[titulo] = [];
      }
      grupos[titulo].push(aula);
    });
    return grupos;
  }, [aulas, t]);

  const handleDelete = async (items) => {
    try {
      const idsToDelete = Array.isArray(items) ? items.map(a => a.id) : [items.id];
      for (const id of idsToDelete) {
        await deleteDoc(doc(db, "aulas", id));
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Erro ao deletar aula:", error);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="catalogo-container">
      <header className="tool-header">
        <div className="header-texts">
          <h1>{t("lessons.title")}</h1>
          <p>{t("lessons.description")}</p>
        </div>
        {isAdmin && onCreateNew && (
          <ButtonMain onClick={onCreateNew} className="btn" id="btn-add-novo">
            <i>
              <Icones icone="fa-plus" />
            </i>
            {t("lessons.add_plan")}
          </ButtonMain>
        )}
      </header>

      <div className="aula-grid">
        {aulas.length === 0 && (
          <div className="empty-state-box">
            <p>{t("lessons.no_plans")}</p>
          </div>
        )}

        {Object.entries(aulasAgrupadas).map(([titulo, grupoAulas]) => {
          if (grupoAulas.length === 1) {
            const aula = grupoAulas[0];
            return (
              <div key={aula.id} className="aula-card">
                {isAdmin && (
                  <div className="admin-actions">
                    <ButtonMain 
                      className="dot-menu-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === aula.id ? null : aula.id);
                      }}
                    >
                      <i>
                        <Icones icone="fa-ellipsis-v" />
                      </i>
                    </ButtonMain>
                    {activeMenu === aula.id && (
                      <div className="admin-dropdown">
                        <ButtonMain onClick={() => { setActiveMenu(null); onEdit(aula); }}>
                          {t("planner.edit")}
                        </ButtonMain>
                        <ButtonMain 
                          className="delete-opt" 
                          onClick={() => { setActiveMenu(null); setShowDeleteConfirm(aula); }}
                        >
                          {t("planner.delete")}
                        </ButtonMain>
                      </div>
                    )}
                  </div>
                )}
                <div className="aula-info">
                  <div className="tags-row">
                    <span className="tag" id="tag-duracao">
                      {aula.duracao} min
                    </span>
                    <span className="tag" id="tag-publico">
                      {aula.publico}
                    </span>
                  </div>
                  <h3 className="aula-card-titulo">{aula.titulo}</h3>
                  {aula.filmeTitulo ? (
                    <p className="aula-card-filme">
                      <i className="aula-card-filme-icon">
                        <Icones icone="fa fa-film" />
                      </i>
                      {aula.filmeTitulo}
                    </p>
                  ) : (
                    <p className="aula-card-filme-vazio">{t("lessons.no_movie")}</p>
                  )}
                  <div className="aula-card-actions">
                    <ButtonMain
                      className="btn-ficha"
                      onClick={() => setSelectedAulaId(aula.id)}
                    >
                      {t("lessons.view_plan")}
                    </ButtonMain>
                  </div>
                </div>
              </div>
            );
          }

          const aulaBase = grupoAulas[0];
          const aulasPorPublico = {};
          grupoAulas.forEach((a) => {
            if (!aulasPorPublico[a.publico]) aulasPorPublico[a.publico] = [];
            aulasPorPublico[a.publico].push(a);
          });

          return (
            <div key={titulo} className="aula-card group-card">
              {isAdmin && (
                <div className="admin-actions">
                  <ButtonMain 
                    className="dot-menu-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === titulo ? null : titulo);
                    }}
                  >
                    <i>
                      <Icones icone="fa-ellipsis-v" />
                    </i>
                  </ButtonMain>
                  {activeMenu === titulo && (
                    <div className="admin-dropdown">
                      {/* For groups, we allow deleting the whole set */}
                      <ButtonMain 
                        className="delete-opt" 
                        onClick={() => { setActiveMenu(null); setShowDeleteConfirm(grupoAulas); }}
                      >
                        {t("planner.confirm_delete_group")}
                      </ButtonMain>
                    </div>
                  )}
                </div>
              )}
              <div className="aula-info">
                <h3 className="aula-card-titulo">{titulo}</h3>

                {aulaBase.filmeTitulo && (
                  <p className="aula-card-filme">
                    <i className="aula-card-filme-icon">
                      <Icones icone="fa fa-film" />
                    </i>
                    {aulaBase.filmeTitulo}
                  </p>
                )}

                <div className="group-variations-container">
                  {Object.entries(aulasPorPublico).map(
                    ([publico, variacoes]) => (
                      <div key={publico} className="publico-block">
                        <h4 className="publico-title">{publico}</h4>
                        <div className="durations-list">
                          {variacoes
                            .sort(
                              (a, b) => Number(a.duracao) - Number(b.duracao)
                            )
                            .map((variant) => (
                              <div key={variant.id} style={{ position: 'relative', display: 'inline-block' }}>
                                <ButtonMain
                                  className="btn"
                                  id="duration-badge"
                                  onClick={() => setSelectedAulaId(variant.id)}
                                >
                                  <span>{variant.duracao} min</span>
                                </ButtonMain>
                                {isAdmin && (
                                  <button 
                                    className="variation-edit-btn"
                                    onClick={(e) => { e.stopPropagation(); onEdit(variant); }}
                                    title="Editar esta versão"
                                  >
                                    <Icones icone="fa-pencil" />
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>
              Você realmente quer excluír o plano de aula <strong>{Array.isArray(showDeleteConfirm) ? showDeleteConfirm[0].titulo : showDeleteConfirm.titulo}</strong>? This action can't be changed later.
            </p>
            <div className="modal-actions">
              <ButtonMain className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                CANCEL
              </ButtonMain>
              <ButtonMain className="btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>
                DELETE
              </ButtonMain>
            </div>
          </div>
        </div>
      )}

      {selectedAulaId && (
        <FichaAula
          aulaId={selectedAulaId}
          onClose={() => setSelectedAulaId(null)}
        />
      )}
    </div>
  );
};

export default AulasLista;
