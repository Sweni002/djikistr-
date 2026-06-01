import React, { useEffect, useState, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import "vis-network/styles/vis-network.css";
import "./GraphVisualization.css";
import {
  Box,
  Card,
    Tabs,
  Tab,
  Table,
  TableHead,TableRow ,
  TableCell ,
  TableBody,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Autocomplete,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}



const GraphVisualization = () => {
  const [graph, setGraph] = useState({
    nodes: [
      { id: "A", label: "A - Dortoir" },
      { id: "B", label: "B - Laboratoire pratique" },
      { id: "C", label: "C - Salle de cours" },
      { id: "D", label: "D - Laboratoire électrique" },
      { id: "E", label: "E - Bâtiment Rommanee" },
      { id: "F", label: "F - Bibliothèque" },
      { id: "G", label: "G - Cantine" },
    ],
    edges: [
      { from: "A", to: "B", label: "120" },
      { from: "A", to: "C", label: "360" },
      { from: "B", to: "C", label: "165" },
      { from: "B", to: "D", label: "45" },
      { from: "B", to: "F", label: "165" },
      { from: "B", to: "G", label: "165" },
      { from: "C", to: "D", label: "180" },
      { from: "C", to: "F", label: "120" },
      { from: "C", to: "G", label: "240" },
      { from: "D", to: "E", label: "180" },
      { from: "D", to: "G", label: "180" },
      { from: "E", to: "G", label: "60" },
      { from: "F", to: "G", label: "180" },
    ],
  });
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
const [dijkstraTable, setDijkstraTable] = useState([]);
  const [bicycle, setBicycle] = useState(false);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [shortestPath, setShortestPath] = useState([]);
  const highlightedEdgesRef = useRef([]);
  const [displayText, setDisplayText] = useState("");
  const [distanceText, setDistanceText] = useState("");
  const [isLoading, setIsLoading] = useState(false); // étape 1
useEffect(() => {
  setIsLoading(true); // affiche le loader

  const nodes = new DataSet(
    graph.nodes
      .sort((a, b) => a.id.localeCompare(b.id)) // trie alphabétique

      .map((node) => ({
        id: node.id,
        label: node.id, // seulement l'ID dans le cercle
        title: node.label, // tooltip avec le nom complet
        color: {
          background: "#1976d2",
          border: "#0d47a1",
          highlight: "#42a5f5",
          hover: "#64b5f6",
        },
        font: { color: "#fff", size: 22, face: "Roboto" }, // texte plus grand
        shape: "circle",
        size: 40, // cercle plus grand
      })),
  );
  const edges = new DataSet(
    graph.edges.map((edge) => ({
      ...edge,
      color: "#888888", // gris
      width: 2,
      font: { size: 18, align: "top", color: "#555" },
      smooth: { type: "curvedCW", roundness: 0.2 },
      arrows: { to: false },
      length: parseInt(edge.label, 10) * 2, // <-- distance proportionnelle au poids
    })),
  );
  const data = { nodes, edges };
  const options = {
    layout: {
      improvedLayout: true, // tente de mieux répartir
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        iterations: 300, // plus d'itérations pour stabiliser le graphe
        updateInterval: 50,
        fit: true, // recentre le graphe après stabilisation
      },
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springLength: 100, // longueur de base des arêtes
        springConstant: 0.08,
        damping: 0.4,
        avoidOverlap: 1, // important pour éviter chevauchement
      },
      minVelocity: 0.1,
    },
    interaction: {
      hover: true,
      tooltipDelay: 100,
      dragNodes: true,
      zoomView: true,
      dragView: true,
    },
    nodes: {
      shape: "circle",
      size: 40,
      font: { color: "#1976d2", size: 22, face: "Roboto" },
    },
    edges: {
      color: "#888888",
      width: 2,
      smooth: { type: "curvedCW", roundness: 0.2 },
    },
  };
  const container = document.getElementById("graph-container");
  const network = new Network(container, data, options);

  // reset previous highlights
  highlightedEdgesRef.current.forEach((edgeId) => {
    edges.update({ id: edgeId, color: "#888888", width: 2 }); // remets gris
  });
  highlightedEdgesRef.current = [];

  // Reset node colors
  nodes.forEach((node) => {
    nodes.update({
      id: node.id,
      color: {
        background: "#1976d2",
        border: "#0d47a1",
        highlight: "#42a5f5",
        hover: "#64b5f6",
      },
    });
  });

  // Highlight shortest path
  shortestPath.forEach((node, index) => {
    // Color node en orange
    nodes.update({
      id: node,
      color: {
        background: "orange",
        border: "#ff9800",
        highlight: "orange",
        hover: "#ffb74d",
      },
    });

    // Color edge en rouge
    if (index < shortestPath.length - 1) {
      const edgeId = edges.getIds({
        filter: (edge) =>
          (edge.from === node && edge.to === shortestPath[index + 1]) ||
          (edge.to === node && edge.from === shortestPath[index + 1]),
      })[0];

      if (edgeId !== undefined) {
        edges.update({ id: edgeId, color: "#d32f2f", width: 4 });
        highlightedEdgesRef.current.push(edgeId);
      }
    }
  });
  // compute distance text
  let totalDistance = 0;
  const pathText = shortestPath
    .map((node, i) => {
      if (i < shortestPath.length - 1) {
        const edge = graph.edges.find(
          (e) => e.from === node && e.to === shortestPath[i + 1],
        );
        if (edge) totalDistance += parseInt(edge.label, 10);
      }
      return node;
    })
    .join(" → ");

  setDisplayText(pathText);
  setDistanceText(totalDistance.toString());
  setIsLoading(false);

  return () => network.destroy();
}, [graph, shortestPath]);


  const handleStartNodeChange = (event) => {
    setStartNode(event.target.value);
  };

  const handleEndNodeChange = (event) => {
    setEndNode(event.target.value);
  };

