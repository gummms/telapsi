import { memo } from "react";
import { useTranslation } from "react-i18next";

const MidiaSelector = memo(
  ({
    filmes,
    selectedFilmeId,
    onSelectFilme,
    cenasDoFilmeAtual,
    cenasSelecionadas,
    onToggleCena,
  }) => {
    const { t } = useTranslation();

    return (
    <section className="form-section">
      <h3>{t("planner.media")}</h3>

      {/* Resumo do que já foi selecionado */}
      {cenasSelecionadas.length > 0 && (
        <div className="cenas-resumo">
          <h4>{t("planner.selected_scenes")}</h4>
          <ul>
            {cenasSelecionadas.map((c) => (
              <li key={`${c.filmeId}-${c.cenaId}`}>
                <span>
                  <strong>{c.filmeTitulo}</strong>: {c.tituloCena}{" "}
                  <small>({c.minutagem})</small>
                </span>
                <button
                  className="btn-remove-lite"
                  onClick={() => onToggleCena(c.filmeId, c.cenaId)}
                >
                  {t("planner.remove")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input">{t("planner.add_scenes_from")}</label>
          <select
            id="select-input"
            value={selectedFilmeId}
            onChange={(e) => onSelectFilme(e.target.value)}
          >
            <option value="">
              {t("planner.select_movie_placeholder")}
            </option>
            {filmes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedFilmeId && (
        <div className="cenas-selection-box">
          <h4>
            {t("planner.available_scenes_in")}{" "}
            {filmes.find((f) => f.id === selectedFilmeId)?.titulo}
          </h4>
          {cenasDoFilmeAtual.length === 0 ? (
            <p className="text-muted">
              {t("planner.no_scenes")}
            </p>
          ) : (
            <div className="cenas-grid-select">
              {cenasDoFilmeAtual.map((cena) => {
                const isSelected = cenasSelecionadas.some(
                  (item) =>
                    item.cenaId === cena.id &&
                    item.filmeId === selectedFilmeId
                );

                return (
                  <label
                    key={cena.id}
                    className={`cena-checkbox ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        onToggleCena(selectedFilmeId, cena.id, cena)
                      }
                    />
                    <span className="cena-time">{cena.minutagem}</span>
                    <span className="cena-name" title={cena.titulo}>{cena.titulo}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
    );
  }
);

export default MidiaSelector;
