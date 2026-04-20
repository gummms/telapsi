import { useTranslation } from "react-i18next";
import "./TabsHeader.css";

const TabsHeader = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <nav className="professor-tabs">
      <button
        className={`tab-btn ${activeTab === "aulas" ? "active" : ""}`}
        onClick={() => setActiveTab("aulas")}
      >
        {t("tabs.lesson_plans")}
      </button>
      <button
        className={`tab-btn ${activeTab === "filmes" ? "active" : ""}`}
        onClick={() => setActiveTab("filmes")}
      >
        {t("tabs.guides")}
      </button>
    </nav>
  );
};

export default TabsHeader;
