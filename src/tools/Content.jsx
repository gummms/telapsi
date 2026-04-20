import { useState } from "react";

import TabsHeader from "./tabs/TabsHeader";
import TabAulas from "./tabs/TabAulas";
import TabFilmes from "./tabs/TabFilmes";

import "./Content.css";

const Content = () => {
  const [activeTab, setActiveTab] = useState("aulas");

  return (
    <>
      <div className="tabs-header">
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="professor-content-area">
        {activeTab === "aulas" && <TabAulas />}

        {activeTab === "filmes" && <TabFilmes />}
      </div>
    </>
  );
};

export default Content;
