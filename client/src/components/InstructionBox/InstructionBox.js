import styles from "./InstructionBox.module.css";

function InstructionBox () {
    return (
        <div className={styles["instruct-container"]}>
            <div className={styles["instruct-title-container"]}>
                <div className={styles["instruct-title-circle"]}>01</div>
                <h2>heading</h2>
            </div>
            <h2>subtext</h2>
        </div>
    );
}

export default InstructionBox;