import styles from "../GeneratePDFPage/GeneratePDFPage.module.css";
import timesheetlogo from "../../assets/timesheet-cropped.svg";
import sadpanda from "../../assets/sadpanda.svg";
import TextField from '@mui/material/TextField';
import download from "downloadjs";
import { useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {  Link } from "react-router-dom";
import dayjs from "dayjs";
import LoadingPage from "../Loading/LoadingPage";
import CompletionPage from "../CompletionPage/CompletionPage";


function GeneratePDFPage () {
    const [uin, setUin] = useState("");
    const [key, setKey] = useState("");
    const [startdate, setStartdate]  = useState("");
    const [enddate, setEnddate] = useState("");
    const [classTA, setClassTA] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(true);

  async function handleSubmit () {
    try {
      setIsLoading(true);
      const request = {
        uin : uin,
        email : email,
        firstname : firstname,
        lastname : lastname,
        searchkey : key,
        startdate : startdate,
        enddate : enddate,
        classTA : classTA
      }
      const response = await fetch('http://localhost:8000/submitform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      try {
        const responsegen = await fetch("http://localhost:8000/generatepdf");
        if (!responsegen.ok) {
            console.log("error")
          }
        else {
          const formatend = dayjs(enddate).format("MMDDYYYY");
          const output = lastname + '_' + firstname + '_Timesheet_' + formatend + '.pdf';
          console.log(output);
          const blob = await responsegen.blob();
          download(blob, output);
          setIsDone(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error){
      console.log(error);
    } 
  }

  if (isLoading) {
    return (
      <LoadingPage/>
    )
  }

  else if (!isLoading && isDone) {
    return (
      <CompletionPage/>
    )
  }

  else {
    return (
        <div className={styles["generate-main"]}>
            <div>
              <Link to="/">
                <img className={styles["generate-logo"]} src={timesheetlogo} alt="Logo" />
              </Link>
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
                        <TextField required className={styles["generate-textfield"]} id="outlined-basic" label="UIN" variant="outlined"
                        onChange={(e)=>{
                          setUin(e.target.value);
                        }}/>
                    </div>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Search keyword * (eg. 'Office Hours')</h4>
                        <TextField required className={styles["generate-textfield"]} id="outlined-basic" label="Keyword" variant="outlined"
                        onChange={(e)=>{
                          setKey(e.target.value);
                        }}/>
                    </div>
                </div>
                <div className={styles["generate-inner-container"]}>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Timesheet Start Date *</h4>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker  className={styles["generate-textfield"]} label="Start Date" 
                                slotProps={{
                                  textField: {
                                    required: true,
                                  },
                                }}
                                onChange={(e)=>{
                                  setStartdate(e);
                                }}/>
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Timesheet End Date *</h4>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker required className={styles["generate-textfield"]} label="End Date"
                                slotProps={{
                                  textField: {
                                    required: true,
                                  },
                                }}
                                onChange={(e)=>{
                                  setEnddate(e);
                                }} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                </div>
                <div className={styles["generate-inner-container"]}>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Class of Instruction * (eg. 'CS141')</h4>
                        <TextField required className={styles["generate-textfield"]} id="outlined-basic" label="Class" variant="outlined" 
                        onChange={(e)=>{
                          setClassTA(e.target.value);
                        }}/>
                    </div>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>UIC Email *</h4>
                        <TextField required className={styles["generate-textfield"]} id="outlined-basic" label="UIC Email" variant="outlined"
                        onChange={(e)=>{
                          setEmail(e.target.value);
                        }}/>
                    </div>
                </div>
                <div className={styles["generate-inner-container"]}>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>First Name *</h4>
                        <TextField required className={styles["generate-textfield"]} id="outlined-basic" label="First Name" variant="outlined"
                        onChange={(e)=>{
                          setFirstname(e.target.value);
                        }}/>
                    </div>
                    <div className={styles["generate-text-container"]}>
                        <h4 className={styles["generate-form-text"]}>Last Name *</h4>
                        <TextField required className={styles["generate-textfield"]} id="outlined-basic" label="Last Name" variant="outlined"
                        onChange={(e)=>{
                          setLastname(e.target.value);
                        }}/>
                    </div>
                </div>
                <button type="button" className={styles["generate-button"]} onClick={handleSubmit}>Generate Timesheet</button>
            </div>

        </div>
    )
  }
};
  
export default GeneratePDFPage;