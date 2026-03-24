import styles from './ViewContainer.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function ViewContainer({ children }: ChildrenProps) {
  return <div className={styles.viewContainer}>{children}</div>;
}

export default ViewContainer;
