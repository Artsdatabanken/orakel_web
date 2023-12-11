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

  // i18 språkstøtte ?
  

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

    formdata.append("application", "Artsorakel Web")

    for (let image of croppedImages) {
      formdata.append("image", image);
    }

    axios
      .post("https://ai.artsdatabanken.no/", formdata)
      // .post("http://localhost:5000/", formdata)
      // .post("https://airesearch.artsdatabanken.no/", formdata)
      .then((res) => {
        let predictions = res.data.predictions[0].taxa.items.filter(
          (pred) => pred.probability > 0.02
        );

        if (predictions.length === 0) {
          predictions = res.data.predictions[0].taxa.items
        }

        if (predictions.length > 5) {
          predictions = res.data.predictions.slice(0, 5);
        }

        setPredictions(predictions);
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
        className={
          "App" +
          (darkMode ? " darkmode" : " lightmode")
        }
      >

        <div className="topBar">
          <button onClick={toggleMenu} className={
              "menu-button menu-icon icon-button" + (!inputStage && !resultStage ? " hidden" : "")
            } title="Menu" aria-label="Meny">
            <MenuIcon/>
          </button>          

          <img
            src="Artsdatabanken_notext_mono_white.svg"
            alt="Artsdatabanken"
            className={
              "logo" + (!inputStage && !resultStage ? " hidden" : "")
            }
          />
        </div>
        {/* Modal med: meny? */}
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

        {/* Faktisk appen */}
        <div id="main">
          <div className="image-section">
            
            <div
              className={
                "topContent" + (!inputStage && !resultStage ? " expanded" : "")
              }
            >
              {!croppedImages.length && (
                <div className="placeholder-container">
                  <h1 className="placeholder-title">Artsorakelet</h1> 
                  <h2 className="placeholder-title">
                  
                    Ta eller velg et bilde for å starte
                  </h2>
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
              <button className="btn id primary" onClick={getId} tabIndex="0">
                Identifiser
              </button>
            )}

            {resultStage && (
                <button
                  className="btn reset primary"
                  onClick={resetImages}
                  tabIndex="0"
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                    />
                  </svg> Tøm utvalg
                  {/* <ReplayIcon /> */}
                </button>
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

              <button
                className="bottomButton big-round-button primary clickable"
                
              >
                <AddAPhotoIcon />
                <input
                  className="clickable"
                  type="file"
                  id="uploaderImages"
                  onChange={uploadMore.bind(this, "uploaderImages")}
                />
              </button>

            </div>
          </div>
          
                  {/* Modal med overliggende lag, brukes til:
          - les mer om artsinfo
          - om artsdatabanken
          - bruksannvisning

          Hvorfor ligger den ØVERST? */} 
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
              <button onClick={closeModal} class="menu-button menu-icon icon-button inverted" title="Lukk menu" aria-label="Lukk meny"><CloseIcon  /></button>

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
        </div>



      </div>
    </React.Fragment>
  );
}

export default App;
