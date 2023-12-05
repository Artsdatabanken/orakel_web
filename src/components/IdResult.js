import React from "react";
import { useTranslation } from "react-i18next";


import "../App.css";
import TaxonImage from "./taxonImage";
import ResultGauge from "./resultGauge";

function IdResult({ result, openResult, croppedImages }) {
  const {t} = useTranslation()
  const openResultModal = () => {
    openResult(result);
  };

  return (
    <div className="resultRow" onClick={openResultModal}>
      <div>
        <TaxonImage
          style={{
            flexGrow: 0,
            flexShrink: 0,
          }}
          result={result}
          fullWidth={false}
        />
      </div>

      <div className="resultLabels">
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
        <div className="hyphenate scientific">
          {result.name.charAt(0)}
          &#8288;
          {result.name.slice(1)}
        </div>
        <div className="group">{result.groupName}</div>
        {result.groupName === "Sopper" && (
          <div className="danger">{t("Brief_result_NEVER_EAT_ANYTHING")}</div>
        )}
        <ResultGauge result={result} />
      </div>

      <div className="chevron-right">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
          />
        </svg>
      </div>
    </div>
  );
}

export default IdResult;
