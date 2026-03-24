import styles from './DashboardContainerTitle.module.css';

function DashboardContainerTitle({ children }) {
  return <p className={styles.containerTitle}>{children}</p>;
}

export default DashboardContainerTitle;
