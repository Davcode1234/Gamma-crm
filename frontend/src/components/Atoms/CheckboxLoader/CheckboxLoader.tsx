import styles from './CheckboxLoader.module.css';

function CheckboxLoader() {
  return (
    <div className={styles.userLoaderWrapper}>
      <div className={styles.userLoader} />
    </div>
  );
}

export default CheckboxLoader;
