import { Icon } from '@iconify/react';
import styles from './AddNewClientTopBar.module.css';

function AddNewClientTopBar({ callbackFn }) {
  return (
    <div className={styles.newClientTopBar}>
      <Icon
        icon="ion:arrow-back-outline"
        color="#f68c1e"
        width="26"
        height="26"
        className={styles.backButton}
        onClick={callbackFn}
      />
      <p className={styles.clientSecTitle}>Nowy klient</p>
    </div>
  );
}

export default AddNewClientTopBar;
