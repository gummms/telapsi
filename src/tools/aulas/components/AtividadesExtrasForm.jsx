import { memo } from "react";
import T from "../../../components/T";

const AtividadesExtrasForm = memo(({ aula, onChange, onArrayChange }) => {
  return (
    <section className="form-section">
      <h3><T>Atividades Complementares</T></h3>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input"><T>Dinâmica Sugerida / Role Play</T></label>
          <textarea
            id="text-area-input"
            name="dinamica"
            value={aula.dinamica}
            onChange={onChange}
            rows="3"
            placeholder="Descrição da dinâmica (ex: Grupo A entrevista, Grupo B observa)..."
          />
        </div>
      </div>

      <div className="form-column">
        <label id="label-input" style={{ marginBottom: '1rem', display: 'block' }}><T>Perguntas-guia para Discussão (até 5)</T></label>
        {aula.perguntasGuia.map((pergunta, index) => (
          <div key={`pergunta-${index}`} className="form-row" style={{ marginBottom: '0.8rem' }}>
            <div className="form-group flex-grow">
              <input
                id="text-input"
                value={pergunta}
                onChange={(e) =>
                  onArrayChange("perguntasGuia", index, e.target.value)
                }
                placeholder={`Pergunta ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default AtividadesExtrasForm;
