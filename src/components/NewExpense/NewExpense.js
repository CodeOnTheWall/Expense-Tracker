import { useState, useContext } from "react";

import ExpenseContext from "../../store/expense-context";

import ExpenseForm from "./ExpenseForm";
import Button from "../UI/Button/Button";

import classes from "./NewExpense.module.css";

const NewExpense = () => {
  const [isEditing, setIsEditing] = useState(false);

  const onSaveCtx = useContext(ExpenseContext);
  // useContext makes sense here to lift our state up for all to use inside ExpenseProvider.js

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(),
      // important to always give a random id
    };
    onSaveCtx.onAddExpense(expenseData);
    // if we were prop drilling, then it could be props.onAddExpense(expenseData)
    // and this would send it up the chain to parent, parent would need to have passed onAddExpense down
    // and then the parent would have the addExpenseDataHandler
  };
  // enteredExpenseData is our param expected to receive from ExpenseForm.js
  // sending our useContext state the expenseData
  // called Handler as it handles our information

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  return (
    <div className={classes["new-expense"]}>
      {!isEditing && (
        <Button onClick={startEditingHandler}>Add New Expense</Button>
      )}
      {/* !false is true, so above button will show unless isEditing is true */}
      {isEditing && (
        <ExpenseForm
          onSaveExpense={saveExpenseDataHandler}
          onCancel={stopEditingHandler}
          // not actually using this onCancel, but I could if i wanted a button to close the form
        />
      )}
    </div>
  );
};

export default NewExpense;
