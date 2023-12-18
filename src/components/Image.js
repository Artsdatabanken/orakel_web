import React from "react";
import "../App.css";
import CloseIcon from "@mui/icons-material/Close";

function UploadedImage({ img, imgIndex, editImage }) {

  const doEdit = () => {
    editImage(imgIndex);
  };

  return (
    <div className="imgContainer" >
       <button
          class="menu-icon icon-button secondary" 
          title="Lukk menu" 
          aria-label="Lukk meny">
            <CloseIcon  />
          </button>
      <img
        className="uploadedImage"
        src={URL.createObjectURL(img)}
        alt="Uploaded"
      />
      <button className="secondary" onClick={doEdit}>
        Rediger
      </button>
    </div>
  );
}

export default UploadedImage;
