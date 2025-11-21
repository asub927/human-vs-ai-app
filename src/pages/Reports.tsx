import React from 'react';
import { useProjects } from '../context/ProjectContext';
import ProductivityChart from '../components/ProductivityChart';

const Reports: React.FC = () => {
    const { chartData } = useProjects();

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>Reports</h1>

            {chartData.length === 0 ? (
                <div style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    color: '#64748b',
                    border: '1px solid #e2e8f0'
                }}>
                    <p>No data available yet. Add tasks on the Dashboard or via Chat to see reports.</p>
                </div>
            ) : (
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <ProductivityChart data={chartData} />

                    <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '8px' }}>Total Tasks</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{chartData.length}</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '8px' }}>Avg. Productivity Gain</h3>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                                {Math.round(chartData.reduce((acc, curr) => {
                                    const gain = curr.humanTime > 0 ? ((curr.humanTime - curr.aiTime) / curr.humanTime) * 100 : 0;
                                    return acc + gain;
                                }, 0) / (chartData.length || 1))}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
