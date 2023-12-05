import React from "react";
import { useTranslation } from "react-i18next";

import "../App.css";
import ReportButton from "./ReportButton";
import WarningIcon from "@mui/icons-material/Warning";
import TaxonImage from "./taxonImage";

function ExtendedResult({ result, croppedImages, preventClick }) {
  const { t } = useTranslation();

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
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 0,
            justifyContent: "center",
            paddingBottom: "1.2rem",
          }}
        >
          <TaxonImage result={result} size={0.5 * 40 + "rem"} />
        </div>
        <div
          className={
            result.vernacularName.toLowerCase() === result.name.toLowerCase()
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
        <div className="group hyphenate">{result.groupName}</div>
      </div>

      <div className="resultDescription">
        {t("Extended_result.Percentage_for", { percentage: percentage })}
        <span
          className={
            result.vernacularName.toLowerCase() === result.name.toLowerCase()
              ? "italics"
              : ""
          }
        >
          {result.vernacularName}
        </span>{" "}
        {n_pics === 1
          ? t("Extended_result.based_on_1_picture")
          : t("Extended_result.based_on_x_pictures", { pictures: n_pics })}{" "}
        {t("Extended_result.May_be_wrong")}
        {result.groupName === "Sopper" && (
          <div className="danger">
            <WarningIcon /> {t("Extended_result.NEVER_EAT_ANYTHING")}
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
          {t("Extended_result.About_the_species")}
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
