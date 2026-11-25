import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { title, load, reps };

    try {
      const response = await fetch(`${API_BASE}/api/workouts`, {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error || 'Could not add workout');
        setEmptyFields(json.emptyFields || []);
      } else {
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        dispatch({ type: 'CREATE_WORKOUT', payload: json });
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit} noValidate>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        placeholder="e.g., Chest, Hamstrings"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg&apos;s):</label>
      <input
        type="number"
        placeholder="e.g., 40"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Reps:</label>
      <input
        type="number"
        placeholder="e.g., 12"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button type="submit">Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;