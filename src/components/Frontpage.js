import React from "react";
import "../App.css";
import Uploader from "./Uploader";
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

function Frontpage({addImage,setExtendedManualVisible,goToInputStage}) {

  return (                 
    <div className="frontpage">              
    <h1 >Artsorakelet</h1> 
    <h2> Ta eller velg et bilde for å starte</h2>
    <p className="placeholder-body">
      Artsorakelet kjenner ikke igjen mennesker, husdyr,
      hageplanter, osv.
    </p>

    <button className="secondary" 
    onClick={setExtendedManualVisible}>
    Les bruksanvisning
    </button>

    <div className={"bottomButtons"}>
    
      <Uploader 
       addImage={addImage} 
       goToInputStage={goToInputStage} 
       text={<><AddAPhotoIcon /> <small>Velg bilde</small> </>}
       className={"bottomButton big-round-button primary clickable"}
       />

      
      
    </div>
  </div> 
  );
}

export default Frontpage;

