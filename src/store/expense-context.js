import React from "react";

const ExpenseContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
});
// dummy functions simply to get ide auto completion in other files
// creating our context to use in other files

export default ExpenseContext;
