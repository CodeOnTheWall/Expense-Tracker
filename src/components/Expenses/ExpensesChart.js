import Chart from "../Chart/Chart";

const ExpensesChart = (props) => {
  // filteredExpenses={filteredExpenses} from Expenses.js
  const chartDataPoints = [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "May", value: 0 },
    { label: "Jun", value: 0 },
    { label: "Jul", value: 0 },
    { label: "Aug", value: 0 },
    { label: "Sep", value: 0 },
    { label: "Oct", value: 0 },
    { label: "Nov", value: 0 },
    { label: "Dec", value: 0 },
  ];

  // for each expense, extract month of expense via getMonth
  // then add expense amount by inserting that month into chartDataPoints,
  // essentially giving it the value of expense.amount, then inserting
  // then giving Chart component our dataPoints
  for (const expense of props.filteredExpenses) {
    const expenseMonth = expense.date.getMonth(); // starting at 0 => January => 0
    // console.log(expenseMonth);
    chartDataPoints[expenseMonth].value += expense.amount;
    // console.log(chartDataPoints);
  }
  // adding the amount to the value of the particular month

  return <Chart dataPoints={chartDataPoints} />;
};

export default ExpensesChart;
