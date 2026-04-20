import { memo } from "react";
import { useTranslation } from "react-i18next";

const MetodologiaForm = memo(({ metodologia, onStructChange }) => {
  const { t } = useTranslation();

  return (
    <section className="form-section">
      <h3>{t("planner.methodology")}</h3>
      <p style={{ fontSize: "0.9rem", color: "var(--grayparagraph)", marginBottom: "1.5rem" }}>
        {t("planner.define_steps")}
      </p>

      {metodologia.map((etapa, index) => (
        <div key={`etapa-${index}`} className="metodologia-etapa">
          <div className="form-row">
            <div className="form-group flex-grow">
              <label id="label-input">{t("planner.step_title")} {index + 1}</label>
              <input
                id="text-input"
                className="bold"
                value={etapa.titulo}
                onChange={(e) =>
                  onStructChange(index, "titulo", e.target.value)
                }
                placeholder={t("planner.placeholders.step_title")}
              />
            </div>
            <div className="form-group w-small">
              <label id="label-input">{t("planner.step_time")}</label>
              <input
                id="text-input"
                style={{ textAlign: 'center' }}
                value={etapa.duracao}
                onChange={(e) =>
                  onStructChange(index, "duracao", e.target.value)
                }
                placeholder={t("planner.placeholders.step_time")}
              />
            </div>
          </div>

          <div className="form-column">
            <label id="label-input" style={{ marginTop: '0.8rem', marginBottom: '0.8rem', display: 'block' }}>{t("planner.topics")}</label>
            {etapa.topicos.map((topico, tIndex) => (
              <div key={`topico-${index}-${tIndex}`} className="form-row" style={{ marginBottom: '0.5rem' }}>
                <div className="form-group flex-grow">
                  <input
                    id="text-input"
                    value={topico}
                    onChange={(e) =>
                      onStructChange(index, "topicos", e.target.value, tIndex)
                    }
                    placeholder={`• ${t("planner.topics").split(' ')[0]} ${tIndex + 1}`}
                    style={{ fontSize: '0.9rem' }}
                  />
                 </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
});

export default MetodologiaForm;
