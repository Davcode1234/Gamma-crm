import { Icon } from '@iconify/react';
import styles from './NoClientsTitle.module.css';

function NoClientsTitle() {
  return (
    <div className={styles.noClientsWrapper}>
      <Icon icon="line-md:person-add" width="24" height="24" />
      <p className={styles.noClientsTitle}>Brak klientów</p>
    </div>
  );
}

export default NoClientsTitle;
