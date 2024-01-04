import React from "react";

function ResultGauge({ result }) {
  const percentage = result.probability * 100;
  let gaugeWidth = 100;
  const steps=[90,70,40,20]

  const getText = (percentage) =>{
    // TODO: Adjust text and also steps
    if(percentage > steps[0]){
      return "svært høy"
    }else if(percentage > steps[1]){
      return "høy"
    }
    else if(percentage > steps[2]){
      return "medium"
    }
    else if(percentage > steps[3]){
      return "lav"
    }    
    else {
      return "svært lav"
    }
  }

  const getColor = (percentage) =>{
    if(percentage > steps[0]){
      return "clr-very-high"
    }else if(percentage > steps[1]){
      return "clr-high"
    }
    else if(percentage > steps[2]){
      return "clr-medium"
    }
    else if(percentage > steps[3]){
      return "clr-low"
    }    
    else {
      return "clr-very-low"
    }
  }

  let ticks = [];

  for (let i = 10; i < 100; i = i + 10) {
    ticks = ticks.concat([i]);
  }

  // TODO: fix tick width, should be steps of 10

  return (
    <div className="result-bar-wrapper">    
      <div className="result-bar unfilled"/>
      <div className={"result-bar filled " + getColor(percentage)}
          style={{
            width: percentage +"%",    
          }}
      />
      {ticks.map((t) => (
        <div
          key={t}
          style={{            
            marginLeft:
              t ** 1.75 * (100 / 100 ** 1.75) * (gaugeWidth / 100) + "%",
          }}
          className="tick"
        />
      ))}

<span>{getText(percentage)} overbevisning <small>(~{Math.round(percentage)}%)</small></span>
    </div>
  );
}

export default ResultGauge;