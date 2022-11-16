import ExpenseItem from "./ExpenseItem";
import classes from "./ExpensesList.module.css";

const ExpensesList = (props) => {
  // filteredExpenses={filteredExpenses} from Expenses.js
  if (props.filteredExpenses.length === 0) {
    return <h2 className="expenses-list__fallback">Found no expenses.</h2>;
  }

  return (
    <ul className={classes["expenses-list"]}>
      {props.filteredExpenses.map((filteredExpense) => (
        <ExpenseItem
          key={filteredExpense.id}
          title={filteredExpense.title}
          amount={filteredExpense.amount}
          date={filteredExpense.date}
        />
      ))}
    </ul>
  );
};

export default ExpensesList;
