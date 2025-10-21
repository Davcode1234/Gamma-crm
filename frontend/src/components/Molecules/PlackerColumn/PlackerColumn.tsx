import PlackerCard from '../PlackerCard/PlackerCard';
import styles from './PlackerColumn.module.css';

function PlackerColumn({ tasks }) {
  return (
    <div className={styles.column}>
      {tasks.length > 0 &&
        tasks.map((task) => {
          return (
            <div key={task._id}>
              <PlackerCard task={task} />
            </div>
          );
        })}
    </div>
  );
}

export default PlackerColumn;
