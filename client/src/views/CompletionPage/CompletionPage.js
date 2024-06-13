import styles from "../Loading/LoadingPage.module.css";
import donepanda from "../../assets/donepanda.png";
import footerpanda from "../../assets/footer panda.svg";
import githublogo from "../../assets/github-mark.svg";
import timesheetlogo from "../../assets/timesheet-cropped.svg"
import React from "react";
import {  Link } from "react-router-dom";

function CompletionPage () {
    return (
        <div>
            <div className={styles["completion-logo-container"]}>
              <Link to="/">
                <img className={styles["generate-logo"]} src={timesheetlogo} alt="Logo" />
              </Link>
            </div>

            <div  className={styles["completion-main"]}>
                <img className={styles["loading-done-panda"]} src={donepanda} alt="Panda Done" />
                <h1 className={styles["loading-title"]}>Check your Downloads!</h1>
                    
                <div className={styles["generate-footer-container"]}>
                    <div style={{display:"flex", alignItems:"center"}}>
                        <h3 className={styles["generate-footer"]}>Made with &lt;3</h3>
                        <img src={footerpanda} alt="footerpanda" />
                    </div>
                    <div className={styles["landing-footer-container"]}>
                        <h4 className={styles["landing-footer"]}> Built by Nandana Sheri</h4>
                        <a href="https://github.com/nandanasheri/timesheet-automate">
                            <img className={styles["github-logo"]} src={githublogo} alt="GitHubLogo"/>
                        </a>
                    </div>  
                </div>
            </div>
        </div>
    )
}

export default CompletionPage;