// src/components/FormArete.jsx
import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Typography } from "@mui/material";

export default function FormArete({ sommets, onSubmit }) {
  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [poids, setPoids] = useState("");

  const handleSubmit = () => {
    if (!v1 || !v2 || !poids) return;
    onSubmit(v1, v2, parseInt(poids));
    setV1(""); setV2(""); setPoids("");
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, minWidth: 250 }}>
      <Typography variant="h6">Créer / Modifier Arête</Typography>

      <TextField
        select
        label="Sommet départ"
        value={v1}
        onChange={(e) => setV1(e.target.value)}
      >
        {sommets.map(s => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sommet arrivée"
        value={v2}
        onChange={(e) => setV2(e.target.value)}
      >
        {sommets.map(s => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>

      <TextField
        label="Poids"
        type="number"
        value={poids}
        onChange={(e) => setPoids(e.target.value)}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{fontFamily: "'Poppins', sans-serif"}}>
        Ajouter / Modifier
      </Button>
    </Box>
  );
}