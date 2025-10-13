import { useEffect, useState } from 'react';
import { getPlackerTasks } from '../../../services/studio-tasks-service';
import styles from './PlackerView.module.css';

function PlackerView() {
  const [tasks, setTasks] = useState([]);
  const displayPlacker = async () => {
    const plackerTasks = await getPlackerTasks();
    setTasks(plackerTasks);
    console.log(plackerTasks);
  };

  useEffect(() => {
    displayPlacker();
  }, []);
  return (
    <div>
      <h1>Placker</h1>
      <div className={styles.columnWrapper}>
        {tasks.length > 0 &&
          tasks[0].pairs.map((col) => {
            return <p key={col.name}>{col.name}</p>;
          })}
      </div>
    </div>
  );
}

export default PlackerView;
