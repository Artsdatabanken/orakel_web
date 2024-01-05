import React from "react";
import "../App.css";
import TaxonImage from "./taxonImage";
import ResultGauge from "./resultGauge";
import SpeciesName from "./SpeciesName";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WarningIcon from "@mui/icons-material/Warning"

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
        
        <ResultGauge result={result} />

        {result.groupName === "Sopper" && (
         <p className="danger info-box tiny">
         <WarningIcon /> Aldri spis noe basert på forslag fra Artsorakelet!
       </p>
        )}
      </div>

      <div className="chevron-right">
        <ChevronRightIcon/>
      </div>
      </button>
    </li>
  );
}

export default IdResult;
