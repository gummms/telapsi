import { useState, useEffect, useCallback } from "react";
import T from "../../components/T";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/useAuth";
import { salvarAula } from "../../services/formsService";
import { useToast } from "../../context/ToastContext";

import InfoGeraisForm from "./components/InfoGeraisForm";
import ObjetivosForm from "./components/ObjetivosForm";
import MidiaSelector from "./components/MidiaSelector";
import MetodologiaForm from "./components/MetodologiaForm";
import AtividadesExtrasForm from "./components/AtividadesExtrasForm";
import Spinner from "../../components/Spinner";
import ButtonMain from "../../components/ButtonMain";
import Icones from "../../components/Icones";

import "./PlanejadorAulas.css";
import "../../components/Buttons.css";

const PlanejadorAulas = ({ onBack, editingData }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const isEditing = !!editingData;

  const [saving, setSaving] = useState(false);
  const [loadingFilmes, setLoadingFilmes] = useState(true);
  const [filmesDisponiveis, setFilmesDisponiveis] = useState([]);

  const [aula, setAula] = useState({
    titulo: "",
    objetivos: ["", "", "", "", ""],
    data: "",
    duracao: "90",
    publico: "Residentes",
    metodologia: Array(5)
      .fill(null)
      .map(() => ({
        titulo: "",
        duracao: "",
        topicos: ["", "", ""],
      })),
    dinamica: "",
    perguntasGuia: ["", "", "", "", ""],
    resumoTecnico: ["", "", "", "", "", ""],
  });

  const [selectedFilmeId, setSelectedFilmeId] = useState("");
  const [cenasDoFilmeAtual, setCenasDoFilmeAtual] = useState([]);
  const [cenasSelecionadas, setCenasSelecionadas] = useState([]);

  useEffect(() => {
    if (editingData) {
      setAula(editingData);
      // Resolve scenes
      if (editingData.cenas && editingData.cenas.length > 0) {
        const resolveCenas = async () => {
          try {
            const promises = editingData.cenas.map((cRef) =>
              getDoc(doc(db, "filmes", cRef.filmeId, "cenas", cRef.cenaId))
            );
            const snapshots = await Promise.all(promises);
            const resolved = snapshots
              .map((snap, index) => {
                if (snap.exists()) {
                  const cRef = editingData.cenas[index];
                  return {
                    ...snap.data(),
                    id: snap.id,
                    filmeId: cRef.filmeId,
                    cenaId: cRef.cenaId,
                    filmeTitulo: editingData.filmeTitulo || "",
                  };
                }
                return null;
              })
              .filter(Boolean);
            setCenasSelecionadas(resolved);
          } catch (e) {
            console.error("Erro ao carregar detalhes das cenas:", e);
          }
        };
        resolveCenas();
      }
    }
  }, [editingData]);

  useEffect(() => {
    const loadFilmes = async () => {
      setLoadingFilmes(true);
      try {
        const filmesSnap = await getDocs(collection(db, "filmes"));
        const fData = filmesSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.titulo.localeCompare(b.titulo));
        setFilmesDisponiveis(fData);
      } catch (err) {
        console.error("Erro ao carregar filmes:", err);
        addToast("Erro ao carregar filmes disponíveis.", "error");
      } finally {
        setLoadingFilmes(false);
      }
    };
    loadFilmes();
  }, [addToast]);

  useEffect(() => {
    if (!selectedFilmeId) {
      setCenasDoFilmeAtual([]);
      return;
    }
    const loadCenas = async () => {
      const cenasRef = collection(db, "filmes", selectedFilmeId, "cenas");
      const cenasSnap = await getDocs(cenasRef);
      const cData = cenasSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cData.sort((a, b) => a.minutagem.localeCompare(b.minutagem));
      setCenasDoFilmeAtual(cData);
    };
    loadCenas();
  }, [selectedFilmeId]);

  const handleAulaChange = useCallback((e) => {
    const { name, value } = e.target;
    setAula((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleArrayChange = useCallback((field, index, value) => {
    setAula((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  }, []);

  const handleMetodologiaStructChange = useCallback(
    (index, field, value, topicIndex = null) => {
      setAula((prev) => {
        const novaMetodologia = [...prev.metodologia];
        if (field === "topicos" && topicIndex !== null) {
          const novosTopicos = [...novaMetodologia[index].topicos];
          novosTopicos[topicIndex] = value;
          novaMetodologia[index] = {
            ...novaMetodologia[index],
            topicos: novosTopicos,
          };
        } else {
          novaMetodologia[index] = {
            ...novaMetodologia[index],
            [field]: value,
          };
        }
        return { ...prev, metodologia: novaMetodologia };
      });
    },
    []
  );

  const toggleCena = useCallback(
    (filmeId, cenaId, cenaData = null) => {
      setCenasSelecionadas((prev) => {
        const exists = prev.some(
          (item) => item.filmeId === filmeId && item.cenaId === cenaId
        );

        if (exists) {
          return prev.filter(
            (item) => !(item.filmeId === filmeId && item.cenaId === cenaId)
          );
        } else {
          if (!cenaData) return prev;
          const filmeObj = filmesDisponiveis.find((f) => f.id === filmeId);
          return [
            ...prev,
            {
              filmeId,
              cenaId,
              tituloCena: cenaData.titulo,
              minutagem: cenaData.minutagem,
              filmeTitulo: filmeObj ? filmeObj.titulo : "Desconhecido",
            },
          ];
        }
      });
    },
    [filmesDisponiveis]
  );

  const handleSalvar = async () => {
    if (!aula.titulo) {
      addToast("Dê um título para a aula.", "error");
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        const { id, ...aulaData } = aula;
        const aulaRef = doc(db, "aulas", id);
        
        const cenasParaSalvar = cenasSelecionadas.map((c) => ({
            filmeId: c.filmeId,
            cenaId: c.cenaId,
        }));
        
        const filmesIdsUnicos = [
            ...new Set(cenasSelecionadas.map((c) => c.filmeId)),
        ];

        await updateDoc(aulaRef, {
            ...aulaData,
            cenas: cenasParaSalvar,
            filmesIds: filmesIdsUnicos,
            qtdCenas: cenasSelecionadas.length,
            filmeId: filmesIdsUnicos[0] || null,
            filmeTitulo:
              filmesIdsUnicos.length > 1
                ? "Vários Filmes"
                : cenasSelecionadas[0]?.filmeTitulo || "",
        });
        addToast("Aula planejada com sucesso!", "success");
      } else {
        await salvarAula(aula, cenasSelecionadas, currentUser.uid);
        addToast("Aula planejada com sucesso!", "success");
      }
      if (onBack) onBack();
    } catch (error) {
      console.error("Erro ao salvar aula:", error);
      addToast("Erro ao salvar. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="planejador-container">
      <header className="planejador-header">
        <ButtonMain onClick={onBack} id="BackBtn-teacher" className="btn">
          <i>
            <Icones icone="fa-chevron-left" />
          </i>
          <p><T>Voltar para aulas</T></p>
        </ButtonMain>
        <h2><T>Planejador de Aulas</T></h2>
        <p><T>Planeje e registre aulas baseadas em filmes.</T></p>
      </header>

      <div className="planejador-form">
        <InfoGeraisForm aula={aula} onChange={handleAulaChange} />

        <ObjetivosForm
          objetivos={aula.objetivos}
          onArrayChange={handleArrayChange}
        />

        {loadingFilmes ? (
          <Spinner />
        ) : (
          <MidiaSelector
            filmes={filmesDisponiveis}
            selectedFilmeId={selectedFilmeId}
            onSelectFilme={setSelectedFilmeId}
            cenasDoFilmeAtual={cenasDoFilmeAtual}
            cenasSelecionadas={cenasSelecionadas}
            onToggleCena={toggleCena}
          />
        )}

        <MetodologiaForm
          metodologia={aula.metodologia}
          onStructChange={handleMetodologiaStructChange}
        />

        <AtividadesExtrasForm
          aula={aula}
          onChange={handleAulaChange}
          onArrayChange={handleArrayChange}
        />

        <section className="form-section">
          <h3><T>Handout / Resumo Técnico</T></h3>
          <p style={{ fontSize: "0.9rem", color: "var(--grayparagraph)", marginBottom: "1.5rem" }}>
            <T>Preencha até 6 pontos principais (conceitos, diagnósticos, instrumentos):</T>
          </p>
          <div className="form-column">
            {aula.resumoTecnico.map((item, index) => (
              <div key={`technical-point-${index}`} className="form-row" style={{ marginBottom: '0.8rem' }}>
                <div className="form-group flex-grow">
                  <input
                    id="text-input"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange("resumoTecnico", index, e.target.value)
                    }
                    placeholder={`Ponto chave ${index + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="form-footer-actions">
          <ButtonMain className="btn" onClick={onBack} disabled={saving}>
            <T>Cancelar</T>
          </ButtonMain>
          <ButtonMain
            className="btn"
            id="btn-submit"
            onClick={handleSalvar}
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fa-spin" style={{ marginRight: '8px' }}>
                  <Icones icone="fa-spinner" />
                </i>
                <T>Salvando...</T>
              </>
            ) : isEditing ? (
              "EDITAR"
            ) : (
              <T>Salvar Planejamento</T>
            )}
          </ButtonMain>
        </div>
      </div>
    </div>
  );
};

export default PlanejadorAulas;
