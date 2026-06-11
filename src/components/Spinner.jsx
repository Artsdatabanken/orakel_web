import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

// Generic indeterminate spinner. Thin wrapper around MUI's
// CircularProgress so the rest of the app doesn't import MUI directly.
// Mirrors the iOS ProgressView() that the native app uses while
// awaiting the AI identification.
function Spinner({ size = "1em", label, ...rest }) {
  return (
    <CircularProgress
      size={size}
      thickness={4.5}
      color="inherit"
      role="progressbar"
      aria-label={label}
      {...rest}
    />
  );
}

export default Spinner;
