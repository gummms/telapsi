import { memo } from "react";
import T from "../../../components/T";

const MidiaSelector = memo(
  ({
    filmes,
    selectedFilmeId,
    onSelectFilme,
    cenasDoFilmeAtual,
    cenasSelecionadas,
    onToggleCena,
  }) => {
    return (
    <section className="form-section">
      <h3><T>Mídia Associada (Multi-filmes)</T></h3>

      {/* Resumo do que já foi selecionado */}
      {cenasSelecionadas.length > 0 && (
        <div className="cenas-resumo">
          <h4><T>Cenas já selecionadas para a aula:</T></h4>
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
                  <T>Remover</T>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-row">
        <div className="form-group flex-grow">
          <label id="label-input"><T>Adicionar cenas do filme:</T></label>
          <select
            id="select-input"
            value={selectedFilmeId}
            onChange={(e) => onSelectFilme(e.target.value)}
          >
            <option value="">
              Selecione um filme para visualizar cenas...
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
            <T>Cenas disponíveis em:</T>{" "}
            {filmes.find((f) => f.id === selectedFilmeId)?.titulo}
          </h4>
          {cenasDoFilmeAtual.length === 0 ? (
            <p className="text-muted">
              <T>Este filme não possui cenas cadastradas.</T>
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
