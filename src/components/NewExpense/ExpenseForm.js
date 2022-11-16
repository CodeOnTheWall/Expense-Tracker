import React, { Fragment, useState } from "react";

import Modal from "../UI/Modal/Modal";
import Input from "../UI/Input/input";
import Button from "../UI/Button/Button";

import classes from "./ExpenseForm.module.css";

const ExpenseForm = (props) => {
  // onSaveExpense={saveExpenseDataHandler} from NewExpense.js

  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDate, setEnteredDate] = useState("");

  const [error, setError] = useState();

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
    // console.log(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (enteredTitle.trim().length === 0 || enteredAmount.trim().length === 0) {
      // trim takes away any empty spaces (whitespace) without modifying the original string
      setError({
        title: "Invalid input",
        message: "Please enter a valid Title and Amount (non-empty values)",
      });
      return;
    }
    if (+enteredAmount < 1) {
      setError({
        title: "Invalid amount",
        message: "Please enter a valid Amount (>0)",
      });
      // note this is an object as error itself will have title and message to call on
      return;
    }
    const enteredExpenseData = {
      title: enteredTitle,
      amount: enteredAmount,
      date: new Date(enteredDate),
    };
    props.onSaveExpense(enteredExpenseData);
    // lifting this enteredExpenseData to our parent, NewExpense
    // here is good example of giving this data back to parent via props
    setEnteredTitle("");
    setEnteredAmount("");
    setEnteredDate("");
    // 2 way binding - also need value in input for 2 way binding to work, in order to reset form field
  };

  const errorHandler = () => {
    setError(null);
  };

  // I dont need these handlers in other files, so I wont use useContext here

  return (
    <Fragment>
      {error && (
        <Modal
          onCloseModal={errorHandler}
          title={error.title}
          message={error.message}
        />
      )}
      <form onSubmit={submitHandler}>
        <div className={classes["new-expense__controls"]}>
          <Input
            className={classes["new-expense__control"]}
            id="Title"
            // this is what shows as the label
            label="title"
            type="text"
            value={enteredTitle}
            onChange={titleChangeHandler}
          />
          <Input
            className={classes["new-expense__control"]}
            id="Amount"
            type="number"
            min="0.01"
            step="0.01"
            value={enteredAmount}
            onChange={amountChangeHandler}
          />
          <Input
            className={classes["new-expense__control"]}
            id="Date"
            type="date"
            min="2023-01-01"
            max="2026-12-31"
            value={enteredDate}
            onChange={dateChangeHandler}
          />
        </div>
        <div className={classes["new-expense__actions"]}>
          <Button type="submit">Add Expense</Button>
        </div>
      </form>
    </Fragment>
  );
};

export default ExpenseForm;
