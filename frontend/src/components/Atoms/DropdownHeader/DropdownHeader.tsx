import styles from './DropdownHeader.module.css';

function DropdownHeader({ children }) {
  return <h3 className={styles.dropdownHeader}>{children}</h3>;
}

export default DropdownHeader;
