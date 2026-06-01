import React, { useEffect, useState } from "react";
import GrapheSVG from "../components/Graphe";
import FormArete from "../components/Form";
import  styles from './graphe.module.css'
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.png'
import Bg from '../assets/bg.png'
import { Mosaic } from "react-loading-indicators";
import GraphComponent from "../components/Djikistra";
export default function Graphe() {
  const [data, setData] = useState(null);
  const sommets = ['A','B','C','D','E','F','G'];
const [loading, setLoading] = useState(true); // état loading

  // Récupérer l'URL de l'API depuis .env
  const API_URL = import.meta.env.VITE_API_URL;
useEffect(() => {
  const minLoad = setTimeout(() => {}, 1000); // 1 seconde minimum

  fetch(`${API_URL}/graphe`)
    .then(res => {
      if (!res.ok) throw new Error("Erreur réseau");
      return res.json();
    })
    .then(resData => {
      setData(resData);
    })
    .catch(err => {
      console.error("Impossible de récupérer les données :", err);
      setData(null); // ou des données factices
    })
    .finally(() => {
      clearTimeout(minLoad);
      setLoading(false); // toujours passer loading à false
    });
}, []);
  const ajouterArete = async (v1, v2, poids) => {
    await fetch(`${API_URL}/arete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v1, v2, poids })
    });

    const res = await fetch(`${API_URL}/graphe`);
    setData(await res.json());
  };


   if (loading) {
    return (
      <div className={styles.container} style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
        <Mosaic color="#1976d2" size="small" />
      </div>
    );
  }
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
        <div className={styles.grapheWrapper}>
          <GraphComponent />
        </div>
      
      </div>
    </div>
  );
}