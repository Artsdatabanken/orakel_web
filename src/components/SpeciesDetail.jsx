import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ReportButton from "./ReportButton";
import TaxonImage from "./taxonImage";
import { useTranslation } from "../i18n";

function capitalizeFirst(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function SpeciesDetail({ prediction, croppedImages }) {
  const { t } = useTranslation();
  const vernacular = prediction.vernacularName;
  const scientific = prediction.name;
  const sameName =
    vernacular && vernacular.toLowerCase() === scientific.toLowerCase();
  // Norwegian (and i18n) convention: vernacular names are lowercase
  // in running text, but capitalized when used as a heading.
  // Scientific names always render unchanged (italic, mid-sentence
  // capitalization is by genus convention which the API already gives).
  const rawName = vernacular && !sameName ? vernacular : scientific;
  const headingName = vernacular && !sameName ? capitalizeFirst(rawName) : rawName;
  const lowerName = rawName.toLowerCase();
  const percent = Math.round((prediction.probability ?? 0) * 100);
  const isMushroom = prediction.groupName === "Sopper";
  const blobImages = (croppedImages ?? []).map((p) => p.blob);

  return (
    <div className="speciesDetail">
      <div className="speciesDetail__main">
        <div className="speciesCard">
          <div className="speciesCard__thumb" aria-hidden>
            <TaxonImage result={prediction} size="64px" />
          </div>
          <div className="speciesCard__text">
            <p className="speciesCard__name">{headingName}</p>
            {vernacular && !sameName && (
              <p className="speciesCard__sci">{scientific}</p>
            )}
            <p className="speciesCard__group">{prediction.groupName}</p>
          </div>
        </div>

        {prediction.infoUrl && (
          <a
            href={prediction.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="speciesDetail__readMore"
          >
            <span>{t("read_more_detailed", { 1: lowerName })}</span>
            <span className="speciesDetail__external" aria-hidden>↗</span>
          </a>
        )}

        <div className="speciesDetail__score">
          <p className="speciesDetail__scoreHeading">
            <span className="speciesDetail__scoreIcon" aria-hidden>ⓘ</span>
            <span>{t("web_score_heading", { percent, name: lowerName })}</span>
          </p>
          <p className="speciesDetail__scoreBody">
            {t("certainty_text", { 1: percent, 2: lowerName })}
          </p>
        </div>

        {isMushroom && (
          <p className="speciesDetail__mushroomWarning" role="alert">
            <WarningIcon className="speciesDetail__mushroomIcon" />
            <span>{t("web_mushroom_warning")}</span>
          </p>
        )}
      </div>

      <aside className="speciesDetail__map" aria-labelledby="map-heading">
        <h3 className="speciesDetail__mapHeading" id="map-heading">
          {t("distribution_title")}
        </h3>
        {prediction.scientificNameID ? (
          <img
            className="speciesDetail__mapImage"
            src={`https://artskart.artsdatabanken.no/appapi/api/raster/distribution/?BBOX=-350770,6400000,1100000,9000000&height=800&width=500&ScientificNameId=${prediction.scientificNameID}`}
            alt={t("web_map_alt", { name: lowerName })}
            loading="lazy"
          />
        ) : (
          <div
            className="speciesDetail__mapPlaceholder"
            role="img"
            aria-label={t("web_no_observations")}
          />
        )}
        <ReportButton
          reportResult={prediction}
          croppedImages={blobImages}
        />
      </aside>
    </div>
  );
}

export default SpeciesDetail;
