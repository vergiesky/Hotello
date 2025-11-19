import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [dark, setDark] = useState(false);

    const toggleDark = () => {
        setDark(!dark);
        document.documentElement.classList.toggle("darkmode");
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.logoArea}>
                <div className={styles.square}></div>
                <span className={styles.logo}>Hotello</span>
            </div>

            <nav className={styles.navLinks}>
                <a>Explore</a>
                <a>Stays</a>
                <a>Attractions</a>
                <a>Experiences</a>
                <button className={styles.listBtn}>List your place</button>
            </nav>

            <button className={styles.darkBtn} onClick={toggleDark}>
                {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
        </header>
    );
}
