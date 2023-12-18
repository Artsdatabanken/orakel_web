import React from "react";
import "../App.css";
import CloseIcon from "@mui/icons-material/Close";

function Modal({header,children,subChildren,closeModal,isVisible}) {

  if (isVisible === false){
    return null;
  }
  
  return (
   
      <div
        id="modal"
        className="modal"
        onClick={closeModal}
      >
        <div className="content">
          <button onClick={closeModal}
          class="menu-button menu-icon icon-button inverted" 
          title="Lukk menu" 
          aria-label="Lukk meny">
            <CloseIcon  />
          </button>
         
         <h1>{header}</h1>     
         <div className="scrollable extendedManual">
         {children}
        {subChildren}
          </div>    
        
        </div>
      </div>
    

  );
}

export default Modal;

