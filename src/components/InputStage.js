import React from "react";
import "../App.css";
import UploadedImage from "./Image";
import Uploader from "./Uploader";
import UserFeedback from "./UserFeedback";
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ImageSearchOutlined from '@mui/icons-material/ImageSearchOutlined';

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
        

      
      <div class="imgContainer">        
            <div className="add-more-info uploadedImage">
                <span>Last opp flere bilder</span>
            </div>
          <Uploader 
          addImage={addImage} 
          goToInputStage={goToInputStage} 
          text={<><AddAPhotoOutlinedIcon/> Velg bilde</>}
          className={"secondary"}
          />
        </div>          
      </div>      
      

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
            <DeleteOutlineOutlinedIcon/> Tøm utvalg
          </button>
          <button className="btn id primary" onClick={getId} type="button" >
            <ImageSearchOutlined/> Finn forslag
          </button>
            </>
        )}
      </div>    
    </div>
  );
}

export default InputStage;

