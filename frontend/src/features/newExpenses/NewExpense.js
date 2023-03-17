import { useState } from "react";

import ExpenseForm from "./ExpenseForm";
import Button from "../../components/UI/Button/Button";

import classes from "./NewExpense.module.css";

const NewExpense = () => {
  const [isEditing, setIsEditing] = useState(false);

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(),
      // important to always give a random id
    };
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
