import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import DoneIcon from "@mui/icons-material/Done";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function () {
        var binStr = atob(canvas.toDataURL(type, quality).split(",")[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || "image/png" }));
      });
    },
  });
}

export const ImageCropper = ({ imgFile, imageCropped, imgSize }) => {
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();
  const [zoom, setZoom] = useState(.25);

  const getCropData = () => {
    if (cropper && cropper.containerData) {
      cropper
        .getCroppedCanvas({
          width: imgSize,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        })
        .toBlob(
          (blob) => {
            imageCropped(blob);
          },
          "image/jpeg",
          0.7
        );
    }
  };

  const cancel = () => {
    imageCropped();
  };

  const rotateRight = () => {
    if (cropper && cropper.containerData) {
      cropper.rotate(90);
    }
  };

  const zoomIn = () => {
    if (cropper && cropper.containerData) {
      cropper.zoom(0.1);
    }
  };

  const zoomOut = () => {
    if (cropper && cropper.containerData) {
      cropper.zoom(-0.1);
    }
  };

  const doZoom = (event) => {
    setZoom(event.detail.ratio);
  };

  return (
    <div className="cropContainer">
      <p>Zoom og flytt til motivet fyller firkanten</p>
      <div className="editing">
        <button className="secondary image-edit-button" onClick={zoomOut} >
        <ZoomOutIcon />Zoom ut</button>

        <button className="secondary image-edit-button" onClick={zoomIn} >
        <ZoomInIcon /> Zoom inn</button>

        <button className="secondary image-edit-button"
          onClick={rotateRight}>
        <RotateRightIcon/> Roter
        </button>
      </div>
      <div className="cropper">
        <Cropper
          style={{
            width: "calc(100vw - 48px)",
            height: window.innerHeight - 65 - 150 + "px",            

          }}
          aspectRatio={1}
          viewMode={0}
          dragMode={"move"}
          zoom={doZoom}
          autoCropArea={0.9}
          cropBoxMovable={false}
          cropBoxResizable={false}
          toggleDragModeOnDblclick={false}
          highlight={false}
          background={false}
          scalable={false}
          rotatable={true}
          wheelZoomRatio={0.2}
          guides={false}
          onInitialized={(instance) => {
            setCropper(instance);

            if (typeof imgFile === "object") {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result);
                // initCropper();
              };
              reader.readAsDataURL(imgFile);
            } else {
              setImage("data:image/jpeg;base64," + imgFile);
              // initCropper();
            }

          }}
          // ready={initCropper}
          src={image}
        />
      </div>
           
        <div className="modal-actions">      
          <button onClick={cancel} className="secondary">
          <DeleteOutlineOutlinedIcon/> Slett bilde
          </button>
          <button onClick={getCropData} className="primary">
            <DoneIcon /> Lagre bilde
          </button>
        </div>
      
    </div>
  );
};

export default ImageCropper;
