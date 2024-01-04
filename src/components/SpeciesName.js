import React from "react";
import "../App.css";

// About hyphenate:
// The flaw in this is that the first word is still considered unbreakeable name for scientific names.

function noVernacularName(vernacularName,scientificName){
  if(vernacularName.toLowerCase() === scientificName.toLowerCase()){
    return true}
  return false;
}

function vernacularFormatter(vernacularName,scientificName){
  if(noVernacularName(vernacularName,scientificName)){
    return (
    <i className="scientific hyphenate">{vernacularName + " "}</i>);}
  return <span>{vernacularName  + " "}</span>
}

function SpeciesName({vernacularName,scientificName,inText,isTitle}) {
  // TODO: presentationstring? Why doesnt api deliver full preformatted string? 
     if(inText){
    return vernacularFormatter(vernacularName,scientificName)    
  }

  if(isTitle){
  return (         
    <>
     <h2>
     {vernacularFormatter(vernacularName,scientificName)}
     </h2>
 
     {!noVernacularName(vernacularName,scientificName) &&
       <h3>
         <i className="scientific hyphenate">{scientificName}</i>
       </h3>
     }
    </> 
   );
  }

  return (         
   <>
    <strong className="species-name-title">{vernacularFormatter(vernacularName,scientificName)}</strong>

    {!noVernacularName(vernacularName,scientificName) &&      
      <i className="scientific hyphenate">{scientificName}</i>      
    }
   </> 
  );
}

export default SpeciesName;

