// if using useContext
// import { useContext } from "react";
// import ExpenseContext from "./store/expense-context";

import MainHeader from "./components/MainHeader/MainHeader";
import NewExpense from "./features/newExpenses/NewExpense";
import Expenses from "./features/newExpenses/NewExpense";

import Login from "./features/auth/Login";
import NewUserForm from "./features/users/NewUserForm";

import { selectCurrentToken } from "./features/auth/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const App = () => {
  // STATES
  const [isSigningUp, setIsSigningUp] = useState(false);

  const token = useSelector(selectCurrentToken);

  const signUpHandler = () => {
    setIsSigningUp((prevIsSigningUp) => !prevIsSigningUp);
  };

  return (
    <>
      <MainHeader />
      {token ? (
        <main>
          <NewExpense />
          <Expenses />
        </main>
      ) : (
        <>
          {isSigningUp ? (
            <NewUserForm onRegister={signUpHandler} />
          ) : (
            <Login onSignUp={signUpHandler} />
          )}
        </>
      )}
    </>
  );
};

export default App;

// JSX code is HTML code inside of JS - Javascript XML

// React uses a Declarative Approach - define the desired target state(s) and React will output the JS DOM instruction

// Imperative Appreach from JS would be i.e.
// const para = document.createElement("p");
// para.textContent = "This is also visible";
// document.getElementById("root").append(para);
