import React, { useState } from "react";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "./App.css";
import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import ExtendedResult from "./components/ExtendedResult";
import UserFeedback from "./components/UserFeedback";
import ImageCropper from "./components/ImageCropper";
import Menu from "./components/Menu";
import About from "./components/About";
import ExtendedManual from "./components/ExtendedManual";

function App() {
  const [croppedImages, setCroppedImages] = useState([]);
  const [uncroppedImages, setUncroppedImages] = useState([]);
  const [fullImages, setFullImages] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputStage, setInputStage] = useState(true);
  const [resultStage, setResultStage] = useState(false);
  const [chosenPrediction, setChosenPrediction] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [extendedManualVisible, setExtendedManualVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [gotError, setError] = useState(false);

  document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown() {
    // Handle the back button
    setMenuVisible(false);
    setChosenPrediction(false);
    setAboutVisible(false);
    setExtendedManualVisible(false);
  }

  const addImage = async (images) => {
    setError(false);

    for (let i of images) {
      setUncroppedImages([...uncroppedImages, i]);
    }
  };

  const imageCropped = (img) => {
    if (img) {
      img.lastModifiedDate = new Date();
      img.name = new Date() + ".png";
      setCroppedImages([...croppedImages, img]);
      setFullImages([...fullImages, ...uncroppedImages]);
      setPredictions([]);
      setAlerts([]);
    }
    setUncroppedImages([]);
  };

  const editImage = (index) => {
    setUncroppedImages([fullImages[index]]);
    setFullImages(
      fullImages.slice(0, index).concat(fullImages.slice(index + 1))
    );
    setCroppedImages(
      croppedImages.slice(0, index).concat(croppedImages.slice(index + 1))
    );
    setInputStage(true);
    setResultStage(false);
  };

  const resetImages = () => {
    setMenuVisible(false);
    setError(false);
    setCroppedImages([]);
    setPredictions([]);
    setAlerts([]);
    setFullImages([]);
    setInputStage(true);
    setResultStage(false);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const closeModal = () => {
    setChosenPrediction(false);
    setAboutVisible(false);
    setExtendedManualVisible(false);
  };

  const goToInput = () => {
    setResultStage(false);
    setPredictions([]);
    setAlerts([]);
    setInputStage(true);
    document.getElementById("uploaderImages").click();
  };

  const uploadMore = async (sender) => {
    await addImage(document.getElementById(sender).files);
    document.getElementById(sender).value = "";
  };

  const getId = () => {
    setError(false);
    setInputStage(false);
    setLoading(true);

    var formdata = new FormData();

    formdata.append("application", "Artsorakel Web");

    for (let image of croppedImages) {
      formdata.append("image", image);
    }

    axios
      .post("https://ai.test.artsdatabanken.no/", formdata)
      // .post("http://localhost:5000/", formdata)
      // .post("https://airesearch.artsdatabanken.no/", formdata)
      .then((res) => {
        let predictions = res.data.predictions[0].taxa.items.filter(
          (pred) => pred.probability > 0.02
        );

        if (predictions.length === 0) {
          predictions = res.data.predictions[0].taxa.items;
        }

        if (predictions.length > 5) {
          predictions = res.data.predictions.slice(0, 5);
        }

        setPredictions(predictions);
        setAlerts(res.data.alerts);
        setLoading(false);
        setResultStage(true);
      })
      .catch((error) => {
        if (error.response && error.response.status) {
          setError(error.response.status);
        } else {
          setError(1);
        }
        setResultStage(false);
        setInputStage(true);
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      {!!uncroppedImages.length &&
        uncroppedImages.map((ucimg, index) => (
          <ImageCropper
            imgFile={ucimg}
            key={index}
            imageCropped={imageCropped}
            imgSize={500}
            darkMode={darkMode}
          />
        ))}

      <div
        id="AppContainer"
        className={"App" + (darkMode ? " darkmode" : " lightmode")}
      >
        <div
          id="modal"
          className={
            "modal " +
            (!!chosenPrediction | aboutVisible | extendedManualVisible
              ? "visible"
              : "invisible")
          }
          onClick={closeModal}
        >
          <div
            className="content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modalHeader">
              <CloseIcon onClick={closeModal} />
            </div>

            {!!chosenPrediction && (
              <ExtendedResult
                result={chosenPrediction}
                croppedImages={croppedImages}
              />
            )}

            {aboutVisible && <About />}

            {extendedManualVisible && <ExtendedManual />}
          </div>
        </div>

        <div
          id="menu"
          className={"modal " + (menuVisible ? "visible" : "invisible")}
          onClick={toggleMenu}
        >
          <Menu
            resetImages={resetImages}
            toggleDarkMode={toggleDarkMode}
            toggleAbout={setAboutVisible}
            toggleManual={setExtendedManualVisible}
            darkMode={darkMode}
          />
        </div>

        <div className="image-section">
          <div className="topBar">
            <MenuIcon
              className={
                "menu-icon" + (!inputStage && !resultStage ? " hidden" : "")
              }
              style={{ fontSize: "2em" }}
              onClick={toggleMenu}
            />

            <img
              src="Artsdatabanken_notext_mono_white.svg"
              alt="Artsdatabanken"
              className={
                "logo" + (!inputStage && !resultStage ? " hidden" : "")
              }
            />
          </div>
          <div
            className={
              "topContent" + (!inputStage && !resultStage ? " expanded" : "")
            }
          >
            {!croppedImages.length && (
              <div className="placeholder-container">
                <h1 className="placeholder-title">
                  Ta eller velg et bilde for å starte
                </h1>
                <p className="placeholder-body">
                  Artsorakelet kjenner ikke igjen mennesker, husdyr,
                  hageplanter, osv.
                </p>
              </div>
            )}

            <div
              className={"images scrollbarless" + (loading ? " loading" : "")}
            >
              {croppedImages.map((img, index) => (
                <UploadedImage
                  img={img}
                  key={index}
                  imgIndex={index}
                  editImage={editImage}
                />
              ))}

              {!!croppedImages.length && (inputStage || resultStage) && (
                <div className="goToInput" onClick={goToInput}></div>
              )}
            </div>
          </div>
        </div>

        <div
          className={
            "bottom-section scrollbarless " +
            (inputStage || resultStage ? "" : "hidden")
          }
        >
          {inputStage && !!croppedImages.length && (
            <div className="top-btn" onClick={getId} tabIndex="0">
              <div className="btn id primary">Identifiser</div>
            </div>
          )}

          {resultStage && (
            <div className="top-btn">
              <div
                className="btn reset primary"
                onClick={resetImages}
                tabIndex="0"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                  />
                </svg>
                {/* <ReplayIcon /> */}
              </div>
            </div>
          )}

          {resultStage &&
            !!alerts.filter((alert) => alert.alert.type === "pest").length && (
              <div>
                {alerts
                  .filter((alert) => alert.alert.type === "pest")
                  .map((alert) => (
                    <div className="danger" key={alert.scientific_name_id}>
                      Artsorakelet har en mistanke ({alert.probability * 100} %)
                      om at dette er{" "}
                      <span className="italics">{alert.scientific_name}</span>.
                      Denne planteskadegjøreren er meldepliktig:{" "}
                      <a href="https://www.mattilsynet.no/skjemaer/planter-og-planteskadegjorer/skjema/om-varselet">
                        meld fra til Mattilsynet
                      </a>
                    </div>
                  ))}
              </div>
            )}

          {resultStage && !!predictions.length && (
            <div>
              {predictions.map((prediction) => (
                <IdResult
                  result={prediction}
                  key={prediction.scientificNameID}
                  croppedImages={croppedImages}
                  openResult={setChosenPrediction}
                />
              ))}
            </div>
          )}

          {inputStage && (
            <UserFeedback
              inputStage={inputStage}
              gotError={gotError}
              loading={loading}
            />
          )}

          <div className={"bottomButtons " + (inputStage ? "" : "hidden")}>
            <div
              className="bottomButton newImageButton primary clickable"
              tabIndex="0"
            >
              <AddAPhotoIcon style={{ fontSize: ".8em" }} />
              <input
                className="clickable"
                type="file"
                id="uploaderImages"
                onChange={uploadMore.bind(this, "uploaderImages")}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
