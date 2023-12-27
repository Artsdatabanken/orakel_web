import React from "react";
import "../App.css";
import Brightness4Icon from "@mui/icons-material/Brightness4";

function Settings({toggleDarkMode,darkMode}) {
  return (
    <>       
        <button className="secondary"  onClick={toggleDarkMode}>
        <div>Slå {darkMode ? "av" : "på"} nattmodus</div>
        <Brightness4Icon />
      </button>
      
    </>
  );
}

export default Settings;