const handleVisualizeClick = () => {
  if (startNode && endNode) {
    setIsLoading(true); // étape 2 : démarre le loader

    const shortestPathResult = findShortestPath(graph, startNode, endNode);
    setShortestPath(shortestPathResult);

    // si findShortestPath est synchrone, on peut directement arrêter le loader :
    setIsLoading(false); // étape 3 : stop loader
  }
};
const findShortestPath = (graph, startNode, endNode) => {
  if (!startNode || !endNode || startNode === endNode) {
    setDijkstraTable([]);
    return [];
  }

  const unvisited = new Set(graph.nodes.map((node) => node.id));
  const distances = {};
  const previousNodes = {};
  const steps = []; // <-- ici on stocke les étapes

  graph.nodes.forEach((node) => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
  });

  while (unvisited.size > 0) {
    const currentNode = Array.from(unvisited).reduce((minNode, node) =>
      distances[node] < distances[minNode] ? node : minNode,
    );
    unvisited.delete(currentNode);

    // Pour chaque voisin du sommet actuel
    graph.edges
      .filter((edge) => edge.from === currentNode)
      .forEach((edge) => {
        const alt = distances[currentNode] + parseInt(edge.label, 10);
        if (alt < distances[edge.to]) {
          distances[edge.to] = alt;
          previousNodes[edge.to] = currentNode;
        }
      });

    // Enregistrer l'état actuel dans les steps
    const stepRow = {};
    graph.nodes.forEach((node) => {
      stepRow[node.id] =
        distances[node.id] === Infinity ? "∞" : distances[node.id];
    });
    steps.push(stepRow);
  }

  setDijkstraTable(steps); // <-- mettre à jour le tableau avec toutes les étapes

  // Construire le chemin le plus court
  const path = [];
  let currentNode = endNode;
  while (previousNodes[currentNode] !== undefined) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }
  path.unshift(startNode);

  return path;
};

  const handleBicycle = () => {
    setBicycle(!bicycle);
    if (!bicycle) {
      const bicycleGraph = {
        nodes: graph.nodes,
        edges: [
          { from: "A", to: "B", label: "75" },
          { from: "A", to: "C", label: "165" },
          { from: "B", to: "C", label: "165" },
          { from: "B", to: "D", label: "10" },
          { from: "B", to: "F", label: "165" },
          { from: "B", to: "G", label: "165" },
          { from: "C", to: "D", label: "180" },
          { from: "C", to: "F", label: "30" },
          { from: "C", to: "G", label: "240" },
          { from: "D", to: "E", label: "90" },
          { from: "D", to: "G", label: "180" },
          { from: "E", to: "G", label: "20" },
          { from: "F", to: "G", label: "60" },
        ],
      };

      setGraph(bicycleGraph);
    } else {
      setGraph({
        nodes: graph.nodes,
        edges: [
          { from: "A", to: "B", label: "120" },
          { from: "A", to: "C", label: "360" },
          { from: "B", to: "C", label: "165" },
          { from: "B", to: "D", label: "45" },
          { from: "B", to: "F", label: "165" },
          { from: "B", to: "G", label: "165" },
          { from: "C", to: "D", label: "180" },
          { from: "C", to: "F", label: "120" },
          { from: "C", to: "G", label: "240" },
          { from: "D", to: "E", label: "180" },
          { from: "D", to: "G", label: "180" },
          { from: "E", to: "G", label: "60" },
          { from: "F", to: "G", label: "180" },
        ],
      });
    }
  };

  return (
    <>
      <div className="main-container">
     
        <div className="option-container">
          <Box sx={{ width: "100%", px: 3 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth" // makes tabs stretch 100%
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Formulaire" />
              <Tab label="Tableau" />
            </Tabs>
          </Box>
          <TabPanel value={tabIndex} index={0}>
            <div className="forms">
              <TextField
                fullWidth
                select
                label="Sommet départ"
                value={startNode}
                onChange={handleStartNodeChange}
                sx={{ my: 2 }} // Adds margin top & bottom
              >
                {graph.nodes.map((node) => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="Sommet arrivée"
                value={endNode}
                onChange={handleEndNodeChange}
                sx={{ my: 2 }} // Adds margin top & bottom
              >
                {graph.nodes.map((node) => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.label}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleVisualizeClick}
                sx={{ fontFamily: "'Poppins', sans-serif", my: 3, py: 1.5 }}
              >
                Trouver le chemin le plus rapide
              </Button>

              <p className="result-text">Meilleur chemin : {displayText}</p>

              <p className="distance-text">
                Temps total : {distanceText} secondes
              </p>
            </div>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Typography variant="h6" gutterBottom>
              Tableau de Dijkstra (étapes)
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Étape</TableCell>
                  {graph.nodes.map((node) => (
                    <TableCell key={node.id}>{node.id}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dijkstraTable.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell> {/* numéro de l'étape */}
                    {graph.nodes.map((node) => (
                      <TableCell key={node.id}>{row[node.id]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        </div>
      </div>
    </>
  );
};

export default GraphVisualization;
