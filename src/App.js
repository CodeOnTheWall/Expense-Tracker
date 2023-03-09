import { useContext } from "react";
// useContext to use our context hook and access info from that file without prop drilling

import ExpenseContext from "./store/expense-context";
// all components except the index.js import from the something-context

import MainHeader from "./components/MainHeader/MainHeader";
import Login from "./components/Login/Login";
import NewExpense from "./components/NewExpense/NewExpense";
import Expenses from "./components/Expenses/Expenses";

const App = () => {
  const loginCtx = useContext(ExpenseContext);
  return (
    <>
      <MainHeader />
      {!loginCtx.isLoggedIn && <Login />}
      {/* isLoggedIn would imply true, hence since !isLoggedIn would mean if not truthy, which is true, because isLoggedIn is false, so render Login component */}
      {loginCtx.isLoggedIn && (
        <main>
          <NewExpense />
          <Expenses />
        </main>
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
