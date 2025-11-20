import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>
                <span className={styles.ai}>Ai</span>
                <span className={styles.vs}>Productivity</span>
                <span className={styles.human}>Boost</span>
            </h1>
            <h2 className={styles.subtitle}>Compare task completion times with and without AI</h2>
        </header>
    );
};

export default Header;
