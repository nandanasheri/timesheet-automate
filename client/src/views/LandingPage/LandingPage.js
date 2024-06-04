import styles from "./LandingPage.module.css";
import timesheetlogo from "../../assets/timesheet-cropped.svg";
import samplepdf from "../../assets/form-sample.svg";
import pandapdf from "../../assets/panda-on-pdf.svg";
import arrow from "../../assets/arrow.svg";
import InstructionBox from "../../components/InstructionBox/InstructionBox";

function LandingPage() {
    const workscontent = [
        {
            number : "01",
            title : "Log in to your Google Account", 
            pointA : "Add your Work Hours to your Google Calendar",
            pointB : "Log in to your Google Account to grant access to your Calendar"

        },
        {
            number : "02",
            title : "Fill out your Info", 
            pointA : "Add your Information like Name, UIN and the timesheet period.",
            pointB : "Add a keyword to search your calendar against like 'TA' or 'CS141'"

        },
        {
            number : "03",
            title : "Generate PDF!", 
            pointA : "On click, timesheet automate pulls your work hours from your Google Calendar and fills out your timesheet",
            pointB : "Check your downloads for pdf!"

        }

    ]
    return (
        <div className={styles["landing-main"]}>
            <div className={styles["landing-header"]}>
                <img src={timesheetlogo} alt="Logo" />
            </div>
            <div className={styles["landing-title-container"]}>
                <div className={styles["landing-title-item"]}>
                    <h1 className={styles["landing-title"]}>Auto fill your time sheets on the click of a button</h1>
                    <h4 className={styles["landing-title-subtext"]}>With Timesheet Automate, you can generate a filled timesheet solely by having your work hours on Google Calendar</h4>
                    <div>
                        <button type="button" className={styles["landing-login-button"]}>LOG IN</button>
                    </div>
                </div>

                <div>
                    <img className={styles["landing-arrow"]} src={arrow} alt="Panda on PDF" />
                </div>

                <div className={styles["landing-title-right"]}>
                    <img className={styles["landing-panda"]} src={pandapdf} alt="Panda on PDF" />
                    <div className={styles["landing-title-pdf-container"]}>
                        <img className={styles["landing-title-pdf-form"]} src={samplepdf} alt="Sample PDF" />
                    </div>
                </div>
            </div>
            <div className={styles["landing-works-container"]}>
                <h2 className={styles["landing-works-title"]}>How it works</h2>
                <div className={styles["landing-works-tile-container"]}>
                    <InstructionBox content={workscontent[0]}/>
                    <InstructionBox content={workscontent[1]}/>
                    <InstructionBox content={workscontent[2]}/>
                </div>
            </div>
        </div>
    );
}

export default LandingPage