import React from "react";

function ResultGauge({ result, theme, ranking }) {
  const percentage = result.probability * 100;
  let gaugeWidth = 100;
  let gaugeHeight = 8;

  const percentageWidth =
    percentage ** 1.75 * (100 / 100 ** 1.75) * (gaugeWidth / 100) + "%";
  const colors = [
    [170, 0, 0],
    [220, 214, 43],
    [76, 175, 80],
  ];

  const getColor = (percent) => {
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
  let ticks = [];

  for (let i = 10; i < 100; i = i + 10) {
    ticks = ticks.concat([i]);
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          marginTop: gaugeHeight * 2,
          width: gaugeWidth + "%",
          height: gaugeHeight,
          backgroundColor: color,
          opacity: 0.15,
          borderRadius: gaugeHeight / 2,
        }}
      />

      <div
        style={{
          position: "relative",
          width: percentageWidth,
          paddingLeft: "2%",
          height: gaugeHeight,
          backgroundColor: color,
          borderRadius: gaugeHeight / 2,
          marginTop: -gaugeHeight,
        }}
      />

      {ticks.map((t) => (
        <div
          key={t}
          style={{
            position: "relative",
            width: 2,
            height: gaugeHeight,
            marginTop: -gaugeHeight,
            marginLeft:
              t ** 1.75 * (100 / 100 ** 1.75) * (gaugeWidth / 100) + "%",
          }}
          className="tick"
        />
      ))}
    </>
  );
}

export default ResultGauge;
