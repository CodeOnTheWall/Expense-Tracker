import React, { useState, useContext } from "react";

import ExpenseContext from "../../store/expense-context";

import Card from "../UI/Card/Card";
import ExpensesFilter from "./ExpensesFilter";
import ExpensesChart from "./ExpensesChart";
import ExpensesList from "./ExpensesList";

import classes from "./Expenses.module.css";

const Expenses = () => {
  const ctx = useContext(ExpenseContext);

  const [filteredYear, setFilteredYear] = useState("2023");

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  const filteredExpenses = ctx.expensesArray.filter((expense) => {
    return expense.date.getFullYear().toString() === filteredYear;
  });
  // console.log(filteredExpenses);
  // filter method returns new array, filtering over the expensesArray to return a new array
  // that has expenses that ==== current filteredYear

  return (
    <Card className={classes.expenses}>
      <ExpensesFilter
        selected={filteredYear}
        onChangeFilter={filterChangeHandler}
      />
      <ExpensesChart filteredExpenses={filteredExpenses} />
      <ExpensesList filteredExpenses={filteredExpenses} />
    </Card>
  );
};

export default Expenses;
