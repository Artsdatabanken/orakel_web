import React from "react";
import "../App.css";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

function Frontpage({uploadMore,setExtendedManualVisible,goToInput}) {
  return (                 
    <div className="frontpage">              
    <h1 >Artsorakelet</h1> 
    <h2> Ta eller velg et bilde for å starte</h2>
    <p className="placeholder-body">
      Artsorakelet kjenner ikke igjen mennesker, husdyr,
      hageplanter, osv.
    </p>

    <button className="secondary" 
    onClick={setExtendedManualVisible}>Les Bruksanvisning</button>

    <div className={"bottomButtons"}>

        <input
          type="file"
          id="uploaderImages"
          onChange={uploadMore.bind(this, "uploaderImages")}
        />

      <button className="bottomButton big-round-button primary clickable" onClick={goToInput}>
        <AddAPhotoIcon />

      </button>
    </div>
  </div> 
  );
}

export default Frontpage;

