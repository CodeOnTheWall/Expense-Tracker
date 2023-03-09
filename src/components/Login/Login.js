// use useReducer when you update a state that depends on another state to avoid problems

import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";
// our hooks
// useState to manage our formIsValid state, which essentially wont allow us to login unless we are valid
// useEffect stops constant rendering for us and only renders intially and then after emailIsValid/passwordIsValid
// useReducer is better state management
// useContext to forward info to our onLogin prop in useContext file
// useRef to focus a particular field

import ExpenseContext from "../../store/expense-context";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/input";

const ACTIONS = {
  USERINPUT: "USERINPUT",
  INPUTBLUR: "INPUTBLUR",
};

// reducerFn(s), in this case emailReducer, will automatically get the most recent state snapshot from react (param of state)
// reducerFn(s) can be outside the functional component
// when a dispatchFn is called, react will call reducerFn's and then the reducerFn will match the if with the info of the passed in action,
// and return a new state (via passing emailReducer into useReducer which updates state, and clears the dispatch for more dispatches to come)
const emailReducer = (state, action) => {
  // the state will contain value and isValid
  if (action.type === ACTIONS.USERINPUT) {
    return {
      value: action.emailInputValue,
      isValid: action.emailInputValue.includes("@"),
    };
  }
  if (action.type === ACTIONS.INPUTBLUR) {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
  // if no .includes('@') then return default state
};

const passwordReducer = (state, action) => {
  if (action.type === ACTIONS.USERINPUT) {
    return {
      value: action.passwordInputValue,
      isValid: action.passwordInputValue.trim().length > 6,
    };
  }
  if (action.type === ACTIONS.INPUTBLUR) {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};
// the 2 above reducers allow us to manage both the value and validity (isValid) into one state, managed by useReducer, whenever we receive user input action

const Login = () => {
  const authCtx = useContext(ExpenseContext);

  const [formIsValid, setFormIsValid] = useState(false);
  // our states
  // useReducer always returns an array with exactly 2 values, which below we destructure to get emailState and dispatchEmail
  // this is better state management, so first value (emailState) is latest state snapshot, and second value is a function that allows us to update that state snapshot
  // after onChange or onBlur, that goes to their relative handlers, which then dispatch the data to the reducer funcs, which then update the state here
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  // onChange event occurs, pointing to emailChangeHandler, in turn forwards that dispatchEmail to emailReducer, which in turn returns new state
  // this state will be passed into useReducer, which in turn gives us again a new destructured array with new emailState and another dispatchEmail
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // these new consts (emailIsValid and passwordIsValid) imply that the state isValid:true, via object destructuring
  // so now our useEffect will only run the first render, but then after that only when we have valid inputs
  // this stops excess re rendering and use of our useEffect

  // useEffect with dependencies i.e. [enteredEmail, enteredPassword] will work after inital render of the component
  // and it will always be re triggered/re executed on change of one of the listed dependencies
  // useEffect always runs after everything else inside the functional component runs
  // console.log(emailIsValid);
  // console.log(passwordIsValid);
  // null to start
  useEffect(() => {
    // useEffect helps us deal with code that should be executed in response to something else
    // in this example, the button going from disabled to enabled (formisValid from false to true)
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(
        emailIsValid && passwordIsValid
        // setFormIsValid will only run 2 second after, if emailIsValid and passwordIsValid, which are consts that already imply isValid: true
      );
    }, 2000);
    // we can use this identifier to clear this timer - after 1 sec setFormIsValid will run
    return () => {
      console.log("clean up");
      clearTimeout(identifier);
      // this is the cleanup function that will clear the timer on setTimout
    };
  }, [emailIsValid, passwordIsValid]);
  // console.log(emailIsValid);
  // whatever is used inside the useEffect, must be put in the dependencies except the state changing function (setFormIsValid)

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: ACTIONS.USERINPUT,
      emailInputValue: event.target.value,
    });
  };
  // passing dispatchEmail an action, which is always consumed/passed into first arg of useReducer (in this case emailReducer)
  // our type field describes what happened, and emailInputValue is the value the user entered
  // so now we will send type and emailInputValue as an action to be passed into emailReducer
  // this action is sent as an object

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: ACTIONS.USERINPUT,
      passwordInputValue: event.target.value,
    });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: ACTIONS.INPUTBLUR });
  };
  // dont need to add a val here as all we care about is that input lost focus

  const validatePasswordHandler = () => {
    dispatchPassword({ type: ACTIONS.INPUTBLUR });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
      // forwarding our authCtx our emailState.value, passwordState.value
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
      // if formIsValid is false, i want to focus the first input i find
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          className={classes.control}
          ref={emailInputRef}
          id="email"
          // this is what is the label title
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
          // onBlur even occurs when an object loses focus
        />
        <Input
          className={classes.control}
          ref={passwordInputRef}
          id="password"
          label="password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit">
            {/* formIsValid starts at false, so !false is true, hence button is disabled */}
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
