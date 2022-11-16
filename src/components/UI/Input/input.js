import React, { useRef, useImperativeHandle } from "react";
// we need useImperativeHandler for very few situations, one is to call refs in other files

import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  // because we are passing props directly from Login.js to here, we dont need useContext
  // forwardRef allows us to pass this component function, and be bound to a ref

  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus();
  };

  useImperativeHandle(ref, () => {
    return {
      focus: activate,
      // activate refers to the function activate
      // focus is now externally available now
    };
  });

  // div className={classes["new-expense"]}

  return (
    <div
      className={`${props.className} ${
        props.isValid === false ? classes.invalid : ""
        // if truthy, give this div classes.invalid, if falsy (otherwise) do nothing
        // isValid is prop from emailIsValid which already points to an isValid emailState, hence give this class of invalid
      }`}
    >
      <label htmlFor={props.id}>{props.id}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        // this is our 2 way binding - resets form field after
        onChange={props.onChange}
        onBlur={props.onBlur}
        // onBlur event occurs when an object loses focus
        min={props.min}
        step={props.step}
        max={props.max}
      />
    </div>
  );
});

export default Input;
