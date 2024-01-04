import React from "react";
import "../App.css";
import TaxonImage from "./taxonImage";
import ResultGauge from "./resultGauge";
import SpeciesName from "./SpeciesName";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function IdResult({ result, openResult, croppedImages }) {

  const openResultModal = () => {
    openResult(result);
  };

  return (
    <li className="resultRow">
      <button className="secondary" onClick={openResultModal}>      
        <TaxonImage
          result={result}
        />       
      <div className="result-labels">
        <SpeciesName 
          vernacularName={result.vernacularName} 
          scientificName={result.name}
        />
        <div className="species-group">{result.groupName}</div>
        {result.groupName === "Sopper" && (
          <div className="danger">ALDRI SPIS NOE PGA APPEN</div>
        )}
        <ResultGauge result={result} />
      </div>

      <div className="chevron-right">
        <ChevronRightIcon/>
      </div>
      </button>
    </li>
  );
}

export default IdResult;
