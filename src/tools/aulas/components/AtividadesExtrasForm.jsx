import { memo } from "react";
import { useTranslation } from "react-i18next";

const AtividadesExtrasForm = memo(({ aula, onChange, onArrayChange }) => {
  const { t } = useTranslation();

  return (
    <section className="form-section">
      <h3>{t("planner.extra_activities")}</h3>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input">{t("planner.suggested_dynamics")}</label>
          <textarea
            id="text-area-input"
            name="dinamica"
            value={aula.dinamica}
            onChange={onChange}
            rows="3"
            placeholder={t("planner.placeholders.dynamics")}
          />
        </div>
      </div>

      <div className="form-column">
        <label id="label-input" style={{ marginBottom: '1rem', display: 'block' }}>{t("planner.guide_questions")}</label>
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
