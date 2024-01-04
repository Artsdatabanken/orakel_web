import React from "react";
import { useRef } from 'react';
import "../App.css";

function Uploader({goToInputStage,text, className,addImage,showDashedBorderElement}) {

  const uploadImages = async (files) => {
    console.log("uploading time yeah");
    await addImage(files);
  };

    const hiddenFileInput = useRef(null);
  
    const handleClick = event => {
      goToInputStage();
      hiddenFileInput.current.click();
    };  

    const handleChange = event => {      
      uploadImages(event.target.files);
    };

  return(
    <>
    {showDashedBorderElement &&
     <div className="add-more-info uploadedImage" onClick={handleClick}>
        <span>Last opp flere bilder</span>
    </div>
    }
    <button className={className} onClick={handleClick}>
        {text}
      </button>
      <input
        id="uploaderImages"
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{display: 'none'}} 
      />
      </>
  )

}

export default Uploader;

