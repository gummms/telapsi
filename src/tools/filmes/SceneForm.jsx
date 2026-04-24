import { useState } from "react";
import T from "../../components/T";
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
      addToast("Preencha pelo menos Título e Minutagem da cena.", "error");
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
        <h3><T>Nova cena</T></h3>
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
              <label id="label-input"><T>Título</T></label>
              <input
                id="text-input"
                name="titulo"
                value={novaCena.titulo}
                onChange={handleCenaChange}
                placeholder="Dê um título à essa cena"
              />
            </div>
            <div className="form-group w-small">
              <label id="label-input"><T>Duração</T></label>
              <input
                id="number-input"
                name="minutagem"
                value={novaCena.minutagem}
                onChange={handleCenaChange}
                placeholder="hh:mm:ss"
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input"><T>Descrição</T></label>
              <textarea
                id="text-area-input"
                name="descricao"
                value={novaCena.descricao}
                onChange={handleCenaChange}
                placeholder="Breve descrição da cena"
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <TagInput
                label="Temas relacionados"
                tags={novaCena.temas}
                setTags={handleTemasChange}
                options={TEMAS_OPTIONS}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input"><T>Correlação clínica</T></label>
              <textarea
                id="text-area-input"
                name="correlacaoClinica"
                value={novaCena.correlacaoClinica}
                onChange={handleCenaChange}
                placeholder="Escreva sobre a relação entre a cena e situações reais"
              ></textarea>
            </div>
          </div>

          <div className="row">
            <div className="form-group flex-grow">
              <label id="label-input"><T>Questões para debate</T></label>
              <input
                id="text-input"
                name="questao1"
                value={novaCena.questao1}
                onChange={handleCenaChange}
                placeholder="01. Primeira questão"
                className="mb-2"
              />
              <input
                id="text-input"
                name="questao2"
                value={novaCena.questao2}
                onChange={handleCenaChange}
                placeholder="02. Segunda questão"
                className="mb-2"
              />
              <input
                id="text-input"
                name="questao3"
                value={novaCena.questao3}
                onChange={handleCenaChange}
                placeholder="03. Terceira questão"
                className="mb-2"
              />
              <input
                id="text-input"
                name="questao4"
                value={novaCena.questao4}
                onChange={handleCenaChange}
                placeholder="04. Quarta questão"
              />
            </div>
          </div>

          <label id="label-input"><T>Pontos de comparação com a clínica</T></label>
          <div className="row">
            <div className="form-group flex-grow">
              <label id="sub-label"><T>No filme:</T></label>
              <textarea
                id="text-area-input"
                name="compNoFilme"
                value={novaCena.compNoFilme}
                onChange={handleCenaChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group flex-grow">
              <label id="sub-label"><T>Na clínica:</T></label>
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
              <label id="sub-label"><T>Aspecto conceitual:</T></label>
              <textarea
                id="text-area-input"
                name="compConceitual"
                value={novaCena.compConceitual}
                onChange={handleCenaChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group flex-grow">
              <label id="sub-label"><T>Observação narrativa x clínica real:</T></label>
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
              <label id="label-input"><T>Dica de aula</T></label>
              <textarea
                id="text-area-input"
                name="dicaAula"
                value={novaCena.dicaAula}
                onChange={handleCenaChange}
                placeholder="Dicas para conduzir aulas..."
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
            <T>Adicionar cena</T>
          </ButtonMain>
        </div>
      )}
    </section>
  );
};

export default SceneForm;
