import React from "react";
import "../App.css";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import AppleIcon from "@mui/icons-material/Apple";
import ShopOutlinedIcon from "@mui/icons-material/ShopOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReplayIcon from "@mui/icons-material/Replay";

function Menu({ resetImages, toggleDarkMode, darkMode, toggleAbout, toggleManual, toggleMenu }) {

  const openAbout = () => {
    toggleAbout(true);
  };

  const openManual = () => {
    toggleManual(true);
  };

  return (

     <nav class="menu">

        <ul> 
          <li className="menuItem">
            <a href="https://play.google.com/store/apps/details?id=no.artsdatabanken.orakel"
                target="_blank"
                rel="noopener noreferrer">
              <span>Artsorakelet på Google Play</span>
              <ShopOutlinedIcon />
            </a>

          </li>
          <li className="menuItem">
            <a
              href="https://apps.apple.com/no/app/id1522271415"
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <span>Artsorakelet i App Store</span>
              <AppleIcon />
            </a>
          </li>

          <li className="menuItem" >
            <button onClick={openManual}>
            <div>Bruksanvisning</div>
            <MenuBookIcon /></button>
          </li>

          <li className="menuItem" >
            <button onClick={openAbout} >
            <span>Om Artsorakelet</span>
            <InfoOutlinedIcon /></button>
          </li>

        </ul>

      <h2>Settings</h2>
      {/* Move to settings*/}
        <div className="menuItem" onClick={toggleDarkMode}>
        <div>Slå {darkMode ? "av" : "på"} nattmodus</div>
        <Brightness4Icon />
      </div>
      

      
   {/* 
      <div className="menuItem" onClick={resetImages}>
        <div>Restart appen</div>
        <ReplayIcon />
      </div>*/}
    
      
      </nav>

  );
}

export default Menu;
