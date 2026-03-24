import styles from './ListContainer.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function ListContainer({ children }: ChildrenProps) {
  return <div className={styles.listContainer}>{children}</div>;
}

export default ListContainer;
