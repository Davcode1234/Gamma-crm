import styles from './ChartContainer.module.css';

function ChartContainer({ children }) {
  return <div className={styles.chartContainer}>{children}</div>;
}

export default ChartContainer;
