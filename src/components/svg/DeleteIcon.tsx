import styles from "@/styles/svg.module.scss"

export default function DeleteIcon() {
    return (
        <div className={`${styles.svg__container} ${styles.delete}`}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 12V17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 7H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}