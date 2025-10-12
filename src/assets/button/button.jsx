import styles from ".button.module.css";

export function Button({children, onClick}){
    return(
        <button className={styles.butao} onClick={onClick}>
            {children}
        </button>
    )
}