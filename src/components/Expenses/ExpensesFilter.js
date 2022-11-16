import classes from "./ExpensesFilter.module.css";

const ExpensesFilter = (props) => {
  // selected={filteredYear} from Expenses.js (parent to child)
  // onChangeFilter={filterChangeHandler} from Expense.js (parent to child back to parent)
  const dropdownChangeHandler = (event) => {
    props.onChangeFilter(event.target.value);
  };
  // onChange invokes about Handler, which is sent to Expense.js to setFilteredYear

  return (
    <div className={classes["expenses-filter"]}>
      <div className={classes["expenses-filter__control"]}>
        <label>Filter by year</label>
        <select value={props.selected} onChange={dropdownChangeHandler}>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;
