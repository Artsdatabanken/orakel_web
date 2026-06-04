import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useTranslation } from "../i18n";

function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="siteFooter">
      <div className="siteFooter__inner">
        <div className="siteFooter__toTop">
          <a href="#top" className="siteFooter__toTopBtn">
            <ArrowUpwardIcon style={{ fontSize: "1em" }} />
            <span>{t("web_back_to_top")}</span>
          </a>
        </div>

        <div className="siteFooter__columns">
          <section className="siteFooter__col">
            <h2 className="siteFooter__heading">{t("web_om_oss_heading")}</h2>
            <ul className="siteFooter__linkList">
              <li><a href="#">{t("web_om_artsdatabanken")}</a></li>
              <li><a href="#">{t("faq")}</a></li>
            </ul>
          </section>

          <section className="siteFooter__col">
            <h2 className="siteFooter__heading">{t("web_besoksadresse")}</h2>
            <p>{t("web_havnegata")}</p>

            <h2 className="siteFooter__heading siteFooter__heading--spaced">{t("web_postadresse")}</h2>
            <p style={{ whiteSpace: "pre-line" }}>{t("web_postadresse_line")}</p>

            <p className="siteFooter__contact">
              <a href="mailto:postmottak@artsdatabanken.no">postmottak@artsdatabanken.no</a>
            </p>
            <p>{t("web_org_number")}</p>
          </section>

          <section className="siteFooter__col siteFooter__col--social">
            <h2 className="siteFooter__heading">{t("web_social_label")}</h2>
            <ul className="siteFooter__social" aria-label={t("web_social_label_list")}>
              <li><a href="#" aria-label="Facebook"><FacebookIcon /></a></li>
              <li><a href="#" aria-label="Instagram"><InstagramIcon /></a></li>
              <li><a href="#" aria-label="LinkedIn"><LinkedInIcon /></a></li>
              <li><a href="#" aria-label="YouTube"><YouTubeIcon /></a></li>
            </ul>
          </section>
        </div>

        <div className="siteFooter__colophon">
          <a href="#">{t("web_personvern")}</a>
          <a href="#">{t("web_lisenser")}</a>
          <a href="#">{t("web_tilgjengelighet")}</a>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
