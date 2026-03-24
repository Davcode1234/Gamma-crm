import styles from './Loader.module.css';

function Loader() {
  return (
    <div data-testid="loader" className={styles.wrapper}>
      <div className={styles.loader} />
    </div>
  );
}

export default Loader;
