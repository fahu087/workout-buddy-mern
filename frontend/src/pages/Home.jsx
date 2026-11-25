import { useEffect, useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/workouts`);
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_WORKOUTS', payload: json });
          setFetchError(null);
        }
      } catch (err) {
        setFetchError('Unable to reach backend server. Ensure Express & MongoDB are running.');
      }
    };

    fetchWorkouts();
  }, [dispatch]);

  return (
    <div className="home">
      <div className="workouts">
        {fetchError && <div className="error">{fetchError}</div>}
        {workouts && workouts.length === 0 && (
          <p className="empty-msg">No workouts logged yet. Add one on the right!</p>
        )}
        {workouts &&
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;