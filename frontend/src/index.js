// react 18
import React from "react";
import { createRoot } from "react-dom/client";

// redux
import { Provider } from "react-redux";
import { store } from "./app/store";

// if using useContext
// import ExpenseProvider from "./store/ExpenseProvider";

import App from "./App";
import "./index.css";

// finding the element with id of root from index.html, calling it container
// creating a root with that container, then rendering jsx to that root
// hence all jsx will be rendered in that .root id in index.html
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  // <ExpenseProvider>
  <Provider store={store}>
    <App />
  </Provider>
  // </ExpenseProvider>
);
