import { Icon } from '@iconify/react';
import ViewContainer from '../../Atoms/ViewContainer/ViewContainer';
import styles from './NotAllowedPage.module.css';

function NotAllowedPage() {
  return (
    <ViewContainer>
      <div className={styles.container}>
        <Icon icon="line-md:account-alert-loop" width="40" height="40" />
        <p>Brak uprawnień</p>
      </div>
    </ViewContainer>
  );
}

export default NotAllowedPage;
