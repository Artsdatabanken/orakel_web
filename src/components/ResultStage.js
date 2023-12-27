import React from "react";
import "../App.css";
import ExtendedResult from "./ExtendedResult";
import Modal from "./Modal";

function ResultStage({loading,croppedImages,resetImages,predictions,IdResult,setChosenPrediction,chosenPrediction,closeModal,removeId}) {
  return (         
    <div className="stage">
      <div className="scrollable-field">
        <h2>Bildeutvalg</h2> 
        <div className="image-section">  
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

        <h2>Resultater</h2>
        {!!predictions.length && (
          <ul className="result-list">
            {predictions.map((prediction) => (
              <IdResult
                result={prediction}
                key={prediction.scientificNameID}
                croppedImages={croppedImages}
                openResult={setChosenPrediction}
              />
            ))}          
          </ul>
        )}
      {chosenPrediction &&
        <Modal 
            hasActions={true}
            isVisible={chosenPrediction}
            closeModal={closeModal}
            children={<chosenPrediction />}
            subChildren={<ExtendedResult
              result={chosenPrediction}
              croppedImages={croppedImages}
            />}
          />
          }
      </div>      
      <div className="page-bottom-actions">
        <button className="btn reset secondary" onClick={removeId}>
              Rediger Utvalg 
        </button>
        <button className="btn reset primary" onClick={resetImages}>
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
            />
          </svg> Tøm utvalg          
        </button>
      </div>    
    </div>
  );
}

export default ResultStage;

