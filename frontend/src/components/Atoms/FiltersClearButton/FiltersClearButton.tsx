import styles from './FiltersClearButton.module.css';

function FiltersClearButton({ handleClear }) {
  return (
    <button type="button" className={styles.clearButton} onClick={handleClear}>
      Wyczyść
    </button>
  );
}

export default FiltersClearButton;
