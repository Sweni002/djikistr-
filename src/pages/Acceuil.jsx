// src/pages/Accueil.jsx
import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import  styles from './acceuil.module.css'
import Logo from '../assets/logo.png'
import Bg from '../assets/bg.png'
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ArrowRight } from "phosphor-react";

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.image}>
            <img src={Logo} alt="Logo" />
          </div>
          <div className={styles.title}>
            <span>Djikistra</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.item1}>
          <img src={Bg} alt="Logo" />
        </div>

        <div className={styles.item1}>
          <div className={styles.column}>
            <div className={styles.logo}>
              <div className={styles.image}>
                <img src={Logo} alt="Logo" />
              </div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.text2}>
              <span>Projet Dijkstra</span>
            </div>
            <div className={styles.text3}>
              <span>Rapide</span>
              <div className={styles.dot}>.</div>
              <span style={{ marginLeft: 9 }}> Facile</span>
              <div className={styles.dot}>.</div>
              <span style={{ marginLeft: 9 }}> Optimal</span>
            </div>
          </div>

          <div className={styles.columns}>
            Trouvons le chemin le <br />
            plus court dans un graphe pondéré.
          </div>

          <div className={styles.columns1}>
            <Button
              onClick={() => navigate("/graphe")} // <-- redirection ici
              fullWidth
              variant="outlined" // bouton avec bordure seulement
              startIcon={<ArrowRight size={25} weight="bold" color="#21394e" />} // icône au début
              sx={{
                mt: 1,
                borderColor: "#6b7277", // couleur de la bordure
                borderWidth: 3, // épaisseur de la bordure
                borderStyle: "solid", // nécessaire si tu utilises borderWidth
                color: "#555454", // couleur du texte et de l'icône
                textTransform: "none", // garder le texte tel quel
                borderRadius: 50,
                p: 2,
                gap: 2,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "1.2rem",
                "&:hover": {
                  borderColor: "#115293",
                  backgroundColor: "rgba(25, 118, 210, 0.08)", // léger hover
                },
                "@media (max-width:720px)": {
                gap:1,
                p:2,
                fontSize:"0.9rem"
                },
              }}
            >
              Commencer maintenant
            </Button>
          </div>
        </div>

        <div className={styles.item1}>
          <img src={Bg} alt="Logo" />
        </div>
      </div>
    </div>
  );
}