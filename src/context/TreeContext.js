import React, { createContext, useContext, useState } from "react";

const TreeContext = createContext(null);

export function TreeProvider({ children }) {
  const [trees, setTrees] = useState([]);

  const addTree = (tree) => {
    setTrees((prev) => [{ ...tree, soilMoisture: tree.soilMoisture ?? 0 }, ...prev]);
  };

  return (
    <TreeContext.Provider value={{ trees, setTrees, addTree }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTrees() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTrees doit être utilisé à l'intérieur de <TreeProvider>");
  return ctx;
}