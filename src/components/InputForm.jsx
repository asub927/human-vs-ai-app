import React, { useState } from 'react';
import styles from './InputForm.module.css';

const InputForm = ({ onAddTask, onClear }) => {
    const [task, setTask] = useState('');
    const [humanTime, setHumanTime] = useState('');
    const [aiTime, setAiTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (task && humanTime && aiTime) {
            const hTime = parseInt(humanTime);
            const aTime = parseInt(aiTime);

            if (hTime < 0 || aTime < 0) {
                setError("Time values cannot be negative");
                return;
            }

            onAddTask({
                task,
                humanTime: hTime,
                aiTime: aTime,
            });
            setTask('');
            setHumanTime('');
            setAiTime('');
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Task Name"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className={styles.input}
                required
            />
            <input
                type="number"
                placeholder="Human Time (min)"
                value={humanTime}
                onChange={(e) => setHumanTime(e.target.value)}
                className={styles.input}
                min="0"
                required
            />
            <input
                type="number"
                placeholder="AI Time (min)"
                value={aiTime}
                onChange={(e) => setAiTime(e.target.value)}
                className={styles.input}
                min="0"
                required
            />
            <button type="submit" className={styles.button}>Add Task</button>
            <button
                type="button"
                className={`${styles.button} ${styles.clearButton}`}
                onClick={onClear}
            >
                Clear All
            </button>
            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
};

export default InputForm;
