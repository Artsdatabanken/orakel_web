import React from "react";
import "../App.css";
import ReportButton from "./ReportButton";
import SpeciesName from "./SpeciesName";
import WarningIcon from "@mui/icons-material/Warning"
import TaxonImage from "./taxonImage";

function ExtendedResult({ result, croppedImages, preventClick }) {
  const percentage = Math.round(result.probability * 100);
  const n_pics = croppedImages.length;

  return (
    <>      
      <SpeciesName 
        vernacularName={result.vernacularName}
        scientificName={result.name}  
        isTitle={true} 
      />   

      <TaxonImage
          result={result}
          fullWidth={false}
        />

      <p className="resultDescription">
        Artsorakelet gir {percentage} % treff for{" "}
        <SpeciesName 
          vernacularName={result.vernacularName}
          scientificName={result.name}   
          inText={true}     
        />
        basert på {n_pics === 1 ? "bildet ditt" : "dine " + n_pics + " bilder"}.
        Det er ikke sagt at det stemmer, du må selv kontrollere at det er
        riktig, særlig hvis du skal rapportere funnet.
       
      </p>

      {result.groupName === "Sopper" && (
        <p className="danger">
          <WarningIcon /> ALDRI SPIS NOE BASERT PÅ ARTSORAKELETS SVAR
        </p>
      )}

      <div className="modal-actions">
        <a
          href={result.infoUrl}
          target={"_blank"}
          rel="noopener noreferrer"         
        >
          Om arten 
        </a>
        <ReportButton
          reportResult={result}
          croppedImages={croppedImages}
          preventClick={preventClick}
        />
      </div>
    </>
  );
}

export default ExtendedResult;
