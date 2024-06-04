import styles from "./InstructionBox.module.css";
import panda from "../../assets/pandatile.svg";

function InstructionBox ({content}) {
    return (
        <div className={styles["instruct-container"]}>
            <div className={styles["instruct-title-container"]}>
                <div className={styles["instruct-title-circle"]}>{content.number}</div>
                <div style={{textAlign:"right"}}>
                    <h2 style={{color:"#eeee"}}>{content.title}</h2>
                </div>
            </div>
            <ul>
                <li className={styles["instruct-subtext"]}>{content.pointA}</li>
                <li className={styles["instruct-subtext"]}>{content.pointB}</li>
            </ul>
            <img className={styles["instruct-panda"]} src={panda} alt="panda" />
        </div>
    );
}

export default InstructionBox;