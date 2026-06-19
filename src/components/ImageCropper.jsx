import React, { useEffect, useState } from "react";
import Cropper from "react-cropper";
import piexif from "piexifjs";
import "cropperjs/dist/cropper.css";

import Slider from "@mui/material/Slider";
import DoneIcon from "@mui/icons-material/Done";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";

import "../App.css";
import { useTranslation } from "../i18n";
import { getExif, writeExif } from "../utils/utils";


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

export const ImageCropper = ({ imgFile, darkMode, imageCropped, imgSize }) => {
  const { t } = useTranslation();
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();
  const [zoom, setZoom] = useState(.25);
  // Min zoom is set once the image loads (in `ready`) — the value
  // where the smaller natural dimension exactly fills the crop box.
  const [minZoom, setMinZoom] = useState(0);
  const [exifdump, setExifdump] = useState();

  useEffect(() => {
    if (typeof imgFile !== "object") return;
    getExif(imgFile).then(setExifdump).catch(() => setExifdump(undefined));
  }, [imgFile]);

  // const initCropper = () => {
  //   console.log("trying");
  //   console.log("trying");
  //   if (!initialized && cropper && cropper.containerData) {
  //     console.log("ok");

  //     setInitialized(true);

  //     let cropBoxSize =
  //       Math.min(cropper.containerData.width, cropper.containerData.height) *
  //       0.9;

  //     // this.cropper.setCropBoxData({
  //     //   width: cropBoxSize,
  //     //   left: (this.cropper.cropper.containerData.width - cropBoxSize) / 2,
  //     //   top: (this.cropper.cropper.containerData.height - cropBoxSize) / 2,
  //     // });

  //     // Set the initial zoom to fit the smallest dimension
  //     let zoomFactor = Math.max(
  //       cropBoxSize /
  //         Math.min(
  //           cropper.canvasData.naturalWidth,
  //           cropper.canvasData.naturalHeight
  //         )
  //     );
  //     setZoom(zoomFactor);
  //     cropper.zoomTo(zoomFactor);
  //   }
  // };

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
            if (exifdump) {
              // getCroppedCanvas renders physically upright pixels (cropperjs
              // bakes in the source EXIF orientation). Re-attaching the
              // original EXIF must therefore reset Orientation to 1, otherwise
              // a rotated source — e.g. a phone portrait with Orientation 6 —
              // gets rotated a second time and the crop comes out sideways.
              //
              // Strip GPS too: location is sent to the API as separate
              // latitude/longitude form fields, so leaving it inside the JPEG
              // would mean shipping precise coordinates alongside the
              // coarsened fields.
              const cleanedExif = {
                ...exifdump,
                "0th": { ...(exifdump["0th"] || {}), [piexif.ImageIFD.Orientation]: 1 },
                GPS: {},
              };
              writeExif(blob, cleanedExif).then((withExif) => {
                imageCropped(withExif);
                setExifdump(undefined);
              });
            } else {
              imageCropped(blob);
            }
          },
          "image/jpeg",
          0.7
        );
    }
  };

  const cancel = () => {
    imageCropped();
  };

  const rotateLeft = () => {
    if (cropper && cropper.containerData) {
      cropper.rotate(-90);
    }
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

  // Bound the minimum zoom: after the proposed zoom step, the rendered
  // canvas (image) must still cover the crop box on both axes.
  // Reject the zoom otherwise so the user can never see anything but
  // image pixels inside the crop box.
  const doZoom = (event) => {
    const inst = event.target?.cropper || cropper;
    if (inst && inst.getCanvasData && inst.getCropBoxData) {
      const canvas = inst.getCanvasData();
      const cropBox = inst.getCropBoxData();
      const oldRatio = event.detail.oldRatio || 1;
      const newRatio = event.detail.ratio;
      const scale = newRatio / oldRatio;
      const newW = canvas.width * scale;
      const newH = canvas.height * scale;
      const epsilon = 0.5; // pixel rounding tolerance
      if (newW + epsilon < cropBox.width || newH + epsilon < cropBox.height) {
        event.preventDefault();
        return;
      }
    }
    setZoom(event.detail.ratio);
  };

  // Slider should never request a zoom below the computed min — the
  // doZoom guard would block it anyway and the slider would visually
  // desync from the actual zoom level.
  const clampZoomRequest = (value) => Math.max(value, minZoom);

  // After any pan, make sure the canvas (image) still covers the crop
  // box on all four sides — otherwise the crop would include empty
  // pixels. Snap the canvas back inside the bounds if it has drifted.
  const clampPan = (event) => {
    const inst = event.target?.cropper;
    if (!inst || !inst.getCanvasData || !inst.getCropBoxData) return;
    const canvas = inst.getCanvasData();
    const cropBox = inst.getCropBoxData();
    let { left, top } = canvas;
    if (left > cropBox.left) left = cropBox.left;
    if (top > cropBox.top) top = cropBox.top;
    const cropRight = cropBox.left + cropBox.width;
    const cropBottom = cropBox.top + cropBox.height;
    if (left + canvas.width < cropRight) left = cropRight - canvas.width;
    if (top + canvas.height < cropBottom) top = cropBottom - canvas.height;
    if (
      Math.abs(left - canvas.left) > 0.5 ||
      Math.abs(top - canvas.top) > 0.5
    ) {
      inst.setCanvasData({ left, top });
    }
  };

  const slideZoom = (event, newValue) => {
    if (!cropper) return;
    const target = clampZoomRequest(newValue);
    cropper.zoomTo(target);
    setZoom(target);
  };

  return (
    <div className={"cropContainer " + (darkMode ? "darkmode" : "lightmode")}>
      <div className="cropper">
        <Cropper
          style={{ width: "100%", height: "100%" }}
          aspectRatio={1}
          // viewMode 0 — no built-in canvas bounding. The `zoom`
          // handler enforces "image's smaller dimension >= crop box
          // side", which is the actually-useful constraint here
          // (viewMode 2 would bound the canvas to the *container*,
          // not the crop box, forcing the user to crop more than they
          // need to).
          viewMode={0}
          dragMode={"move"}
          zoom={doZoom}
          crop={clampPan}
          ready={(event) => {
            const inst = event.target?.cropper;
            if (!inst) return;
            const canvas = inst.getCanvasData();
            const cropBox = inst.getCropBoxData();
            // Initial zoom so the image's smaller natural dimension
            // exactly fills the corresponding crop-box side. That
            // becomes the floor — the user can zoom in further but
            // never out past this point.
            const smallerNatural = Math.min(
              canvas.naturalWidth,
              canvas.naturalHeight,
            );
            if (smallerNatural > 0) {
              const ratio = cropBox.width / smallerNatural;
              setMinZoom(ratio);
              inst.zoomTo(ratio);
              setZoom(ratio);
            }
          }}
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
          center
          onInitialized={(instance) => {
            setCropper(instance);

            if (typeof imgFile === "object") {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result);
              };
              reader.readAsDataURL(imgFile);
            } else {
              setImage("data:image/jpeg;base64," + imgFile);
            }
          }}
          src={image}
        />
      </div>
      <div className="editing">
        <RotateLeftIcon
          className="clickable imageEditButton"
          onClick={rotateLeft}
        />
        <ZoomOutIcon className="clickable imageEditButton" onClick={zoomOut} />
        <div className="slider">
          <Slider
            value={zoom}
            onChange={slideZoom}
            step={0.01}
            min={minZoom}
            max={Math.max(minZoom * 4, 2)}
            aria-labelledby="zoom-slider"
          />
        </div>
        <ZoomInIcon className="clickable imageEditButton" onClick={zoomIn} />
        <RotateRightIcon
          className="clickable imageEditButton"
          onClick={rotateRight}
        />
      </div>

      <div className="hint">{t("crop_hint")}</div>

      <div className="buttons">
        <div onClick={cancel} className="btn danger">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
            />
          </svg>
        </div>{" "}
        <div onClick={getCropData} className="btn ok">
          <DoneIcon />
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
