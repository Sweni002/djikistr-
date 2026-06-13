import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "vis-network/styles/vis-network.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  InputAdornment,
  TableContainer,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import TimelineIcon from "@mui/icons-material/Timeline";
import "./GraphVisualization.css";
import StepProgressBar from "./steps";
import Fab from "@mui/material/Fab";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";

const STORAGE_KEY = "graph_weights";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ width: "100%" }} // ✅ AJOUT
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "100%" }}>
          {" "}
          {/* ✅ AJOUT */}
          {children}
        </Box>
      )}
    </div>
  );
}
const GraphComponent = () => {
  const containerRef = useRef(null);
  const nodesRef = useRef(null);
  const edgesRef = useRef(null);
    const [minMaxResult, setMinMaxResult] = useState(null);

  const [startNode, setStartNode] = useState("A"); // par défaut A
  const [openModal, setOpenModal] = useState(false);
  const [currentEdge, setCurrentEdge] = useState(null);
  const [edgeValue, setEdgeValue] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [graphAdjacency, setGraphAdjacency] = useState({
    A: { B: 3, D: 9, C: 3 },
    B: { A: 3, E: 9, F: 1, D: 7 },
    C: { A: 3, D: 2, G: 2 },
    D: { D: 9, B: 7, C: 2, G: 1, F: 3, H: 3, E: 2 },
    E: { B: 9, D: 2, H: 5 },
    F: { B: 1, D: 3, H: 4, G: 5, I: 2, J: 5 },
    G: { C: 2, D: 1, H: 5, J: 3, K: 8, F: 5 },
    H: { D: 3, E: 5, F: 4, I: 6 },
    I: { F: 2, H: 6, J: 2, L: 8 },
    K: { G: 8, J: 4, L: 5 },
    J: { F: 5, I: 2, G: 3, K: 4, L: 4 },
    L: { I: 8, K: 5, J: 4 },
  });
  // Dans GraphComponent.js
  const ALL_NODES = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ];
  const totalSteps = ALL_NODES.length; // Sera 7 au lieu de 3
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const [dijkstraTable, setDijkstraTable] = useState([]);
  useEffect(() => {
    const savedGraph = localStorage.getItem(STORAGE_KEY);
    let initialGraph = graphAdjacency;
 console.log(savedGraph)
    if (savedGraph) {
      initialGraph = JSON.parse(savedGraph);
      setGraphAdjacency(initialGraph);
    }
    // ... (Vos définitions de nodesRef et edgesRef restent identiques)
    nodesRef.current = new DataSet([
      { id: "A", label: "A", x: -400, y: 0 },
      { id: "B", label: "B", x: -150, y: -400 },
      { id: "D", label: "D", x: 100, y: 0 },
      { id: "C", label: "C", x: -150, y: 180 },
      { id: "E", label: "E", x: 350, y: -400 },
      { id: "F", label: "F", x: 350, y: 0 },
      { id: "G", label: "G", x: 120, y: 240 },
      { id: "H", label: "H", x: 600, y: -360 },
      { id: "I", label: "I", x: 850, y: -280 },
      { id: "J", label: "J", x: 820, y: 0 },
      { id: "K", label: "K", x: 500, y: 240 },
      { id: "L", label: "L", x: 1120, y: 0 },
    ]);

    edgesRef.current = new DataSet([
      {
        id: 1,
        from: "A",
        to: "B",
        label: initialGraph.A.B.toString(),
        smooth: { type: "curvedCW", roundness: 0.2 },
      },
      {
        id: 2,
        from: "A",
        to: "C",
        label: initialGraph.A.C.toString(),
        font: { vadjust: -15 },
      },
      {
        id: 3,
        from: "A",
        to: "D",
        label: initialGraph.A.D.toString(),
        font: { vadjust: -15 },
      },
      { id: 4, from: "B", to: "D", label: initialGraph.B.D.toString() },
      {
        id: 6,
        from: "B",
        to: "E",
        label: initialGraph.B.E.toString(),
        smooth: { type: "curvedCW", roundness: 0.15 },
      },
      {
        id: 7,
        from: "C",
        to: "D",
        label: initialGraph.C.D.toString(),
        smooth: { type: "curvedCW", roundness: 0.25 },
      },

      {
        id: 10,
        from: "D",
        to: "E",
        label: initialGraph.D.E.toString(),
        font: { vadjust: 25 },
      },
      {
        id: 11,
        from: "D",
        to: "F",
        label: initialGraph.D.F.toString(),
        smooth: { type: "curvedCCW", roundness: 0.15 },
      },

      {
        id: 14,
        from: "F",
        to: "G",
        label: initialGraph.F.G.toString(),
        smooth: { type: "curvedCCW", roundness: 0.25 },
      },

      {
        id: 15,
        from: "C",
        to: "G",
        label: initialGraph.C.G.toString(),
        font: { vadjust: -15 },
      },

      {
        id: 16,
        from: "G",
        to: "K",
        label: initialGraph.G.K.toString(),
        font: { vadjust: -15 },
      },

      {
        id: 17,
        from: "K",
        to: "J",
        label: initialGraph.K.J.toString(),
        font: { vadjust: -15 },
      },

      {
        id: 18,
        from: "K",
        to: "L",
        label: initialGraph.K.L.toString(),
        font: { vadjust: -5 },
      },

      {
        id: 20,
        from: "J",
        to: "L",
        label: initialGraph.J.L.toString(),
        font: { vadjust: -5 },
      },

      {
        id: 21,
        from: "D",
        to: "H",
        label: initialGraph.D.H.toString(),
        font: { vadjust: 25 },
        smooth: { type: "curvedCCW", roundness: 0.25 },
      },

      {
        id: 22,
        from: "D",
        to: "G",
        label: initialGraph.D.G.toString(),
        smooth: { type: "curvedCCW", roundness: 0.25 },
      },
      {
        id: 23,
        from: "G",
        to: "J",
        label: initialGraph.G.J.toString(),
        smooth: { type: "curvedCCW", roundness: 0.05 },
      },
      {
        id: 24,
        from: "F",
        to: "J",
        label: initialGraph.F.J.toString(),
        smooth: { type: "curvedCCW", roundness: 0.05 },
      },
      {
        id: 25,
        from: "F",
        to: "I",
        label: initialGraph.F.I.toString(),
        smooth: { type: "curvedCCW", roundness: 0.25 },
      },
      {
        id: 26,
        from: "E",
        to: "H",
        label: initialGraph.E.H.toString(),
        smooth: { type: "curvedCCW", roundness: 0.02 },
      },
      {
        id: 27,
        from: "H",
        to: "I",
        label: initialGraph.H.I.toString(),
        smooth: { type: "curvedCCW", roundness: 0.05 },
      },

      {
        id: 28,
        from: "I",
        to: "L",
        label: initialGraph.I.L.toString(),
        smooth: { type: "curvedCCW", roundness: 0.1 },
      },
      {
        id: 29,
        from: "F",
        to: "H",
        label: initialGraph.F.H.toString(),
        smooth: { type: "curvedCCW", roundness: 0.25 },
      },
      {
        id: 30,
        from: "B",
        to: "F",
        label: initialGraph.B.F.toString(),
        smooth: { type: "curvedCCW", roundness: 0.04 },
      },
      {
        id: 31,
        from: "I",
        to: "J",
        label: initialGraph.I.J.toString(),
        smooth: { type: "curvedCCW", roundness: 0.04 },
      },
    ]);

    const data = { nodes: nodesRef.current, edges: edgesRef.current };

    const options = {
      nodes: {
        shape: "circle",
        size: 55,
        color: {
          border: "#000000",
          background: "#ffffff",
          highlight: { background: "#ffffff", border: "#1976d2" },
        },
        font: { size: 24, face: "arial" },
        borderWidth: 2,
        shapeProperties: { borderDashes: [6, 4] },
      },
      edges: {
        color: "#000000",
        font: {
          size: 20,
          strokeWidth: 5,
          strokeColor: "#ffffff",
          align: "horizontal",
        },
        hoverWidth: 3,
        selectionWidth: 6,
      },
      physics: { enabled: false },
      interaction: { dragNodes: true, hover: true },
    };

    const network = new Network(containerRef.current, data, options);

    network.on("click", (params) => {
      // Détection précise de l'arête sous le clic
      const clickedEdge = network.getEdgeAt(params.pointer.DOM);
      if (clickedEdge) {
        const item = edgesRef.current.get(clickedEdge);
        setCurrentEdge(clickedEdge);
        setEdgeValue(item.label);
        setOpenModal(true);
      }
    });

    network.once("afterDrawing", () => network.fit());
    return () => network.destroy();
  }, []);

  const handleSave = () => {
    if (currentEdge !== null && edgeValue !== "") {
      const edge = edgesRef.current.get(currentEdge);
      const newWeight = Number(edgeValue);

      if (isNaN(newWeight) || newWeight < 0) return;

      // 1. Update visuel
      edgesRef.current.update({
        id: currentEdge,
        label: newWeight.toString(),
      });

      // 2. Update logique
      const updatedGraph = {
        ...graphAdjacency,
        [edge.from]: {
          ...graphAdjacency[edge.from],
          [edge.to]: newWeight,
        },
        [edge.to]: {
          ...graphAdjacency[edge.to],
          [edge.from]: newWeight,
        },
      };

      setGraphAdjacency(updatedGraph);

      // ✅ 3. Sauvegarde dans localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGraph));
    console.log(updatedGraph);
      // 4. Reset
      resetGraph();
      setOpenModal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
  };

  useEffect(() => {
    const initialRow = ALL_NODES.map((node) => ({
      node,
      distance: node === startNode ? 0 : Infinity,
      isVisited: false,
      from: null, // ✅ Ajout du parent
    }));
    setDijkstraTable([initialRow]);
    setCurrentStep(0);
  }, [startNode]);
  const [endNode, setEndNode] = useState("L"); // Le sommet d'arrivée
  const [isFinished, setIsFinished] = useState(false);

  const highlightFinalPath = () => {
    // 1. Calcul Dijkstra rapide pour identifier les nœuds du chemin
    const distances = {};
    const prev = {};
    const unvisited = new Set(ALL_NODES);

    ALL_NODES.forEach((n) => (distances[n] = n === startNode ? 0 : Infinity));

    while (unvisited.size > 0) {
      let curr = Array.from(unvisited).reduce((minN, n) =>
        distances[n] < distances[minN] ? n : minN,
      );
      if (distances[curr] === Infinity) break;
      unvisited.delete(curr);
      if (curr === endNode) break;

      const neighbors = graphAdjacency[curr] || {}; // Changé ici
      for (const neighbor in neighbors) {
        let alt = distances[curr] + neighbors[neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          prev[neighbor] = curr;
        }
      }
    }

    // 2. Reconstruire le chemin (Array de noms de sommets)
    const pathNodes = [];
    let u = endNode;
    while (u) {
      pathNodes.unshift(u);
      u = prev[u];
    }

    // 3. Mise à jour visuelle des NOEUDS en ROUGE
    pathNodes.forEach((nodeId) => {
      nodesRef.current.update({
        id: nodeId,
        color: {
          background: "#ff4d4d", // Rouge
          border: "#b30000",
          highlight: { background: "#ff4d4d", border: "#b30000" },
        },
        font: { color: "#ffffff" },
      });
    });

    // 4. Mise à jour visuelle des ARÊTES (edges) en ROUGE
    for (let i = 0; i < pathNodes.length - 1; i++) {
      const from = pathNodes[i];
      const to = pathNodes[i + 1];

      const edge = edgesRef.current.get({
        filter: (e) =>
          (e.from === from && e.to === to) || (e.from === to && e.to === from),
      })[0];

      if (edge) {
        edgesRef.current.update({
          id: edge.id,
          color: "#ff4d4d",
          width: 4,
        });
      }
    }
    setIsFinished(true);
  };

  const handleNextStep = () => {
    if (dijkstraTable.length === 0) return;

    const lastRow = dijkstraTable[dijkstraTable.length - 1];

    // 1️⃣ Trouver le pivot : noeud non visité avec distance minimale
    let minDistance = Infinity;
    let pivotNode = null;

    for (const node of ALL_NODES) {
      const cell = lastRow.find((c) => c.node === node);
      if (!cell.isVisited && cell.distance < minDistance) {
        minDistance = cell.distance;
        pivotNode = node;
      }
    }

    // Si tous les noeuds sont visités, terminer et montrer le chemin final
    if (!pivotNode) {
      setCurrentStep(totalSteps);
      highlightFinalPath();
      return;
    }

    // 2️⃣ Mettre à jour visuellement le pivot
    nodesRef.current.update({
      id: pivotNode,
      color: { background: "#ffa500", border: "#cc8400" },
      font: { color: "#ffffff" },
    });

    // 3️⃣ Créer la nouvelle ligne de Dijkstra
    const nextRow = ALL_NODES.map((node) => {
      const prevCell = lastRow.find((c) => c.node === node);

      // Si déjà visité, garder les valeurs
      if (prevCell.isVisited) return { ...prevCell };

      // Marquer le pivot comme visité
      if (node === pivotNode) return { ...prevCell, isVisited: true };

      // Relaxation pour les voisins
      const weightFromPivot = graphAdjacency[pivotNode][node]; // Changé ici   let newDistance = prevCell.distance;
      let newDistance = prevCell.distance;

      let newFrom = prevCell.from;

      if (weightFromPivot !== undefined) {
        const potentialDistance = minDistance + weightFromPivot;
        // ✅ Mise à jour seulement si plus court
        if (potentialDistance < prevCell.distance) {
          newDistance = potentialDistance;
          newFrom = pivotNode;
        }
      }

      return {
        node,
        distance: newDistance,
        isVisited: false,
        from: newFrom,
      };
    });

    // 4️⃣ Ajouter la ligne suivante au tableau Dijkstra et avancer l'étape
    setDijkstraTable((prev) => [...prev, nextRow]);
    setCurrentStep((prev) => prev + 1);
  };

  // 🔹 Fonction pour reconstruire le chemin optimal vers une cible
  const getOptimalPath = (target) => {
    const path = [];
    let currentNode = target;

    while (currentNode) {
      path.unshift(currentNode);
      const lastRow = dijkstraTable[dijkstraTable.length - 1];
      const cell = lastRow.find((c) => c.node === currentNode);
      currentNode = cell.from;
    }

    return path;
  };

  const handlePreviousStep = () => {
    if (currentStep === 0 || dijkstraTable.length <= 1) return;

    // 1. Récupérer le nœud qui était le pivot à l'étape précédente
    // C'est celui qui est passé à isVisited: true dans la dernière ligne
    const lastRow = dijkstraTable[dijkstraTable.length - 1];
    const currentRowNodes = dijkstraTable[dijkstraTable.length - 2];

    const pivotToReset = ALL_NODES.find((node) => {
      const isVisitedNow = lastRow.find((c) => c.node === node).isVisited;
      const wasVisitedBefore = currentRowNodes.find(
        (c) => c.node === node,
      ).isVisited;
      return isVisitedNow && !wasVisitedBefore;
    });

    // 2. Réinitialiser la couleur du nœud sur le graphe
    if (pivotToReset) {
      nodesRef.current.update({
        id: pivotToReset,
        color: {
          background: "#ffffff",
          border: "#000000",
        },
        font: { color: "#000000" },
      });
    }

    // 3. Si on était à la fin (chemin rouge), on réinitialise tout le graphe
    if (isFinished) {
      ALL_NODES.forEach((nodeId) => {
        nodesRef.current.update({
          id: nodeId,
          color: { background: "#ffffff", border: "#000000" },
          font: { color: "#000000" },
        });
      });
      // Réinitialiser les arêtes en noir
      edgesRef.current.forEach((edge) => {
        edgesRef.current.update({ id: edge.id, color: "#000000", width: 1 });
      });
      setIsFinished(false);
    }

    // 4. Supprimer la dernière ligne du tableau et décrémenter l'étape
    setDijkstraTable((prev) => prev.slice(0, -1));
    setCurrentStep((prev) => prev - 1);
  };
  const initializeDijkstraTable = () => {
    const initialRow = ALL_NODES.map((node) => ({
      node,
      distance: node === startNode ? 0 : Infinity,
      isVisited: false,
      from: null,
    }));

    setDijkstraTable([initialRow]);
    setCurrentStep(0);
  };

  const resetGraph = () => {
    // Reset tableau Dijkstra
    initializeDijkstraTable();

    // Reset noeuds (visuel)
    ALL_NODES.forEach((nodeId) => {
      nodesRef.current.update({
        id: nodeId,
        color: {
          background: "#ffffff",
          border: "#000000",
        },
        font: { color: "#000000" },
      });
    });

    // Reset arêtes (visuel)
    edgesRef.current.forEach((edge) => {
      edgesRef.current.update({
        id: edge.id,
        color: "#000000",
        width: 1,
      });
    });

    // Reset état final
    setIsFinished(false);
  };

  const handleStartDijkstra = () => {
    setTabIndex(1); // Force le passage à l'onglet du tableau
    handleNextStep(); // Lance la première étape
  };

  const solveAllSteps = () => {
    // 1. Basculer l'onglet vers le tableau (index 1)
    setTabIndex(1);

    // 2. Si l'algo est déjà fini, on réinitialise avant de relancer
    if (isFinished) {
      resetGraph();
    }

    handleNextStep();
  };
  return (
    <div className="main-container">
      <div className="graphe1">
        <Box
          ref={containerRef}
          sx={{
            width: "100%",
            backgroundColor: "#ffffff",
            backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
            backgroundSize: "20px 20px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        />
      </div>

      <div className="option-container">
        <Box
          sx={{
            width: "100%",
            px: 3,
            "@media (max-width:720px)": {
              px: 1,
              fontSize: "0.9rem",
            },
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="fullWidth" // makes tabs stretch 100%
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Configuration" />
            <Tab label="Simulation" />
          </Tabs>
        </Box>

        <TabPanel value={tabIndex} index={0}>
          <div className="forms">
            {/* Sommet de Départ */}
            <TextField
              fullWidth
              select
              label="Sommet départ"
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              sx={{
                my: 2,
                fontFamily: "'Poppins', sans-serif",
                "@media (max-width:720px)": {
                  fontSize: "0.78rem",
                },
              }}
            >
              {ALL_NODES.map((node) => (
                <MenuItem
                  key={node}
                  value={node}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.9rem",
                    "@media (max-width:720px)": {
                      fontSize: "0.78rem",
                    },
                  }}
                >
                  Nœud {node}
                </MenuItem>
              ))}
            </TextField>

            {/* Sommet d'Arrivée */}
            <TextField
              fullWidth
              select
              label="Sommet arrivée"
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              sx={{
                my: 2,
                "@media (max-width:720px)": {
                  fontSize: "0.78rem",
                },
              }}
            >
              {ALL_NODES.map((node) => (
                <MenuItem
                  key={node}
                  value={node}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.9rem",
                    "@media (max-width:720px)": {
                      fontSize: "0.78rem",
                    },
                  }}
                >
                  Nœud {node}
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={solveAllSteps} // Ou une fonction qui lance l'algo direct
              sx={{
                fontFamily: "'Poppins', sans-serif",
                my: 3,
                borderRadius: 40,
                py: 1.7,
                "@media (max-width:720px)": {
                  fontSize: "0.78rem",
                },
              }}
            >
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>
                Trouver le chemin le plus rapide
              </span>
            </Button>

            <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #eee" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "text.secondary",
                  mb: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Résultat de l'algorithme
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {isFinished ? (
                  getOptimalPath(endNode).map((node, index, array) => (
                    <React.Fragment key={index}>
                      <Box
                        sx={{
                          px: 2,
                          py: 0.8,
                          borderRadius: 2,
                          backgroundColor: "#1976d2",
                          color: "white",
                          fontWeight: 700,
                          boxShadow: "0 4px 6px rgba(25, 118, 210, 0.2)",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {node}
                      </Box>
                      {index < array.length - 1 && (
                        <Typography sx={{ color: "#999", fontWeight: "bold" }}>
                          →
                        </Typography>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: "italic",
                      color: "#888",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Configurez les sommets et lancez la simulation...
                  </Typography>
                )}
              </Box>
            </Box>
          </div>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          {/* Chemin final */}
          {isFinished && (
            <Box
              sx={{
                my: 4,
                mx: "auto",
                p: 3,
                maxWidth: "450px", // Un peu plus large pour le confort
                borderRadius: 4,
                background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(179, 0, 0, 0.1)",
                textAlign: "center",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Typography
                variant="overline" // Plus élégant pour un label
                sx={{
                  color: "#b30000",
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  fontFamily: "'Poppins', sans-serif",
                  display: "block",
                  mb: 1,
                }}
              >
                Itinéraire Optimal
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                {getOptimalPath(endNode).map((node, index, array) => (
                  <React.Fragment key={index}>
                    <Typography
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        backgroundColor: "#fff",
                        borderRadius: 1,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#333",
                        border: "1px solid #eee",
                      }}
                    >
                      {node}
                    </Typography>
                    {index < array.length - 1 && (
                      <Typography sx={{ color: "#b30000", fontWeight: "bold" }}>
                        →
                      </Typography>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )}
          <Box sx={{ mt: 2, overflowX: "auto", userselect: "none" }}>
            <TableContainer
              sx={{
                mt: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Table size="medium">
                {" "}
                {/* Passé en medium pour plus d'aération */}
                <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        color: "#555",
                        borderRight: "1px solid #e0e0e0",
                      }}
                    >
                      Étape
                    </TableCell>
                    {ALL_NODES.map((n) => (
                      <TableCell
                        key={n}
                        align="center"
                        sx={{ fontWeight: 800, color: "#555" }}
                      >
                        {n}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dijkstraTable.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ "&:hover": { bgcolor: "#fcfcfc" } }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 700,
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        {idx}
                      </TableCell>
                      {row.map((cell, cIdx) => {
                        // --- LOGIQUE DE COLORATION SANS MODIFIER LE STATE ---
                        const nextRow = dijkstraTable[idx + 1];
                        // Un nœud est le pivot si dans la ligne suivante il devient visité (isVisited: true)
                        // et qu'il ne l'était pas dans la ligne actuelle.
                        const isPivotCell =
                          nextRow &&
                          nextRow.find((c) => c.node === cell.node)
                            ?.isVisited === true &&
                          cell.isVisited === false;

                        let bgColor = "white";
                        let textColor = "#333";

                        if (isPivotCell) {
                          bgColor = "#ffeb3b"; // Jaune
                          textColor = "#000";
                        } else if (cell.isVisited) {
                          bgColor = "#f5f5f5"; // Gris
                          textColor = "#999";
                        }

                        return (
                          <TableCell
                            key={cIdx}
                            align="center"
                            sx={{
                              bgcolor: bgColor,
                              color: textColor,
                              fontWeight: isPivotCell ? "bold" : "normal",
                              border: isPivotCell
                                ? "2px solid #fbc02d"
                                : "1px solid #eee",
                            }}
                          >
                            {cell.isVisited ? (
                              "-"
                            ) : cell.distance === Infinity ? (
                              "∞"
                            ) : (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "baseline",
                                }}
                              >
                                {cell.distance}
                                {cell.from && (
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontSize: "0.75rem",
                                      ml: 0.3,
                                      fontWeight: "bold",
                                      color: "primary.main",
                                    }}
                                  >
                                    {cell.from}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Boutons Suivant / Précédent */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeIcon />}
              disabled={currentStep === 0}
              onClick={handlePreviousStep} // Vérifiez si vous aviez bien nommé votre fonction
              sx={{
                borderRadius: 12,
                fontWeight: 600,
                px: 4,
                py: 1.4,
              }}
            >
              Précédent
            </Button>

            <Button
              variant="contained"
              endIcon={!isFinished && <NavigateNextIcon />}
              onClick={handleNextStep}
              disabled={isFinished}
              sx={{
                borderRadius: 12,
                fontWeight: 600,
                px: 4,
                py: 1.4,
              }}
            >
              {isFinished ? "Terminé" : "Étape Suivante"}
            </Button>
          </Box>
        </TabPanel>
      </div>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "40px",
            width: "100%",
            maxWidth: "470px",
            px: 1.7,
            py: 2,
            "@media (max-width:720px)": {
              borderRadius: "10px",
              px: 1,
              py: 1,
              maxWidth: "100%",
            },
          },
        }}
      >
        <DialogContent sx={{ mt: 2 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontFamily: "'Poppins', sans-serif",
              "@media (max-width:720px)": {
                fontSize: "0.8rem",
              },
            }}
          >
            Modifier la valeur numérique ou l'étiquette de cette connexion.
          </Typography>
          <TextField
            autoFocus
            type="number"
            label="Poids"
            fullWidth
            variant="outlined"
            value={edgeValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEdgeValue(e.target.value)}
            inputProps={{ min: "0", step: "1" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "2px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "24px 30px", // <-- Augmente le padding intérieur
                fontSize: "22px", // <-- Taille du texte à l'intérieur
              },
              "& .MuiInputLabel-root": {
                transform: "translate(20px, 20px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, mt: 2 }}>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: "8px",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disableElevation
            disabled={!edgeValue.trim()}
            sx={{
              borderRadius: "4px",

              px: 4,
              py: 1.5,

              fontFamily: "'Poppins', sans-serif",
              "@media (max-width:720px)": {
                fontSize: "0.7rem",
                fontWeight: 0,
              },
            }}
          >
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
      <Tooltip
        title="Réinitialiser le graphe"
        placement="left"
        arrow
        slotProps={{
          tooltip: {
            sx: {
              fontFamily: "'Poppins', sans-serif",

              fontSize: "15px", // 👈 augmente ici
              padding: "8px 12px", // optionnel (meilleure lisibilité)
            },
          },
        }}
      >
        <Fab
          color="primary"
          aria-label="reset"
          onClick={resetGraph}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 999,
            "@media (max-width:720px)": {
              top: 9,
              right: 10,
              width: 40,
              height: 40,
            },
          }}
        >
          <RefreshIcon
            sx={{
              fontSize: "1.5rem",
              "@media (max-width:720px)": {
                fontSize: "1.0rem",
              },
            }}
          />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default GraphComponent;
