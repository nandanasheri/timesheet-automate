import styles from "../Loading/LoadingPage.module.css";
import pandagif from "../../assets/loadingpanda.gif";

function LoadingPage () {
    return (
        <div className={styles["loading-main"]}>
            <img className={styles["loading-panda"]} src={pandagif} alt="Panda Gif" />
            <h1 className={styles["loading-title"]}>Generating Timesheet...</h1>
        </div>
    )
}

export default LoadingPage;