import { statusNames } from '../../../statuses';
import styles from './PlackerCard.module.css';

function PlackerCard({ task }) {
  return (
    <div className={styles.card}>
      <p>{task.title}</p>
      <p className={styles.statusName}>{statusNames[task.status]}</p>
    </div>
  );
}

export default PlackerCard;
