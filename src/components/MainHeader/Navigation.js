import { useContext } from "react";

import ExpenseContext from "../../store/expense-context";
import Button from "../UI/Button/Button";
import classes from "./Navigation.module.css";

const Navigation = () => {
  // the original state of isLoggedIn is false, hence the below wont show without us being logged in
  // which would make isLoggedIn true and then render the below

  const ctx = useContext(ExpenseContext);
  // passing in a pointer to the context i want to use
  // our isLoggedIn is stored in expense-context.js, and we have access to this since
  // Index.js is wrapped in ExpenseProvider

  return (
    <nav className={classes.nav}>
      <ul>
        {ctx.isLoggedIn && (
          <li>
            <Button onClick={ctx.onLogout}>Logout</Button>
            {/* this is the native onClick event, and on a click, we will innoke onLogout */}
          </li>
        )}
      </ul>
    </nav>
  );
};
// if isLoggedIn is true, then (&&) render the following information

export default Navigation;
