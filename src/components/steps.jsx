import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const StepProgressBar = ({ currentStep = 0, totalSteps = 7 }) => {
 const percent = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
  return (
    <Box
      sx={{
        width: "100%",
        px: 2,
        py: 4,
        "@media (max-width:720px)": {
      px:0,
    py:1 
         },
      }}
    >
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            width: "100%",
            height: 35,
            borderRadius: 1,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #2196f3 0%, #3e7aa1 100%)",
              borderRadius: percent === 100 ? "4px" : "4px 0 0 4px",
              transition: "transform 0.4s ease-out", // Plus fluide que linear
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: `${percent}%`,
            top: -8,
            bottom: -8,
            display: "flex",
            alignItems: "center",
            // On ajuste le transform pour que le label ne sorte pas à 0% et 100%
            transform:
              percent > 90
                ? "translateX(-110%)"
                : percent < 10
                  ? "translateX(10%)"
                  : "translateX(-100%)",
            transition: "left 0.4s ease-out",
            pointerEvents: "none",
            borderRight: percent > 5 ? "10px solid #2196f3" : "none",
            borderRadius: "12px",
            pr: 2,
            zIndex: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: percent < 10 ? "#2196f3" : "white", // Texte bleu si barre trop courte
              fontWeight: "bold",
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              textShadow: percent < 10 ? "none" : "0px 0px 4px rgba(0,0,0,0.3)",
            }}
          >
            {`${percent}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StepProgressBar;
