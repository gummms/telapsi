import T from "../components/T";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p><T>© Telapsi — Projeto acadêmico.</T></p>
      <p id="disclaimer-text">
        <T>AVISO LEGAL – DIREITOS AUTORAIS: A plataforma TELAPSI não hospeda,
        reproduz, transmite, disponibiliza para download ou compartilha trechos
        de obras audiovisuais protegidas por direitos autorais, incluindo
        filmes, séries, documentários ou quaisquer conteúdos cinematográficos.
        Todo o conteúdo audiovisual utilizado nas atividades pedagógicas deve
        ser acessado pelo usuário por meio de serviços legalmente licenciados,
        tais como plataformas de streaming, mídias físicas adquiridas, locadoras
        digitais ou outros meios permitidos pela legislação brasileira. As
        análises, descrições, guias didáticos, planos de aula, comentários
        pedagógicos, referências temporais (timecodes) e demais materiais
        disponibilizados na TELAPSI constituem obra intelectual independente,
        protegida pela Lei nº 9.610/1998, e destinam-se exclusivamente a fins
        acadêmicos e educacionais. Qualquer exibição de cenas ou filmes em
        ambientes de ensino deve respeitar as disposições legais vigentes,
        incluindo o uso de cópias legalmente adquiridas e a observância das
        limitações previstas na legislação de direitos autorais. A
        responsabilidade pelo acesso ao conteúdo audiovisual original é
        exclusivamente do usuário.</T>
      </p>
    </footer>
  );
};

export default Footer;
