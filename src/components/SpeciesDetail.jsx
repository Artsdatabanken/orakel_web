import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ReportButton from "./ReportButton";
import TaxonImage from "./taxonImage";
import { useTranslation } from "../i18n";
import { pickLocalized } from "../utils/utils";
import beakRaw from "../assets/breadcrumb-beak.svg?raw";

function capitalizeFirst(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const REDLIST_CODES = new Set(["CR", "EN", "VU", "NT", "DD", "LC"]);
const INVASIVE_CODES = new Set(["SE", "HI", "PH", "LO", "NK"]);

function CategoryBadge({ code, kind, t }) {
  const upper = code.toUpperCase();
  const lower = code.toLowerCase();
  return (
    <span className="categoryBadge">
      <span
        className="categoryBadge__circle"
        style={{ "--badge-color": `var(--${kind}-${lower})` }}
      >
        {upper}
      </span>
      <span className="categoryBadge__label">{t(`${kind}_${lower}`)}</span>
    </span>
  );
}

function SpeciesDetail({ prediction, croppedImages }) {
  const { t, activeCode } = useTranslation();
  const vernacular = pickLocalized(
    prediction.vernacularNames,
    undefined,
    activeCode,
  );
  const localizedGroupName = pickLocalized(
    prediction.groupNames,
    prediction.groupName,
    activeCode,
  );
  const scientific = prediction.name;
  const sameName =
    vernacular && vernacular.toLowerCase() === scientific.toLowerCase();
  const showVernacular = vernacular && !sameName;
  const rawName = showVernacular ? vernacular : scientific;
  const headingName = showVernacular ? capitalizeFirst(rawName) : rawName;
  const lowerName = rawName.toLowerCase();
  const percent = Math.round((prediction.probability ?? 0) * 100);
  // Scientific names render in italics; in the score line they also take a
  // capital first letter (the placeholder text otherwise lowercases the name).
  // Leave {name} unsubstituted so we can splice in the italic node ourselves.
  const [scoreBefore, scoreAfter] = t("web_score_heading", { percent }).split(
    "{name}",
  );
  const scoreNameNode = showVernacular ? (
    lowerName
  ) : (
    <em className="speciesDetail__scoreName">{capitalizeFirst(scientific)}</em>
  );
  // Mushroom warning keys off the canonical Norwegian group — placeholder
  // images and this check both rely on the untranslated field.
  const isMushroom = prediction.groupName === "Sopper";
  const blobImages = (croppedImages ?? []).map((p) => p.blob);

  const redListCode = prediction.redListCategory?.toUpperCase();
  const invasiveCode = prediction.invasiveCategory?.toUpperCase();
  const hasRedList = redListCode && REDLIST_CODES.has(redListCode);
  const hasInvasive = invasiveCode && INVASIVE_CODES.has(invasiveCode);

  return (
    <div className="speciesDetail">
      <div className="speciesCard">
        <div className="speciesCard__thumb" aria-hidden>
          <TaxonImage result={prediction} size="89px" />
        </div>
        <div className="speciesCard__text">
          <p className="speciesCard__name">
            {showVernacular ? (
              headingName
            ) : (
              <em className="speciesCard__nameSci">{rawName}</em>
            )}
          </p>
          {showVernacular && (
            <p className="speciesCard__sci">{scientific}</p>
          )}
          <p className="speciesCard__group">{localizedGroupName}</p>
        </div>
      </div>

      {(hasRedList || hasInvasive) && (
        <div className="categoryBadges">
          {hasRedList && (
            <CategoryBadge code={redListCode} kind="redlist" t={t} />
          )}
          {hasInvasive && (
            <CategoryBadge code={invasiveCode} kind="invasive" t={t} />
          )}
        </div>
      )}

      {prediction.infoUrl && (
        <a
          href={prediction.infoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="speciesDetail__readMore"
        >
          <span>{t("read_more_detailed", { 1: lowerName })}</span>
          <span className="speciesDetail__external" aria-hidden>
            <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H6V1.33333H1.33333V10.6667H10.6667V6H12V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM4.46667 8.46667L3.53333 7.53333L9.73333 1.33333H7.33333V0H12V4.66667H10.6667V2.26667L4.46667 8.46667Z"
              />
            </svg>
          </span>
          <span
            className="speciesDetail__beak"
            aria-hidden
            dangerouslySetInnerHTML={{ __html: beakRaw }}
          />
        </a>
      )}

      <div className="speciesDetail__score">
        <p className="speciesDetail__scoreHeading">
          <span className="speciesDetail__scoreIcon" aria-hidden>
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
              />
            </svg>
          </span>
          <span>
            {scoreBefore}
            {scoreNameNode}
            {scoreAfter}
          </span>
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

      <section className="speciesDetail__map" aria-labelledby="map-heading">
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
      </section>
    </div>
  );
}

export default SpeciesDetail;
