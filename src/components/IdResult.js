import React from "react";
import "../App.css";
import TaxonImage from "./taxonImage";
import ResultGauge from "./resultGauge";

function IdResult({ result, openResult, croppedImages }) {

  const openResultModal = () => {
    openResult(result);
  };

  return (
    <li className="resultRow" onClick={openResultModal}>
      <button onClick={openResultModal}>
      
        <TaxonImage
          result={result}
          fullWidth={false}
        />
        

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
          <div className="danger">ALDRI SPIS NOE PGA APPEN</div>
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
      </button>
    </li>
  );
}

export default IdResult;
