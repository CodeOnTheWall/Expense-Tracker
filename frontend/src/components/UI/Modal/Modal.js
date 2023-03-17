import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import Card from "../Card/Card";
import Button from "../Button/Button";

import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onCloseModal} />;
};

const ModalOverlay = (props) => {
  // from Parent UserInputForm.js
  // onCloseModal={errorHandler}
  // title={error.title}
  // message={error.message}
  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onCloseModal}>Okay</Button>
      </footer>
    </Card>
  );
};

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onCloseModal={props.onCloseModal} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          onCloseModal={props.onCloseModal}
          title={props.title}
          message={props.message}
        />,
        document.getElementById("overlay-root")
      )}
    </Fragment>
  );
};
export default Modal;
// portal is from react DOM library, not react library
// createPortal takes 2 arguments, 1st is react node that should be rendered
// and 2nd is a pointer to that container in the real DOM where this container should be rendered in
// document.getElementById is a browser API
// now this overlay is no longer nested in other JSX code, and we 'portalled' this HTML code to another place

// added in public/index.html, we do this so that things like modals get put on top of everything
// since its possible that the overlay could be deeply nested
// <div id="backdrop-root"></div>
// <div id="overlay-root"></div>
