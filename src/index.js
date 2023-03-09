import React from "react";
import ReactDOM from "react-dom/client";

import ExpenseProvider from "./store/ExpenseProvider";
// only the main parent should import from the provider file, the rest import from the context file

import "./index.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ExpenseProvider>
    <App />
  </ExpenseProvider>
);
