import React from 'react';
import styles from './Header.module.css';

import { TaskData } from '../types';

interface HeaderProps {
    data: TaskData[];
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    const totalHumanTime = data.reduce((acc, curr) => acc + curr.humanTime, 0);
    const totalAiTime = data.reduce((acc, curr) => acc + curr.aiTime, 0);

    // Calculate efficiency (speedup)
    // Avoid division by zero
    const speedup = totalAiTime > 0 ? (totalHumanTime / totalAiTime).toFixed(1) : '0.0';

    const formatTime = (minutes: number): string => {
        if (minutes > 100) {
            return (minutes / 60).toFixed(1) + 'h';
        }
        return minutes + 'm';
    };

    return (
        <header className={styles.header}>
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>
                    <span className={styles.human}>Human</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.ai}>Human + AI</span>
                </h1>
                <h2 className={styles.subtitle}>Productivity Benchmark</h2>
            </div>

            <div className={styles.statsContainer}>
                {/* With AI Widget */}
                <div className={styles.widgetWrapper}>
                    <span className={styles.widgetLabel}>Human + AI</span>
                    <div className={`${styles.widget} ${styles.widgetAi}`}>
                        <div className={styles.widgetContent}>
                            <span className={styles.widgetValue}>{formatTime(totalAiTime)}</span>
                            {totalAiTime > 0 && (
                                <span className={styles.efficiencyBadge}>{speedup}x Faster</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Without AI Widget */}
                <div className={styles.widgetWrapper}>
                    <span className={styles.widgetLabel}>Human Only</span>
                    <div className={`${styles.widget} ${styles.widgetHuman}`}>
                        <div className={styles.widgetContent}>
                            <span className={styles.widgetValue}>{formatTime(totalHumanTime)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
