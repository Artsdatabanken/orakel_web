import React from "react";
import "../App.css";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import AppleIcon from "@mui/icons-material/Apple";
import ShopOutlinedIcon from "@mui/icons-material/ShopOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReplayIcon from "@mui/icons-material/Replay";

function Menu({ resetImages, toggleDarkMode, darkMode, toggleAbout, toggleManual }) {

  const openAbout = () => {
    toggleAbout(true);
  };

  const openManual = () => {
    toggleManual(true);
  };

  return (
    <div className="content">
      <CloseIcon />
      <div className="menuItem" onClick={toggleDarkMode}>
        <div>Slå {darkMode ? "av" : "på"} nattmodus</div>
        <Brightness4Icon />
      </div>

      <div className="menuItem" onClick={resetImages}>
        <div>Restart appen</div>
        <ReplayIcon />
      </div>

      <a
        href="https://play.google.com/store/apps/details?id=no.artsdatabanken.orakel"
        target="_blank"
        rel="noopener noreferrer"
        className="menuItem"
      >
        <div>Artsorakelet på Google Play</div>
        <ShopOutlinedIcon />
      </a>


      <a
        href="https://apps.apple.com/no/app/id1522271415"
        target="_blank"
        rel="noopener noreferrer"
        className="menuItem"
      >
        <div>Artsorakelet i App Store</div>
        <AppleIcon />
      </a>

      <div className="menuItem" onClick={openManual}>
        <div>Bruksanvisning</div>
        <MenuBookIcon />
      </div>

      <div className="menuItem" onClick={openAbout}>
        <div>Om Artsorakelet</div>
        <InfoOutlinedIcon />
      </div>
    </div>
  );
}

export default Menu;
