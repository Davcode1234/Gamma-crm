import styles from './ClientTilesWrapper.module.css';

function ClientTilesWrapper({ children }) {
  return <div className={styles.clientTilesWrapper}>{children}</div>;
}

export default ClientTilesWrapper;
