import styles from './InfoBar.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function InfoBar({ children }: ChildrenProps) {
  return (
    <div className={styles.InfoBarContainer}>
      <div className={styles.infoBar}>{children}</div>
      <div className={styles.separator} />
    </div>
  );
}

export default InfoBar;
