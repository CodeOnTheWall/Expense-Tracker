// import { useContext } from "react";

// import ExpenseContext from "../../store/expense-context";

// const ExpenseDate = () => {
//   const dateCtx = useContext(ExpenseContext);

//   return (
//     <div className={classes["expense-date"]}>
//       <div>{dateCtx.expenseDate.toLocaleString()}</div>
//       {/* <div>{dateCtx.expenseDate.toISOString()}</div> */}
//       <div>Year</div>
//       <div>Day</div>
//     </div>
//   );
// };

// export default ExpenseDate;

import React from "react";

import classes from "./ExpenseDate.module.css";

const ExpenseDate = (props) => {
  const month = props.date.toLocaleString("en-US", { month: "long" });
  const day = props.date.toLocaleString("en-US", { day: "2-digit" });
  const year = props.date.getFullYear();

  return (
    <div className="expense-date">
      <div className={classes["expense-date-year"]}>{month}</div>
      <div className={classes["expense-date__year"]}>{year}</div>
      <div className={classes["expense-date__day"]}>{day}</div>
    </div>
  );
};

export default ExpenseDate;
