import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";
import SpeciesName from "./SpeciesName";
import WarningIcon from "@mui/icons-material/Warning"
import TaxonImage from "./taxonImage";
import LaunchIcon from '@mui/icons-material/Launch';

function ExtendedResult({ result, croppedImages, preventClick }) {
  const percentage = Math.round(result.probability * 100);
  const n_pics = croppedImages.length;

  return (
    <div className="species-presentation">      
      <SpeciesName 
        vernacularName={result.vernacularName}
        scientificName={result.name}  
        isTitle={true} 
      />   

      <span className="species-group big">
        {result.groupName}
      </span><br/>

      <TaxonImage
          result={result}
          bigImage={true}
        />


      <hr/>
      <div className="result-description">
        <p>
          Artsorakelet er {percentage} % overbevist om at {" "}
          {n_pics === 1 ? "bildet ditt" : "dine " + n_pics + " bilder"}
          {" "} viser arten {" "}
          <SpeciesName 
            vernacularName={result.vernacularName}
            scientificName={result.name}   
            inText={true}     
          />
        </p> 
        <p>
          Artsorakelet kan bare kjenne igjen arter den har sett mange bilder av og kan derfor ta feil.
        </p>
        <p>Kontroller at arten stemmer før du rapporterer funnet</p>

        {result.groupName === "Sopper" && (
          <p className="danger info-box">
            <WarningIcon /> Aldri spis noe basert på forslag fra Artsorakelet!
          </p>
        )}
      </div>

      <div className="modal-actions">
      <a
        className="external-link"
          href={result.infoUrl}
          target={"_blank"}
          rel="noopener noreferrer"         
        >
          Les mer om arten <LaunchIcon />             
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
