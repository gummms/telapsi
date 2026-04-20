import { useState } from "react";
import { useAuth } from "../../context/useAuth";

import CatalogoFilmes from "../filmes/CatalogoFilmes";
import CadastroFilme from "../filmes/CadastroFilme";

const TabFilmes = () => {
  const [view, setView] = useState("catalogo");
  const [editingItem, setEditingItem] = useState(null);
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.isAdmin === true;

  const handleEdit = (filme) => {
    setEditingItem(filme);
    setView("cadastro");
  };

  const handleBack = () => {
    setEditingItem(null);
    setView("catalogo");
  };

  return (
    <div>
      {view === "catalogo" && (
        <CatalogoFilmes
          onAddNew={isAdmin ? () => setView("cadastro") : null}
          onEdit={isAdmin ? handleEdit : null}
        />
      )}
      {view === "cadastro" && isAdmin && (
        <CadastroFilme 
          onBack={handleBack} 
          editingData={editingItem} 
        />
      )}
    </div>
  );
};

export default TabFilmes;
