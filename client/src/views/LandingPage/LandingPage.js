import styles from "./LandingPage.module.css";
import timesheetlogo from "../../assets/timesheet-cropped.svg";
import samplepdf from "../../assets/form-sample.svg";
import pandapdf from "../../assets/panda-on-pdf.svg";

function LandingPage() {
    return (
        <div>
            <div className={styles["landing-header"]}>
                <img src={timesheetlogo} alt="Logo" />
            </div>
            <div className={styles["landing-title-container"]}>
                <div className={styles["landing-title-item"]}>
                    <h1 className={styles["landing-title"]}>Auto fill your time sheets on the click of a button</h1>
                    <h4 className={styles["landing-title-subtext"]}>With Timesheet Automate, you can generate a filled timesheet solely by having your work hours on Google Calendar</h4>
                </div>
                <div className={styles["landing-title-right"]}>
                    <img src={pandapdf} alt="Panda on PDF" />
                    <div className={styles["landing-title-pdf-container"]}>
                        <img src={samplepdf} alt="Sample PDF" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage