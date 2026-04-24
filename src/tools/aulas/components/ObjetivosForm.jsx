import { memo } from "react";
import T from "../../../components/T";

const ObjetivosForm = memo(({ objetivos, onArrayChange }) => {
  return (
    <section className="form-section">
      <h3><T>Objetivos de Aprendizagem</T></h3>
      <div className="form-column">
        <label id="label-input" style={{ marginBottom: '1rem', display: 'block' }}><T>Liste até 5 objetivos gerais:</T></label>
        {objetivos.map((obj, index) => (
          <div key={`objetivo-${index}`} className="form-row" style={{ marginBottom: '0.8rem' }}>
            <div className="form-group flex-grow">
              <input
                id="text-input"
                value={obj}
                onChange={(e) => onArrayChange("objetivos", index, e.target.value)}
                placeholder={`Objetivo ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default ObjetivosForm;
