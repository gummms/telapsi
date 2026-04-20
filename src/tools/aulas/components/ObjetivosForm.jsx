import { memo } from "react";
import { useTranslation } from "react-i18next";

const ObjetivosForm = memo(({ objetivos, onArrayChange }) => {
  const { t } = useTranslation();

  return (
    <section className="form-section">
      <h3>{t("planner.learning_objectives")}</h3>
      <div className="form-column">
        <label id="label-input" style={{ marginBottom: '1rem', display: 'block' }}>{t("planner.list_objectives")}</label>
        {objetivos.map((obj, index) => (
          <div key={`objetivo-${index}`} className="form-row" style={{ marginBottom: '0.8rem' }}>
            <div className="form-group flex-grow">
              <input
                id="text-input"
                value={obj}
                onChange={(e) => onArrayChange("objetivos", index, e.target.value)}
                placeholder={`${t("planner.objective_placeholder")} ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default ObjetivosForm;
