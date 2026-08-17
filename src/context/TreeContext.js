import React, { createContext, useContext, useState } from "react";

const TreeContext = createContext(null);

const INITIAL_TREES = [
  { id: "OL-001", status: "healthy", soilMoisture: 38, addedAt: "01/01/2025" },
  { id: "OL-002", status: "waterStress", soilMoisture: 19, addedAt: "01/01/2025" },
  { id: "OL-003", status: "disease", soilMoisture: 30, addedAt: "01/01/2025" },
  { id: "OL-004", status: "healthy", soilMoisture: 41, addedAt: "01/01/2025" },
  { id: "OL-005", status: "healthy", soilMoisture: 35, addedAt: "01/01/2025" },
];

export function TreeProvider({ children }) {
  const [trees, setTrees] = useState(INITIAL_TREES);

  const addTree = (tree) => {
    setTrees((prev) => [{ ...tree, soilMoisture: tree.soilMoisture ?? 0 }, ...prev]);
  };

  return (
    <TreeContext.Provider value={{ trees, addTree }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTrees() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTrees doit être utilisé à l'intérieur de <TreeProvider>");
  return ctx;
}