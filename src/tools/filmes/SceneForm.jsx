import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext";
import Icones from "../../components/Icones";
import TagInput from "../../components/TagInput";
import ButtonMain from "../../components/ButtonMain";

const TEMAS_OPTIONS = [
  "Abusos institucionais",
  "Alterações formais do pensamento (discurso fragmentado, salada de palavras)",
  "Alucinação visual",
  "Ilusão perceptiva",
  "Alucinações auditivas",
  "Alucinações auditivas e visuais",
  "Ansiedade e desconforto corporal",
  "Comportamento bizarro",
  "Condições precárias dos hospitais psiquiátricos",
  "Confusão entre uso de substâncias e doença mental",
  "Conflito entre identidade pública e privada",
  "Contexto inicial do delírio (investigação policial vs. internação psiquiátrica)",
  "Déficits de habilidades sociais",
  "Delírios de grandeza e missão especial",
  "Desumanização no cuidado em saúde mental",
  "Desorganização do pensamento",
  "Despersonalização e desrealização",
  "Diagnóstico diferencial",
  "Discurso delirante",
  "Efeitos das drogas na percepção da realidade",
  "Estigma e criminalização do uso de drogas",
  "Estigma e moralidade",
  "Estigma reforçado dentro do espaço hospitalar",
  "Impacto do estigma no vínculo familiar",
  "Instabilidade da autoimagem",
  "Internação involuntária",
  "Institucionalização e exclusão social",
  "Isolamento social",
  "Neologismos e maneirismos verbais",
  "Paranoia",
  "Perda da crítica de realidade",
  "Prejuízo na comunicação e nos vínculos sociais",
  "Primeiro contato clínico",
  "Primeiros sinais de um transtorno psicótico",
  "Pródromos da esquizofrenia",
  "Sintomas dissociativos",
  "Sintomas negativos",
  "Sintomas negativos (isolamento, retraimento social)",
  "Uso de substâncias como fator de vulnerabilidade para o surgimento de sintomas psiquiátricos",
  "Uso de substâncias/medicações",
  "Violência institucional",
  "Violação da dignidade e dos direitos humanos",
  "Efeitos adversos dos antipsicóticos típicos",
  "Percepção e narrativas dos pacientes sobre o tratamento",
  "Estigmatização do uso de psicofármacos no cinema",
  "Desumanização da prática médica",
  "Ausência de vínculo terapêutico",
  "Psiquiatria como prática de escuta e olhar clínico integral",
  "Estereótipos sobre a psiquiatria",
  "Desconfiança em relação ao médico e à especialidade",
  "Impacto da antipsiquiatria e da representação midiática na construção do estigma",
  "História da ECT e seus usos inadequados",
  "Consentimento e ética no tratamento psiquiátrico",
  "Estigma contra terapias eficazes",
  "Estigma social",
  "Impacto do estigma no vínculo social",
  "Autoestigma",
  "Confusão entre realidade e ficção",
  "Vulnerabilidade a sintomas psicóticos diante de trauma",
  "Perda de fronteira entre o eu e o outro",
  "Fragmentação da identidade",
  "Pseuadolucinações",
  "Delírio de duplicação do eu",
  "Fragmentação e conflito de identidade",
  "Psicopatologia das funções psíquicas (consciência, atenção, orientação)",
];

