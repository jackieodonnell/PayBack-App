import classes from "./Spinner.module.css";
import dolladude from "../../assets/images/dolladude.png";

const Spinner: React.FC = () => {
  return (
    <article className={classes.article}>
      <img src={dolladude} className={classes.spinner} />
      {/* <div className={classes.spinner}></div> */}
    </article>
  );
};

export default Spinner;
