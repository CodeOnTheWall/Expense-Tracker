import ChartBar from "./ChartBar";

import classes from "./Chart.module.css";

const Chart = (props) => {
  // dataPoints={chartDataPoints}
  const dataPointValues = props.dataPoints.map((dataPoint) => dataPoint.value);
  // mapping over the array to just get the values associated with given month
  // console.log(dataPointValues);
  const totalMaximum = Math.max(...dataPointValues);
  // Math.max will give us the largest number, it doesnt combine or add, just finds largest number

  return (
    <div className={classes.chart}>
      {props.dataPoints.map((dataPoint) => (
        <ChartBar
          maxValue={totalMaximum}
          key={dataPoint.label}
          value={dataPoint.value}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
};

export default Chart;
