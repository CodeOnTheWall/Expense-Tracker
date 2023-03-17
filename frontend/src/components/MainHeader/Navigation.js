import Button from "../UI/Button/Button";
import classes from "./Navigation.module.css";

const Navigation = () => {
  return (
    <nav className={classes.nav}>
      <ul>
        <li>
          <Button>Logout</Button>
          {/* this is the native onClick event, and on a click, we will innoke onLogout */}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
