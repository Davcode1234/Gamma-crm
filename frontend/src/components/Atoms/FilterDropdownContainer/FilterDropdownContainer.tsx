import styles from './FilterDropdownContainer.module.css';

function FilterDropdownContainer({ children }) {
  return <div className={styles.filterDropdownContainer}>{children}</div>;
}

export default FilterDropdownContainer;
