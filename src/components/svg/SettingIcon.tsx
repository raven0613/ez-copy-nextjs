import styles from "@/styles/svg.module.scss"

export default function SettingIcon() {
    return (
        <div className={styles.svg__container}>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16L14 12L10 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}