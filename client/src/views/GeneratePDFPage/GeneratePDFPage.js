import styles from "../GeneratePDFPage/GeneratePDFPage.module.css";
import timesheetlogo from "../../assets/timesheet-cropped.svg";
import sadpanda from "../../assets/sadpanda.svg";
import footerpanda from "../../assets/footer panda.svg";
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


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
                <div className={styles["generate-inner-container"]}>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>UIN *</h4>
                        <TextField  className={styles["generate-textfield"]} id="outlined-basic" label="UIN" variant="outlined"/>
                    </div>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Search keyword * (eg. 'Office Hours')</h4>
                        <TextField className={styles["generate-textfield"]} id="outlined-basic" label="Keyword" variant="outlined"/>
                    </div>
                </div>
                <div className={styles["generate-inner-container"]}>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Timesheet Start Date *</h4>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker className={styles["generate-textfield"]} label="Start Date" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Timesheet End Date *</h4>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker className={styles["generate-textfield"]} label="End Date" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                </div>
                <div className={styles["generate-inner-container"]}>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Class of Instruction * (eg. 'CS141')</h4>
                        <TextField className={styles["generate-textfield"]} id="outlined-basic" label="Class" variant="outlined" />
                    </div>
                </div>
                <button type="button" className={styles["generate-button"]}>Generate Timesheet</button>
            </div>

            <div className={styles["generate-form-title"]}>
                <div className={styles["generate-circle"]}>02</div>
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