const SceneForm = ({ onAddCena }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [mostrarFormCena, setMostrarFormCena] = useState(true);

  const [novaCena, setNovaCena] = useState({
    titulo: "",
    minutagem: "",
    descricao: "",
    temas: [],
    correlacaoClinica: "",
    questao1: "",
    questao2: "",
    questao3: "",
    questao4: "",
    compNoFilme: "",
    compNaClinica: "",
    compConceitual: "",
    compNarrativa: "",
    dicaAula: "",
    palavrasChave: [],
  });

  const handleCenaChange = (e) => {
    const { name, value } = e.target;

    if (name === "minutagem") {
      const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 6);

      let formattedValue = onlyNumbers;

      if (onlyNumbers.length > 2) {
        formattedValue = `${onlyNumbers.slice(0, 2)}:${onlyNumbers.slice(2)}`;
      }

      if (onlyNumbers.length > 4) {
        formattedValue = `${onlyNumbers.slice(0, 2)}:${onlyNumbers.slice(
          2,
          4
        )}:${onlyNumbers.slice(4)}`;
      }

      setNovaCena((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setNovaCena((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTemasChange = (newTemas) => {
    setNovaCena((prev) => ({ ...prev, temas: newTemas }));
  };

  const handlePalavrasChaveChange = (newPalavrasChave) => {
    setNovaCena((prev) => ({ ...prev, palavrasChave: newPalavrasChave }));
  };

  const handleAddClick = () => {
    if (!novaCena.titulo || !novaCena.minutagem) {
      addToast(t("scene_form.alert_validation"), "error");
      return;
    }

    const cenaFormatada = {
      idTemp: Date.now(),
      titulo: novaCena.titulo,
      minutagem: novaCena.minutagem,
      descricao: novaCena.descricao,
      temasRelacionados: novaCena.temas,
      correlacaoClinica: novaCena.correlacaoClinica,
      questoesDebate: [
        novaCena.questao1,
        novaCena.questao2,
        novaCena.questao3,
        novaCena.questao4,
      ].filter((q) => q),
      pontosComparacao: {
        noFilme: novaCena.compNoFilme,
        naClinica: novaCena.compNaClinica,
        aspectoConceitual: novaCena.compConceitual,
        observacaoNarrativa: novaCena.compNarrativa,
      },
      dicaAula: novaCena.dicaAula,
      palavrasChave: novaCena.palavrasChave,
    };

    onAddCena(cenaFormatada);

    setNovaCena({
      titulo: "",
      minutagem: "",
      descricao: "",
      temas: [],
      correlacaoClinica: "",
      questao1: "",
      questao2: "",
      questao3: "",
      questao4: "",
      compNoFilme: "",
      compNaClinica: "",
      compConceitual: "",
      compNarrativa: "",
      dicaAula: "",
      palavrasChave: [],
    });
  };

  return (
    <section className="form-section nova-cena-box">
      <div
        onClick={() => setMostrarFormCena(!mostrarFormCena)}
        className={
          mostrarFormCena ? "accordion-header" : "accordion-header-closed"
        }
      >
        <h3>{t("scene_form.new_scene")}</h3>
        <span>
          <i>
            <Icones
              icone={mostrarFormCena ? "fa-chevron-up" : "fa-chevron-down"}
            />
          </i>
        </span>
      </div>

      {mostrarFormCena && (
        <div className="nova-cena-content">
          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input">{t("movie_registration.title")}</label>
              <input
                id="text-input"
                name="titulo"
                value={novaCena.titulo}
                onChange={handleCenaChange}
                placeholder={t("scene_form.title_placeholder")}
              />
            </div>
            <div className="form-group w-small">
              <label id="label-input">{t("movie_registration.duration")}</label>
              <input
                id="number-input"
                name="minutagem"
                value={novaCena.minutagem}
                onChange={handleCenaChange}
                placeholder={t("scene_form.duration_placeholder")}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input">{t("scene_form.description")}</label>
              <textarea
                id="text-area-input"
                name="descricao"
                value={novaCena.descricao}
                onChange={handleCenaChange}
                placeholder={t("scene_form.description_placeholder")}
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <TagInput
                label={t("scene_form.related_themes")}
                tags={novaCena.temas}
                setTags={handleTemasChange}
                options={TEMAS_OPTIONS}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input">{t("scene_form.clinical_correlation")}</label>
              <textarea
                id="text-area-input"
                name="correlacaoClinica"
                value={novaCena.correlacaoClinica}
                onChange={handleCenaChange}
                placeholder={t("scene_form.clinical_correlation_placeholder")}
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input">{t("scene_form.debate_questions")}</label>
              <input
                id="text-input"
                name="questao1"
                value={novaCena.questao1}
                onChange={handleCenaChange}
                placeholder={t("scene_form.q1")}
                className="mb-2"
              />
              <input
                id="text-input"
                name="questao2"
                value={novaCena.questao2}
                onChange={handleCenaChange}
                placeholder={t("scene_form.q2")}
                className="mb-2"
              />
              <input
                id="text-input"
                name="questao3"
                value={novaCena.questao3}
                onChange={handleCenaChange}
                placeholder={t("scene_form.q3")}
                className="mb-2"
              />
              <input
                id="text-input"
                name="questao4"
                value={novaCena.questao4}
                onChange={handleCenaChange}
                placeholder={t("scene_form.q4")}
              />
            </div>
          </div>

          <label id="label-input">{t("scene_form.comparison_points")}</label>
          <div className="row">
            <div className="form-group flex-grow">
              <label id="sub-label">{t("scene_form.in_movie")}</label>
              <textarea
                id="text-area-input"
                name="compNoFilme"
                value={novaCena.compNoFilme}
                onChange={handleCenaChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group flex-grow">
              <label id="sub-label">{t("scene_form.in_clinic")}</label>
              <textarea
                id="text-area-input"
                name="compNaClinica"
                value={novaCena.compNaClinica}
                onChange={handleCenaChange}
                rows="3"
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="form-group flex-grow">
              <label id="sub-label">{t("scene_form.conceptual_aspect")}</label>
              <textarea
                id="text-area-input"
                name="compConceitual"
                value={novaCena.compConceitual}
                onChange={handleCenaChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group flex-grow">
              <label id="sub-label">{t("scene_form.narrative_observation")}</label>
              <textarea
                id="text-area-input"
                name="compNarrativa"
                value={novaCena.compNarrativa}
                onChange={handleCenaChange}
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input">{t("scene_form.teaching_tip")}</label>
              <textarea
                id="text-area-input"
                name="dicaAula"
                value={novaCena.dicaAula}
                onChange={handleCenaChange}
                placeholder={t("scene_form.teaching_tip_placeholder")}
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <TagInput
                tags={novaCena.palavrasChave}
                setTags={handlePalavrasChaveChange}
              />
            </div>
          </div>

          <ButtonMain className="btn" id="btn-add-cena" onClick={handleAddClick}>
            <i>
              <Icones icone="fa-plus" />
            </i>
            {t("scene_form.add_scene")}
          </ButtonMain>
        </div>
      )}
    </section>
  );
};

export default SceneForm;
