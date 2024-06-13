import styles from "../Loading/LoadingPage.module.css";
import donepanda from "../../assets/donepanda.png";

function CompletionPage () {
    return (
        <div className={styles["loading-main"]}>
            <img className={styles["loading-done-panda"]} src={donepanda} alt="Panda Done" />
            <h1 className={styles["loading-title"]}>Check your Downloads!</h1>
        </div>
    )
}

export default CompletionPage;