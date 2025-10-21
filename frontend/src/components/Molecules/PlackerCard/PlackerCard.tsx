import styles from './PlackerCard.module.css';

function PlackerCard({ task }) {
  return (
    <div className={styles.card}>
      <p>{task.title}</p>
    </div>
  );
}

export default PlackerCard;
