import * as React from "react";
import PropTypes from "prop-types";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import {
  IconButton,
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function NumberField({
  id: idProp,
  label,
  error,
  helperText,
  size = "medium",
  min,
  max,
  ...other
}) {
  let id = React.useId();
  if (idProp) id = idProp;

  return (
    <BaseNumberField.Root
      min={min}
      max={max}
      {...other}
      style={{ width: "100%" }}
    >
      <FormControl
        fullWidth
        error={error}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.2s ease",
            backgroundColor: "#f9fafb",
            "&:hover": { backgroundColor: "#f3f4f6" },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
            },
          },
        }}
      >
        <InputLabel htmlFor={id} sx={{ fontWeight: 500 }}>
          {label}
        </InputLabel>

        <BaseNumberField.Input
          id={id}
          render={(props, state) => (
            <OutlinedInput
              {...props}
              label={label}
              inputProps={{
                style: {
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                },
              }}
              // BOUTON MOINS (START)
              startAdornment={
                <InputAdornment position="start">
                  <BaseNumberField.Decrement
                    render={
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "white",
                          border: "1px solid #e5e7eb",
                          "&:disabled": { opacity: 0.5 },
                        }}
                      />
                    }
                  >
                    <RemoveIcon fontSize="small" />
                  </BaseNumberField.Decrement>
                </InputAdornment>
              }
              // BOUTON PLUS (END)
              endAdornment={
                <InputAdornment position="end">
                  <BaseNumberField.Increment
                    render={
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "white",
                          border: "1px solid #e5e7eb",
                          "&:disabled": { opacity: 0.5 },
                        }}
                      />
                    }
                  >
                    <AddIcon fontSize="small" />
                  </BaseNumberField.Increment>
                </InputAdornment>
              }
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 0.5,
            px: 0.5,
          }}
        >
          <FormHelperText error={error} sx={{ m: 0, fontWeight: 500 }}>
            {helperText || `Valeur entre ${min} et ${max}`}
          </FormHelperText>

          {/* Badge discret indiquant les bornes */}
          <Typography variant="caption" color="text.disabled">
            Min: {min} / Max: {max}
          </Typography>
        </Box>
      </FormControl>
    </BaseNumberField.Root>
  );
}

NumberField.propTypes = {
  error: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  helperText: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(["medium", "small"]),
};

export default NumberField;
