import React, { useMemo } from 'react';
import { TaskData } from '../types';

interface ProductivityChartProps {
    data: TaskData[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ data }) => {
    // 1. Group data by project
    const projectData = useMemo(() => {
        const groups: { [key: string]: { task: string, gain: number }[] } = {};
        data.forEach(d => {
            if (!groups[d.projectName]) {
                groups[d.projectName] = [];
            }
            // Calculate Gain: (Human - AI) / Human * 100
            // Handle division by zero if Human time is 0 (unlikely but safe)
            const gain = d.humanTime > 0 ? ((d.humanTime - d.aiTime) / d.humanTime) * 100 : 0;
            groups[d.projectName].push({ task: d.task, gain });
        });
        return groups;
    }, [data]);

    const projects = Object.keys(projectData);

    // Colors for different projects
    const colors = [
        '#8b5cf6', // Violet
        '#f59e0b', // Amber
        '#3b82f6', // Blue
        '#10b981', // Emerald
        '#ef4444', // Red
        '#ec4899', // Pink
    ];

    // Chart Dimensions
    const width = 800;
    const height = 400;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Scales
    // X-axis: Task Index (0 to maxTasks - 1)
    const maxTasks = Math.max(...Object.values(projectData).map(arr => arr.length), 1);

    // Y-axis: Gain % (0 to 100, or max gain if > 100)
    const allGains = data.map(d => d.humanTime > 0 ? ((d.humanTime - d.aiTime) / d.humanTime) * 100 : 0);
    const maxGain = Math.max(100, ...allGains);
    const minGain = Math.min(0, ...allGains); // Handle negative gain if AI is slower

    const getX = (index: number) => padding + (index / (maxTasks > 1 ? maxTasks - 1 : 1)) * chartWidth;
    const getY = (gain: number) => height - padding - ((gain - minGain) / (maxGain - minGain)) * chartHeight;

    // Generate Paths
    const paths = projects.map((project, i) => {
        const points = projectData[project].map((d, idx) => ({
            x: getX(idx),
            y: getY(d.gain)
        }));

        if (points.length === 0) return '';

        // Smooth Curve (Catmull-Rom or simple Bezier)
        // For simplicity, let's use a basic smoothing
        if (points.length === 1) {
            return `M ${points[0].x} ${points[0].y} Z`; // Single point
        }

        let d = `M ${points[0].x} ${points[0].y}`;

        for (let j = 0; j < points.length - 1; j++) {
            const p0 = points[j === 0 ? 0 : j - 1];
            const p1 = points[j];
            const p2 = points[j + 1];
            const p3 = points[j + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        return d;
    });

    return (
        <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Productivity Gain by Project</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {projects.map((project, i) => (
                        <div key={project} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                            <div style={{ width: '12px', height: '4px', borderRadius: '2px', backgroundColor: colors[i % colors.length] }} />
                            <span style={{ color: '#94a3b8' }}>{project}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', paddingBottom: '50%' }}>
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                    {/* Grid Lines (Y-axis) */}
                    {[0, 25, 50, 75, 100].map(tick => {
                        const y = getY(tick);
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="#334155"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    fill="#64748b"
                                    fontSize="12"
                                >
                                    {tick}%
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis Labels (Task Indices) */}
                    {Array.from({ length: maxTasks }).map((_, i) => {
                        const x = getX(i);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - padding + 20}
                                textAnchor="middle"
                                fill="#64748b"
                                fontSize="12"
                            >
                                Task {i + 1}
                            </text>
                        );
                    })}

                    {/* Lines */}
                    {paths.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            stroke={colors[i % colors.length]}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}

                    {/* Dots */}
                    {projects.map((project, i) => (
                        projectData[project].map((d, idx) => (
                            <circle
                                key={`${i}-${idx}`}
                                cx={getX(idx)}
                                cy={getY(d.gain)}
                                r="4"
                                fill="#0f172a"
                                stroke={colors[i % colors.length]}
                                strokeWidth="2"
                            />
                        ))
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default ProductivityChart;
