import React, { useState } from "react";
import "../App.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Menu from "./Menu";

function Header({setAboutVisible,setExtendedManualVisible,toggleSettings,setChosenPrediction}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  function closeAll() {
    // TODO: This is supposed to be on ESCAPE button, handle later
    setMenuVisible(false);
    setChosenPrediction(false);
    setAboutVisible(false);
    setExtendedManualVisible(false);
  }

  document.addEventListener("escape", closeAll, false); // not the way in react

  return (         
         
    <header> 
      {/* Header + navigeringsmeny
          - ting som er tilgjengelig for alle over alt :) <3
      */}
      <img
        src="Artsdatabanken_notext_mono_white.svg"
        alt="Artsdatabanken logo"
        className={"logo"}
      />
      <a href="/" class="clear-link" >Artsorakelet</a>
      <button onClick={toggleMenu} className={
          "menu-button menu-icon icon-button"
        } 
        title={menuVisible ? ("Lukk meny") : ("Åpne meny")} 
        aria-label={menuVisible ? ("Lukk meny") : ("Åpne meny")}
        >
        {menuVisible ? (
          <CloseIcon/>
        ) : ( 
          <MenuIcon/>
        )}
      </button>     
      {menuVisible && 
      
      <Menu
        toggleAbout={setAboutVisible}
        toggleManual={setExtendedManualVisible}
        toggleMenu={toggleMenu}
        toggleSettings={toggleSettings}
        //resetImages={resetImages}
        //toggleDarkMode={toggleDarkMode}
        //darkMode={darkMode}
      />}     
  </header>
    

  );
}

export default Header;

