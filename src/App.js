import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import IdResult from "./components/IdResult";
import ImageCropper from "./components/ImageCropper";
import About from "./components/About";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Frontpage from "./components/Frontpage";
import ExtendedManual from "./components/ExtendedManual";
import InputStage from "./components/InputStage";
import ResultStage from "./components/ResultStage";
import Settings from "./components/Settings";

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
    setSettingsVisible(false);
  };

  const goToInputStage = () => {
    setResultStage(false);
    setPredictions([]);
    setInputStage(true);
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

  const removeId = () =>{
    setError(false);
    setInputStage(true);
    setLoading(false);
    setPredictions([]);
  }

  return (
    <React.Fragment>
      <div className={"app" +(darkMode ? " darkmode" : " lightmode")}>
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
            addImage={addImage} 
            goToInputStage={goToInputStage} 
            setExtendedManualVisible={setExtendedManualVisible}/>)
           :(
            <>
            {/* NOT front page  */}
              {inputStage && (             
              <InputStage
                loading={loading}
                croppedImages={croppedImages}
                editImage={editImage}
                resetImages={resetImages}
                getId={getId}
                gotError={gotError}
                addImage={addImage} 
                goToInputStage={goToInputStage} 
              />
              )}

              {resultStage && (
                <ResultStage 
                loading={loading}
                croppedImages={croppedImages}
                resetImages={resetImages}
                predictions={predictions}
                IdResult={IdResult}
                setChosenPrediction={setChosenPrediction}
                chosenPrediction={chosenPrediction}
                closeModal={closeModal}
                removeId={removeId}
                />
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
         
         <Modal 
            isVisible={settingsVisible}
            closeModal={closeModal}
            header={"Innstillinger"}
            children={<Settings toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>}
          />
         

          <Modal 
            hasActions={true}
            isVisible={!!uncroppedImages.length}
            closeModal={console.log("must make this one")}
            header={"Rediger bilde"}
            children={uncroppedImages.map((ucimg, index) => (
              <ImageCropper
                imgFile={ucimg}
                key={index}
                imageCropped={imageCropped}
                imgSize={500}
                darkMode={darkMode}
              />
            ))
            }
            
            />
         
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
