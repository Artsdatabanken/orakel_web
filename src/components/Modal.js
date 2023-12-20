import React from "react";
import "../App.css";
import CloseIcon from "@mui/icons-material/Close";

function Modal({header,children,subChildren,closeModal,isVisible,hasActions}) {

  if (isVisible === false){
    return null;
  }
  // TODO:: TRAP FOCUS
  // TODO:: TRAP SCROLL
  return (
   
      <div
        id="modal"
        className="modal"
        onClick={closeModal}
      >
        <div className="content" onClick={e => e.stopPropagation()}>
          <button onClick={closeModal}
          className="menu-button menu-icon icon-button inverted" 
          title="Lukk menu" 
          aria-label="Lukk meny">
            <CloseIcon  />
          </button>
         
         <h1>{header}</h1>     
         <div className={"scrollable " + (hasActions ? "has-actions" : "")}>
          {children}
          {subChildren}
        </div>  
        
        </div>
        
      </div>
    

  );
}

export default Modal;

