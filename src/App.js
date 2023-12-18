import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import UploadedImage from "./components/Image";
import IdResult from "./components/IdResult";
import ExtendedResult from "./components/ExtendedResult";
import UserFeedback from "./components/UserFeedback";
import ImageCropper from "./components/ImageCropper";
import About from "./components/About";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Frontpage from "./components/Frontpage";
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
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [gotError, setError] = useState(false);

  // i18 språkstøtte ?

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
    setError(false);
    setCroppedImages([]);
    setPredictions([]);
    setFullImages([]);
    setInputStage(true);
    setResultStage(false);
  };



  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
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

      <div className={"App" +(darkMode ? " darkmode" : " lightmode")}>

        <Header
          setAboutVisible={setAboutVisible}
          setExtendedManualVisible={setExtendedManualVisible}
          toggleSettings={toggleSettings}
          setChosenPrediction={setChosenPrediction}
        />
             

        {/* Faktisk appen */}
        <div id="main">

          {
          /* Forsiden*/
          (!croppedImages.length) ?
           (<Frontpage 
            uploadMore={uploadMore} 
            setExtendedManualVisible={setExtendedManualVisible}/>)
           :(
            <>

            {/* NOT front page */}
            
            
            {inputStage && (              
              <>
             
              
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
                

            

              <hr/>
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

              <UserFeedback
                inputStage={inputStage}
                gotError={gotError}
                loading={loading}
              /></>
            )}

            {resultStage && (
              
              <>
              <h2>"resultatsstadiet"</h2>

              <div className="image-section">            
              {/* 
                TODO:: make short cute display of these thumnails. NOT editable.
              */}
                      
              <div className={"images" + (loading ? " loading" : "")}>
                {croppedImages.map((img) => (
                  <img
                  className="uploadedImage"
                  src={URL.createObjectURL(img)}
                  alt="Uploaded"
                />
                ))}                  
              </div>
            </div>            

            {!!predictions.length && (
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

              <button className="btn reset primary" onClick={resetImages}
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                  />
                </svg> Tøm utvalg
                {/* <ReplayIcon /> */}
              </button>
               
              <Modal 
                isVisible={chosenPrediction}
                closeModal={closeModal}
                header={"Resultater"}
                children={<chosenPrediction />}
                subChildren={<ExtendedResult
                  result={chosenPrediction}
                  croppedImages={croppedImages}
                />
              }
            />
              </>
            )}
            
            
            </>


           )
          }
          
          {/* 
            - Nå er modalene nøstet opp og inn i én komponent.

          */} 
                    

          <Modal 
            isVisible={aboutVisible}
            closeModal={closeModal}
            header={"Om Artsobservasjoner"}
            children={<About />}
          />

          <Modal 
            isVisible={extendedManualVisible}
            closeModal={closeModal}
            header={"Bruksanvisning"}
            children={<ExtendedManual />}
          />
         
        </div>



      </div>
    </React.Fragment>
  );
}

export default App;
