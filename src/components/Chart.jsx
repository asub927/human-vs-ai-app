import React from 'react';
import styles from './Chart.module.css';

const Chart = ({ data }) => {
    const maxTime = Math.max(...data.map(d => Math.max(d.humanTime, d.aiTime)), 1);

    // Calculate positions for the first task (for the legend)
    // We use the first task's data to position the legends
    const firstTask = data.length > 0 ? data[0] : { aiTime: 0, humanTime: 0 };
    const aiPercent = (firstTask.aiTime / maxTime) * 100;
    const humanPercent = (firstTask.humanTime / maxTime) * 100;

    // Legend Collision Detection
    // If the dots are close, the legends (which are wide) might overlap.
    // We need to shift them apart but keep the arrows pointing to the dots.
    const percentDiff = Math.abs(aiPercent - humanPercent);
    const isLegendOverlapping = percentDiff < 40; // Threshold for legend overlap

    let aiLegendShift = 0;
    let humanLegendShift = 0;

    if (isLegendOverlapping) {
        // Shift away from each other
        if (aiPercent < humanPercent) {
            aiLegendShift = -15; // Shift AI left
            humanLegendShift = 15; // Shift Human right
        } else {
            aiLegendShift = 15; // Shift AI right
            humanLegendShift = -15; // Shift Human left
        }
    }

    return (
        <div className={styles.chartContainer}>
            {data.length > 0 && (
                <div className={styles.legendContainer}>
                    {/* AI Legend */}
                    <div
                        className={styles.legendItem}
                        style={{
                            left: `${aiPercent}%`,
                            zIndex: aiPercent < humanPercent ? 2 : 1
                        }}
                    >
                        <div
                            className={styles.legendBoxAi}
                            style={{ transform: `translateX(${aiLegendShift}%)` }}
                        >
                            With Generative AI
                        </div>
                        <div className={styles.legendArrowAi}></div>
                    </div>

                    {/* Human Legend */}
                    <div
                        className={styles.legendItem}
                        style={{
                            left: `${humanPercent}%`,
                            zIndex: aiPercent > humanPercent ? 2 : 1
                        }}
                    >
                        <div
                            className={styles.legendBoxHuman}
                            style={{ transform: `translateX(${humanLegendShift}%)` }}
                        >
                            Without Generative AI
                        </div>
                        <div className={styles.legendArrowHuman}></div>
                    </div>
                </div>
            )}

            <div className={styles.chart}>
                {data.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No tasks yet.</p>
                        <p>Enter a task above to see the Human vs AI time comparison.</p>
                    </div>
                ) : (
                    data.map((item, index) => {
                        const humanPercent = (item.humanTime / maxTime) * 100;
                        const aiPercent = (item.aiTime / maxTime) * 100;

                        // Check for overlap
                        // If values are close (e.g. within 10% of maxTime), labels might overlap
                        const isOverlapping = Math.abs(humanPercent - aiPercent) < 12;

                        // Determine label positions
                        // Smaller value gets label on the LEFT
                        // Larger value gets label on the RIGHT
                        let aiLabelClass = styles.labelRight;
                        let humanLabelClass = styles.labelLeft;

                        if (aiPercent < humanPercent) {
                            aiLabelClass = styles.labelLeft;
                            humanLabelClass = styles.labelRight;
                        } else if (aiPercent > humanPercent) {
                            aiLabelClass = styles.labelRight;
                            humanLabelClass = styles.labelLeft;
                        } else {
                            // Equal values - default to AI left, Human right
                            aiLabelClass = styles.labelLeft;
                            humanLabelClass = styles.labelRight;
                        }

                        return (
                            <div key={index} className={styles.row}>
                                <div className={styles.label}>{item.task}</div>
                                <div className={styles.barContainer}>
                                    {/* Connecting Line */}
                                    <div
                                        className={styles.connectingLine}
                                        style={{
                                            left: `${Math.min(humanPercent, aiPercent)}%`,
                                            width: `${Math.abs(humanPercent - aiPercent)}%`
                                        }}
                                    ></div>

                                    {/* AI Dot */}
                                    <div
                                        className={styles.aiDot}
                                        style={{ left: `${aiPercent}%` }}
                                    >
                                        <span
                                            className={`${styles.timeLabelAi} ${aiLabelClass} ${isOverlapping ? styles.labelOffsetUp : ''}`}
                                        >
                                            {item.aiTime} min
                                        </span>
                                    </div>

                                    {/* Human Dot */}
                                    <div
                                        className={styles.humanDot}
                                        style={{ left: `${humanPercent}%` }}
                                    >
                                        <span
                                            className={`${styles.timeLabelHuman} ${humanLabelClass} ${isOverlapping ? styles.labelOffsetDown : ''}`}
                                        >
                                            {item.humanTime} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Chart;
