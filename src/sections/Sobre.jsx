import React from "react";
import T from "../components/T";
import { Link } from "react-router-dom";
import Icones from "../components/Icones";
import "./Sobre.css";

const Sobre = () => {
  return (
    <section id="sobre">
      <div className="sobre">
        <div className="sobre-text">
          <div className="sobre-title">
            <h2><T>Sobre o Telapsi</T></h2>
          </div>
          <div className="sobre-paragraph">
            <p><T>Projeto acadêmico gratuito para apoiar docentes no ensino da psiquiatria fazendo uso pedagógico de filmes.</T></p>
          </div>
          <div className="sobre-btn">
            <Link to="/professor" className="btn" id="btn-main">
              <T>Saiba mais</T>
            </Link>
          </div>
        </div>
        <div className="sobre-extra">
          <div className="extra">
            <i className="extra-icon">
              <Icones icone="fa-scale-balanced" />
            </i>
            <div className="extra-text">
              <h3><T>Diretrizes éticas</T></h3>
              <p><T>O Telapsi preza pelo uso de linguagem não estigmatizante, de contexto clínico e de referências a diretrizes.</T></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
