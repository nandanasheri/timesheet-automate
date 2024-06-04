import styles from "../GeneratePDFPage/GeneratePDFPage.module.css";
import timesheetlogo from "../../assets/timesheet-cropped.svg";
import sadpanda from "../../assets/sadpanda.svg";

function GeneratePDFPage () {
    return (
        <div className={styles["generate-main"]}>
            <div>
                <img className={styles["generate-logo"]} src={timesheetlogo} alt="Logo" />
            </div>
            <div className={styles["generate-form-title"]}>
                <div className={styles["generate-circle"]}>01</div>
                <h2>Fill out the following details:</h2>
                <img className={styles["generate-panda"]} src={sadpanda}></img>
            </div>
        </div>
    )
};
  
export default GeneratePDFPage;