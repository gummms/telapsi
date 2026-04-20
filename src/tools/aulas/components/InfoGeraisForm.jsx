import { memo } from "react";
import { useTranslation } from "react-i18next";

const InfoGeraisForm = memo(({ aula, onChange }) => {
  const { t } = useTranslation();

  return (
    <section className="form-section">
      <h3>{t("planner.general_info")}</h3>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input">{t("planner.lesson_title")}</label>
          <input
            id="text-input"
            name="titulo"
            value={aula.titulo}
            onChange={onChange}
            placeholder={t("planner.placeholders.lesson_title")}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input">{t("planner.audience")}</label>
          <select id="select-input" name="publico" value={aula.publico} onChange={onChange}>
            <option>{t("planner.audience_options.students")}</option>
            <option>{t("planner.audience_options.residents")}</option>
            <option>{t("planner.audience_options.professionals")}</option>
            <option>{t("planner.audience_options.academics")}</option>
            <option>{t("planner.audience_options.other")}</option>
          </select>
        </div>
        <div className="form-group flex-grow">
          <label id="label-input">{t("planner.duration")}</label>
          <select id="select-input" name="duracao" value={aula.duracao} onChange={onChange}>
            <option value="30">30 {t("planning.duration_suffix")}</option>
            <option value="50">50 {t("planning.duration_suffix")}</option>
            <option value="90">90 {t("planning.duration_suffix")}</option>
            <option value="120">120 {t("planning.duration_suffix")}</option>
          </select>
        </div>
      </div>
    </section>
  );
});

export default InfoGeraisForm;
