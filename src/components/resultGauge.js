import React from "react";

function ResultGauge({ result}) {
  const percentage = result.probability * 100;

  const colors = [
    [170, 0, 0],
    [220, 214, 43],
    [76, 175, 80],
  ];

  const getColor = (percent) => {
    // TODO: choose some specific colors instead of a whole range.
    const colorIndex = (percent / 100.0) * (colors.length - 1);
    const lowFactor = 1 - (colorIndex % 1);
    const lowIndex = Math.floor(colorIndex);
    const highIndex = Math.min(lowIndex + 1, colors.length - 1);

    const r =
      colors[lowIndex][0] * lowFactor + colors[highIndex][0] * (1 - lowFactor);
    const g =
      colors[lowIndex][1] * lowFactor + colors[highIndex][1] * (1 - lowFactor);
    const b =
      colors[lowIndex][2] * lowFactor + colors[highIndex][2] * (1 - lowFactor);

    return `rgb(${parseInt(r)},${parseInt(g)},${parseInt(b)})`;
  };

  let color = getColor(percentage);

  const getText = (percentage) =>{
    // TODO: Adjust text and also steps
    if(percentage > 90){
      return "svært høy treffprosent"
    }else if(percentage > 70){
      return "høy treffprosent"
    }
    else if(percentage > 40){
      return "medium treffprosent"
    }
    else if(percentage > 25){
      return "lav treffprosent"
    }    
    else {
      return "svært lav treffprosent"
    }
  }

   return (
    <>
    <div
        style={{
          width:"20px",
          height:"20px",
          backgroundColor: color,
          borderRadius:"50%",
          display:"inline-block",
          marginRight:"4px"
        }}
      />      
     { getText(percentage)}      
    </>
  )

}

export default ResultGauge;
