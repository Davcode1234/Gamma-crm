import styles from './TileContainer.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function TileContainer({ children }: ChildrenProps) {
  return <div className={styles.tileContainer}>{children}</div>;
}

export default TileContainer;
