import styles from "../GeneratePDFPage/GeneratePDFPage.module.css";
import timesheetlogo from "../../assets/timesheet-cropped.svg";
import sadpanda from "../../assets/sadpanda.svg";
import footerpanda from "../../assets/footer panda.svg";
import TextField from '@mui/material/TextField';


function GeneratePDFPage () {
    return (
        <div className={styles["generate-main"]}>
            <div>
                <img className={styles["generate-logo"]} src={timesheetlogo} alt="Logo" />
            </div>
            <div className={styles["generate-form-title"]}>
                <div className={styles["generate-circle"]}>01</div>
                <h2>Fill out the following details:</h2>
                <img className={styles["generate-panda"]} src={sadpanda} alt="sadpanda"></img>
            </div>

            <div className={styles["generate-form-container"]}>
                <div className={styles["generate-inner-container"]}>yo
                </div>
                <div className={styles["generate-inner-container"]}> yo
                </div>
                <div className={styles["generate-inner-container"]}>yo
                </div>
            </div>

            <div className={styles["generate-form-title"]}>
                <div className={styles["generate-circle"]}>02</div>
                <h2>Generate PDF:</h2>
                <button type="button" className={styles["generate-button"]}>GENERATE</button>
            </div>

            <div className={styles["generate-form-title"]}>
                <div className={styles["generate-circle"]}>03</div>
                <h2>Check your Downloads!</h2>
            </div>
            <div className={styles["generate-thankyou"]}>
                <h2>Thank you for using Timesheet Automate!</h2>
            </div>
            
            <div className={styles["generate-footer-container"]}>
                <div style={{display:"flex", alignItems:"center"}}>
                    <h3 className={styles["generate-footer"]}>Made with &lt;3</h3>
                    <img src={footerpanda} alt="footerpanda" />
                </div>
                <h4 className={styles["generate-footer"]}> Built by Nandana Sheri</h4>
            </div>

        </div>
    )
};
  
export default GeneratePDFPage;