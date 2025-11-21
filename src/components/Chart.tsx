import React, { useState } from 'react';
import { ChartProps } from '../types';
import styles from './Chart.module.css';

const Chart: React.FC<ChartProps> = ({ data, onDeleteTask }) => {
    const [hoveredDot, setHoveredDot] = useState<string | null>(null);
    const maxTime = Math.max(...data.map(d => Math.max(d.humanTime, d.aiTime)), 1);

    // Calculate legend positions based on the first task's values
    const firstTaskAiTime = data.length > 0 ? data[0].aiTime : 0;
    const firstTaskHumanTime = data.length > 0 ? data[0].humanTime : 0;

    const aiDotPercent = (firstTaskAiTime / maxTime) * 100;
    const humanDotPercent = (firstTaskHumanTime / maxTime) * 100;

    const aiLegendPosition = aiDotPercent;
    const humanLegendPosition = humanDotPercent;

    // Legend Collision Detection (simplified)
    const percentDiff = Math.abs(aiLegendPosition - humanLegendPosition);
    const isLegendOverlapping = percentDiff < 30;

    let aiLegendShift = 0;
    let humanLegendShift = 0;

    if (isLegendOverlapping) {
        if (aiLegendPosition < humanLegendPosition) {
            aiLegendShift = -40;
            humanLegendShift = 40;
        } else {
            aiLegendShift = 40;
            humanLegendShift = -40;
        }
    }

    return (
        <div className={styles.chartContainer}>
            {data.length > 0 && (
                <>
                    <div className={styles.legendContainer}>
                        {/* AI Legend */}
                        <div
                            className={styles.legendItem}
                            style={{
                                left: `${aiLegendPosition}%`,
                                zIndex: aiLegendPosition < humanLegendPosition ? 2 : 1
                            }}
                        >
                            <div
                                className={styles.legendBoxAi}
                                style={{ transform: `translateX(${aiLegendShift}%)` }}
                            >
                                Human + AI
                            </div>
                            <div className={styles.legendArrowAi}></div>
                        </div>

                        {/* Human Legend */}
                        <div
                            className={styles.legendItem}
                            style={{
                                left: `${humanLegendPosition}%`,
                                zIndex: aiLegendPosition > humanLegendPosition ? 2 : 1
                            }}
                        >
                            <div
                                className={styles.legendBoxHuman}
                                style={{ transform: `translateX(${humanLegendShift}%)` }}
                            >
                                Human Only
                            </div>
                            <div className={styles.legendArrowHuman}></div>
                        </div>
                    </div>
                </>
            )}

            <div className={styles.chart}>
                {data.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No tasks yet.</p>
                        <p>Enter a task above to see the productivity boost with AI.</p>
                    </div>
                ) : (
                    data.map((item, index) => {
                        const humanPercent = (item.humanTime / maxTime) * 100;
                        const aiPercent = (item.aiTime / maxTime) * 100;

                        const aiDotId = `ai-${index}`;
                        const humanDotId = `human-${index}`;

                        return (
                            <div key={index} className={styles.row}>
                                <div className={styles.labelContainer}>
                                    <div className={styles.deleteColumn}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => onDeleteTask(index)}
                                            aria-label={`Delete ${item.task}`}
                                            title="Delete task"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className={styles.projectLabel}>{item.projectName}</div>
                                    <div className={styles.taskLabel}>{item.task}</div>
                                </div>
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
                                        style={{ left: `${aiPercent}%`, cursor: 'pointer' }}
                                        onMouseEnter={() => setHoveredDot(aiDotId)}
                                        onMouseLeave={() => setHoveredDot(null)}
                                    >
                                        {hoveredDot === aiDotId && (
                                            <span className={styles.timeLabelAi}>
                                                {item.aiTime} min
                                            </span>
                                        )}
                                    </div>

                                    {/* Human Dot */}
                                    <div
                                        className={styles.humanDot}
                                        style={{ left: `${humanPercent}%`, cursor: 'pointer' }}
                                        onMouseEnter={() => setHoveredDot(humanDotId)}
                                        onMouseLeave={() => setHoveredDot(null)}
                                    >
                                        {hoveredDot === humanDotId && (
                                            <span className={styles.timeLabelHuman}>
                                                {item.humanTime} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {data.length > 0 && (
                <div className={styles.timeNote}>
                    All times are in minutes
                </div>
            )}
        </div >
    );
};

export default Chart;
