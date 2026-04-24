import { memo } from "react";
import T from "../../../components/T";

const InfoGeraisForm = memo(({ aula, onChange }) => {
  return (
    <section className="form-section">
      <h3><T>Informações Gerais</T></h3>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input"><T>Título da Aula</T></label>
          <input
            id="text-input"
            name="titulo"
            value={aula.titulo}
            onChange={onChange}
            placeholder="Ex: Pródromos e início da esquizofrenia"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input"><T>Público</T></label>
          <select id="select-input" name="publico" value={aula.publico} onChange={onChange}>
            <option>Estudantes</option>
            <option>Residentes</option>
            <option>Profissionais</option>
            <option>Acadêmicos</option>
            <option>Outro</option>
          </select>
        </div>
        <div className="form-group flex-grow">
          <label id="label-input"><T>Duração Total</T></label>
          <select id="select-input" name="duracao" value={aula.duracao} onChange={onChange}>
            <option value="30">30 min</option>
            <option value="50">50 min</option>
            <option value="90">90 min</option>
            <option value="120">120 min</option>
          </select>
        </div>
      </div>
    </section>
  );
});

export default InfoGeraisForm;
