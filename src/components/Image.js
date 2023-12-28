import React from "react";
import "../App.css";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

function UploadedImage({ img, imgIndex, editImage, deleteImage }) {

  const doEdit = () => {
    editImage(imgIndex);
  };

  const doDeleteImage = () => {
    deleteImage(imgIndex)
  }

  return (
    <div className="imgContainer" >
       <button
          className="menu-icon icon-button secondary" 
          title="Lukk menu" 
          aria-label="Lukk meny"
          onClick={doDeleteImage}
          >
            <CloseIcon  />
          </button>
      <img
        className="uploadedImage"
        src={URL.createObjectURL(img)}
        alt="Uploaded"
      />
      <button className="secondary" onClick={doEdit}>
        <EditOutlinedIcon/> Rediger
      </button>
    </div>
  );
}

export default UploadedImage;
