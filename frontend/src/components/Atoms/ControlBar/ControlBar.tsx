import styles from './ControlBar.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function ControlBar({ children }: ChildrenProps) {
  return (
    <div className={styles.controlBarContainer}>
      <div className={styles.controlBar}>{children}</div>
    </div>
  );
}

export default ControlBar;
