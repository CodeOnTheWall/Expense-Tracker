import classes from "./ChartBar.module.css";

const ChartBar = (props) => {
  // key={dataPoint.label}
  // value={dataPoint.value}
  // maxValue={totalMaximum}
  // label={dataPoint.label}
  let barFillHeight = "0%";

  if (props.maxValue > 0) {
    barFillHeight = Math.round((props.value / props.maxValue) * 100) + "%";
  }

  return (
    <div className={classes["chart-bar"]}>
      <div className={classes["chart-bar__inner"]}>
        <div
          className={classes["chart-bar__fill"]}
          style={{ height: barFillHeight }}
        ></div>
      </div>
      <div className={classes["chart-bar__label"]}>{props.label}</div>
    </div>
  );
};

export default ChartBar;