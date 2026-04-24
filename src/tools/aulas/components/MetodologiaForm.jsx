import { memo } from "react";
import T from "../../../components/T";

const MetodologiaForm = memo(({ metodologia, onStructChange }) => {
  return (
    <section className="form-section">
      <h3><T>Roteiro Metodológico (Passo a Passo)</T></h3>
      <p style={{ fontSize: "0.9rem", color: "var(--grayparagraph)", marginBottom: "1.5rem" }}>
        <T>Defina até 5 etapas para sua aula.</T>
      </p>

      {metodologia.map((etapa, index) => (
        <div key={`etapa-${index}`} className="metodologia-etapa">
          <div className="form-row">
            <div className="form-group flex-grow">
              <label id="label-input"><T>Título da Etapa</T> {index + 1}</label>
              <input
                id="text-input"
                className="bold"
                value={etapa.titulo}
                onChange={(e) =>
                  onStructChange(index, "titulo", e.target.value)
                }
                placeholder="Ex: Introdução / Exibição / Discussão"
              />
            </div>
            <div className="form-group w-small">
              <label id="label-input"><T>Tempo (min)</T></label>
              <input
                id="text-input"
                style={{ textAlign: 'center' }}
                value={etapa.duracao}
                onChange={(e) =>
                  onStructChange(index, "duracao", e.target.value)
                }
                placeholder="Ex: 20"
              />
            </div>
          </div>

          <div className="form-column">
            <label id="label-input" style={{ marginTop: '0.8rem', marginBottom: '0.8rem', display: 'block' }}><T>Tópicos (até 3):</T></label>
            {etapa.topicos.map((topico, tIndex) => (
              <div key={`topico-${index}-${tIndex}`} className="form-row" style={{ marginBottom: '0.5rem' }}>
                <div className="form-group flex-grow">
                  <input
                    id="text-input"
                    value={topico}
                    onChange={(e) =>
                      onStructChange(index, "topicos", e.target.value, tIndex)
                    }
                    placeholder={`• Tópico ${tIndex + 1}`}
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
