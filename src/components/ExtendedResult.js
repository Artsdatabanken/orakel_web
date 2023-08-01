import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";
import WarningIcon from "@mui/icons-material/Warning"


function ExtendedResult({ result, croppedImages, preventClick }) {
  const percentage = Math.round(result.probability * 100);
  const n_pics = croppedImages.length;

  return (
    <div className="extendedResult scrollable scrollbarless">
      <div
        className="resultLabels"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={
            result.vernacularName.toLowerCase() ===
            result.name.toLowerCase()
              ? "hyphenate vernacular italics"
              : "hyphenate vernacular"
          }
        >
          {result.vernacularName.charAt(0).toUpperCase()}
          &#8288;
          {result.vernacularName.slice(1)}
        </div>
        <div className="scientific hyphenate">
          {result.name.charAt(0)}
          &#8288;
          {result.name.slice(1)}
        </div>
      </div>

      <div className="resultDescription">
        Artsorakelet gir {percentage} % treff for{" "}
        <span
          className={
            result.vernacularName.toLowerCase() ===
            result.name.toLowerCase()
              ? "italics"
              : ""
          }
        >
          {result.vernacularName}
        </span>{" "}
        basert på {n_pics === 1 ? "bildet ditt" : "dine " + n_pics + " bilder"}.
        Det er ikke sagt at det stemmer, du må selv kontrollere at det er
        riktig, særlig hvis du skal rapportere funnet.
        {result.groupName === "Sopper" && (
          <div className="danger">
            <WarningIcon /> ALDRI SPIS NOE BASERT PÅ ARTSORAKELETS SVAR
          </div>
        )}
      </div>
      <div className="resultActions">
        <a
          href={result.infoUrl}
          target={"_blank"}
          rel="noopener noreferrer"
          className="btn primary"
        >
          Om arten
        </a>
        <ReportButton
          reportResult={result}
          croppedImages={croppedImages}
          preventClick={preventClick}
        />
      </div>
    </div>
  );
}

export default ExtendedResult;
