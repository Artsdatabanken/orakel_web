import React from "react";
import "../App.css";
import UploadedImage from "./Image";
import UserFeedback from "./UserFeedback";

function InputStage({loading,croppedImages,editImage,resetImages,goToInput,getId,gotError}) {
  return (         
    <div className="stage">
      <div className="scrollable-field">
        <h2>Bildeutvalg</h2> 
        <div className={"images" + (loading ? " loading" : "")}>
          {croppedImages.map((img, index) => (
            <UploadedImage
              img={img}
              key={index}
              imgIndex={index}
              editImage={editImage}
            />
          ))}
        </div>
        <br/>
       <hr/>
        <button  className="secondary" onClick={goToInput}>
          Legg til mer?
        </button>  
        <UserFeedback
        inputStage={true}
        gotError={gotError}
        loading={loading}
      /> 
      </div>      

      <div className="page-bottom-actions">
        {!!croppedImages.length && (
          <>
          <button className="btn id secondary" onClick={resetImages} >
            Tøm utvalg
          </button>
          <button className="btn id primary" onClick={getId}>
            Identifiser
          </button>
            </>
        )}
      </div>    
    </div>
  );
}

export default InputStage;

