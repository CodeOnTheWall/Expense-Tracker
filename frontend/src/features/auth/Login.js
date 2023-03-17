// use useReducer when you update a state that depends on another state to avoid problems

import React, { useState, useEffect, useReducer, useRef } from "react";
// our hooks
// useState to manage our formIsValid state, which essentially wont allow us to login unless we are valid
// useEffect stops constant rendering for us and only renders intially and then after emailIsValid/passwordIsValid
// useReducer is better state management
// useRef to focus a particular field

// redux
import { useDispatch } from "react-redux";
// non api slice
import { setCredentials } from "./authSlice";
// api slice to talk to backend
import { useLoginMutation } from "./authApiSlice";

import Card from "../../components/UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/input";

const ACTIONS = {
  USERINPUT: "USERINPUT",
  INPUTBLUR: "INPUTBLUR",
};

// REDUCERS
// the 2 below reducers allow us to manage both the value and validity (isValid) into one state, managed by useReducer, whenever we receive user input action
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

const Login = ({ onSignUp }) => {
  // REFS to set focus
  const errRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // STATES
  const [formIsValid, setFormIsValid] = useState(false);
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
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useDispatch();

  // login here is essentially the mutation func from authApiSlice auth/login
  // isLoading is auto given from rtkq to indicate if req is still loading
  const [login, { isLoading }] = useLoginMutation();

  // these new consts (emailIsValid and passwordIsValid) imply that the state isValid:true, via object destructuring
  // so now our useEffect will only run the first render, but then after that only when we have valid inputs
  // this stops excess re rendering and use of our useEffect
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // USEEFFECT
  // focuses the input only when component loads (empty dependency [])
  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  // clear out error message when username or password changes
  // user may have read error, so when they go to continue typing, error should go away
  useEffect(() => {
    setErrMsg("");
  }, [emailState, passwordState]);

  // useEffect with dependencies i.e. [enteredEmail, enteredPassword] will work after inital render of the component
  // and it will always be re triggered/re executed on change of one of the listed dependencies
  // useEffect always runs after everything else inside the functional component runs
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

  // HANDLERS TO DISPATCH ACTIONS
  // passing dispatchEmail an action, which is always consumed/passed into first arg of useReducer (in this case emailReducer)
  // our type field describes what happened, and emailInputValue is the value the user entered
  // so now we will send type and emailInputValue as an action to be passed into emailReducer
  // this action is sent as an object
  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: ACTIONS.USERINPUT,
      emailInputValue: event.target.value,
    });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: ACTIONS.USERINPUT,
      passwordInputValue: event.target.value,
    });
  };
  // dont need to add a val here as all we care about is that input lost focus
  const validateEmailHandler = () => {
    dispatchEmail({ type: ACTIONS.INPUTBLUR });
  };
  const validatePasswordHandler = () => {
    dispatchPassword({ type: ACTIONS.INPUTBLUR });
  };
  const signUpHandler = () => {
    onSignUp();
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (formIsValid) {
      try {
        const { accessToken } = await login({
          emailState,
          passwordState,
        }).unwrap();
        dispatch(setCredentials({ accessToken }));
      } catch (err) {
        if (!err.status) {
          setErrMsg("No Server Response");
        } else if (err.status === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err.status === 401) {
          setErrMsg("Unauthorized");
        } else {
          setErrMsg(err.data?.message);
        }
        errRef.current.focus();
      }
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
      // if formIsValid is false, i want to focus the first input i find
    } else {
      passwordInputRef.current.focus();
    }
  };

  // if errMsg ? apply errmsg class, otherwise apply offscreen class
  // const errClass = errMsg ? "errmsg" : "offscreen";

  // isLoading 'state' from login func
  if (isLoading) return <p>Loading...</p>;

  const content = (
    <Card className={classes.login}>
      {/* aria-live monitors element for changes, and reads aloud as a screen reader,
        assertive will immediately announce updates */}
      <p ref={errRef} aria-live="assertive">
        {errMsg}
      </p>
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
          <Button onClick={signUpHandler}>
            {/* formIsValid starts at false, so !false is true, hence button is disabled */}
            Sign Up!
          </Button>
        </div>
      </form>
    </Card>
  );

  return content;
};

export default Login;
