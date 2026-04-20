import { useState } from "react";
import { useAuth } from "../../context/useAuth";

import AulasLista from "../aulas/AulasLista";
import PlanejadorAulas from "../aulas/PlanejadorAulas";

const TabAulas = () => {
  const [view, setView] = useState("lista");
  const [editingItem, setEditingItem] = useState(null);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.isAdmin === true;

  const handleEdit = (aula) => {
    setEditingItem(aula);
    setView("novo");
  };

  const handleBack = () => {
    setEditingItem(null);
    setView("lista");
  };

  return (
    <div>
      {view === "lista" && (
        <AulasLista
          onCreateNew={isAdmin ? () => setView("novo") : null}
          onEdit={isAdmin ? handleEdit : null}
        />
      )}
      {view === "novo" && isAdmin && (
        <PlanejadorAulas 
          onBack={handleBack} 
          editingData={editingItem} 
        />
      )}
    </div>
  );
};

export default TabAulas;
