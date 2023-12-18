import React from "react";
import "../App.css";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

function Frontpage({uploadMore,setExtendedManualVisible}) {
  return (                 
    <div class="frontpage">              
    <h1 >Artsorakelet</h1> 
    <h2> Ta eller velg et bilde for å starte</h2>
    <p className="placeholder-body">
      Artsorakelet kjenner ikke igjen mennesker, husdyr,
      hageplanter, osv.
    </p>

    <button className="secondary" 
    onClick={setExtendedManualVisible}>Les Bruksanvisning</button>

    <div className={"bottomButtons"}>
      <button className="bottomButton big-round-button primary clickable" >
        {/* TODO:: FIX INPUT NOT BEING ABLE TO UPLOAD (focus + click action) DUE TO WRONG ELEMENT TYPE*/}
        <AddAPhotoIcon />
        <input
          className="clickable"
          type="file"
          id="uploaderImages"
          onChange={uploadMore.bind(this, "uploaderImages")}
        />
      </button>
    </div>
  </div> 
  );
}

export default Frontpage;

