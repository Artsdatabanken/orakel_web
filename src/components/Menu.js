import React from "react";

import i18next from "i18next";
import { useTranslation } from "react-i18next";

import "../App.css";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import AppleIcon from "@mui/icons-material/Apple";
import ShopOutlinedIcon from "@mui/icons-material/ShopOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReplayIcon from "@mui/icons-material/Replay";
import TranslateIcon from '@mui/icons-material/Translate';

function Menu({
  resetImages,
  toggleDarkMode,
  darkMode,
  toggleAbout,
  toggleManual,
}) {
  const { t } = useTranslation();

  const openAbout = () => {
    toggleAbout(true);
  };

  const openManual = () => {
    toggleManual(true);
  };

  return (
    <div className="content">
      <div className="modalHeader">
        <CloseIcon />
      </div>

      <div className="menuItem" onClick={toggleDarkMode}>
        <div>
          {darkMode ? t("Menu.Dark_mode_disable") : t("Menu.Dark_mode_enable")}
        </div>
        <Brightness4Icon />
      </div>

      <div className="menuItem" onClick={() => i18next.changeLanguage("nb")}>
        <div>
          {t("Menu.Change_language_to")}: Norsk Bokmål
        </div>
        <TranslateIcon />
      </div>


      <div className="menuItem" onClick={resetImages}>
        <div>{t("Menu.Restart_app")}</div>
        <ReplayIcon />
      </div>

      <a
        href="https://play.google.com/store/apps/details?id=no.artsdatabanken.orakel"
        target="_blank"
        rel="noopener noreferrer"
        className="menuItem"
      >
        <div>{t("Menu.App_on_google_play")}</div>
        <ShopOutlinedIcon />
      </a>

      <a
        href="https://apps.apple.com/no/app/id1522271415"
        target="_blank"
        rel="noopener noreferrer"
        className="menuItem"
      >
        <div>{t("Menu.App_in_app_store")}</div>
        <AppleIcon />
      </a>

      <div className="menuItem" onClick={openManual}>
        <div>{t("Menu.Manual")}</div>
        <MenuBookIcon />
      </div>

      <div className="menuItem" onClick={openAbout}>
        <div>{t("Menu.About")}</div>
        <InfoOutlinedIcon />
      </div>
    </div>
  );
}

export default Menu;
