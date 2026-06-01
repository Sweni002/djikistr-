import React from "react";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Acceuil";
import Graphe from "./pages/Graphe";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/graphe" element={<Graphe />} />
    </Routes>
  );
}