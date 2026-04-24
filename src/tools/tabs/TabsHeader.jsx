import T from "../../components/T";
import "./TabsHeader.css";

const TabsHeader = ({ activeTab, setActiveTab }) => {

  return (
    <nav className="professor-tabs">
      <button
        className={`tab-btn ${activeTab === "aulas" ? "active" : ""}`}
        onClick={() => setActiveTab("aulas")}
      >
        <T>Planos de aula</T>
      </button>
      <button
        className={`tab-btn ${activeTab === "filmes" ? "active" : ""}`}
        onClick={() => setActiveTab("filmes")}
      >
        <T>Guias didáticos</T>
      </button>
    </nav>
  );
};

export default TabsHeader;
