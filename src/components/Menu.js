import React from "react";
import "../App.css";
import AppleIcon from "@mui/icons-material/Apple";
import ShopOutlinedIcon from "@mui/icons-material/ShopOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LaunchIcon from '@mui/icons-material/Launch';
import SettingsIcon from '@mui/icons-material/Settings';

function Menu({ resetImages, toggleDarkMode, darkMode, toggleAbout, toggleManual,toggleMenu,toggleSettings }) {

  const openAbout = () => {
    toggleMenu();
    toggleAbout(true);
  };

  const openManual = () => {
    toggleMenu();
    toggleManual(true); 
  }

  const openSettings = () => {
    toggleMenu();
    toggleSettings(true); 
  };

  /* TODO: UU requirement: Escape closes menu */

  return (
     <nav className="modal-wrapper">
        <ul> 
          <li>
            <a href="https://play.google.com/store/apps/details?id=no.artsdatabanken.orakel"
                target="_blank"
                rel="noopener noreferrer" onClick={toggleMenu}>
              <ShopOutlinedIcon />
              <span>Artsorakelet på Google Play</span>              
              <LaunchIcon />              
            </a>

          </li>
          <li>
            <a
              href="https://apps.apple.com/no/app/id1522271415"
              target="_blank"
              rel="noopener noreferrer" onClick={toggleMenu}>
              <AppleIcon />
              <span>Artsorakelet i App Store</span>
              <LaunchIcon />                  
            </a>
          </li>

          <li>
            <button onClick={openManual}>
              <MenuBookIcon />
              <span>Bruksanvisning</span>             
              <ChevronRightIcon />    
            </button>
          </li>

          <li>
            <button onClick={openAbout} >
              <InfoOutlinedIcon />
              <span>Om Artsorakelet</span>              
              <ChevronRightIcon />  
            </button>
          </li>
          <li>
            <button onClick={openSettings} >
              <SettingsIcon />
              <span>Innstillinger</span>              
              <ChevronRightIcon />  
            </button>
          </li>

        </ul>

      <button className="modal-background" onClick={toggleMenu}></button>
      </nav>

  );
}

export default Menu;
