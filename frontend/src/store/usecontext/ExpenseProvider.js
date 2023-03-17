import { useState, useEffect } from "react";

import ExpenseContext from "./expense-context";

const DUMMY_EXPENSES = [
  {
    id: "e1",
    title: "Toilet Paper",
    amount: 94.12,
    date: new Date(2023, 7, 14),
  },
  { id: "e2", title: "New TV", amount: 799.49, date: new Date(2024, 2, 12) },
  {
    id: "e3",
    title: "Car Insurance",
    amount: 294.67,
    date: new Date(2025, 2, 28),
  },
  {
    id: "e4",
    title: "New Desk (Wooden)",
    amount: 450,
    date: new Date(2026, 5, 12),
  },
];

const ExpenseProvider = (props) => {
  const [expensesArray, setExpensesArray] = useState(DUMMY_EXPENSES);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
      // essentially, if the key value pair in local storage isLoggedIn:1 exists, then setIsLoggedIn(true)
    }
  }, []);
  // this useEffect is run after every component re evaluation
  // so if loginHandler is invoked, (giving the local storage the key value pair), then above useEffect will run again
  // since the UI re renders after someone logs in, useEffect() will run again, and will now find that there is that key value pair
  // and this will invoke setIsLoggedIn(true)
  // now our state isLoggedIn is set to true, and unless we sign out, we can re visit page without having to enter username/pw
  // useEffect (with empty dependency[]) only runs once per page load
  // the initial load wouldnt do anything for useEffect as the local storage doesnt have the keyvalue pairs yet

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };
  const loginHandler = () => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };
  // Handlers

  // react knows the previous state automatically, when used with a state changing function
  const addExpenseDataHandler = (expense) => {
    setExpensesArray((prevExpenses) => {
      return [expense, ...prevExpenses];
    });
  };

  const expenseContext = {
    expensesArray: expensesArray,
    onAddExpense: addExpenseDataHandler,
    isLoggedIn: isLoggedIn,
    onLogout: logoutHandler,
    onLogin: loginHandler,
  };

  // add value={someContext} so that all the children get these props/functions
  return (
    <ExpenseContext.Provider value={expenseContext}>
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;

// There are four reasons why a component would re-render itself: state changes,
// parent (or children) re-renders, context changes, and hooks changes. There is also
// a big myth: that re-renders happen when the component’s props change. By itself,
// it’s not true

// 1. STATE CHANGES - i.e. if state changes, then component re-renders
// const component = () => {
//   const [state, setState] = useState();
//   return something;
// };

// 2. PARENTS RE-RENDERS
// components re render themselves if parent re-renders (always going down a tree)

// 3. CONTEXT CHANGES - when value in context provider changes i.e.
// const ctx = useContext(expenseContext)
// when the value in expenseContext changes (referring to object of expenseContext),
// all components that use Context will re-render, even if they dont use the changed portion of the data directly
