import React from "react";
import "../App.css";
import UploadedImage from "./Image";
import Uploader from "./Uploader";
import UserFeedback from "./UserFeedback";

function InputStage({loading,croppedImages,editImage,deleteImage,resetImages,getId,gotError, addImage,goToInputStage}) {
  
  
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
              deleteImage={deleteImage}
            />
          ))}
        </div>
        <br/>
       <hr/>     

       <Uploader 
       addImage={addImage} 
       goToInputStage={goToInputStage} 
       text={"Legg til flere"}
       className={"secondary"}
       />

        <UserFeedback
        inputStage={true}
        gotError={gotError}
        loading={loading}
      /> 
      </div>      

      <div className="page-bottom-actions">
        {!!croppedImages.length && (
          <>
          <button className="btn id secondary" onClick={resetImages} type="button" >
            Tøm utvalg
          </button>
          <button className="btn id primary" onClick={getId} type="button" >
            Identifiser
          </button>
            </>
        )}
      </div>    
    </div>
  );
}

export default InputStage;

