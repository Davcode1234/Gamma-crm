import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './TileWrapper.module.css';

type TileWrapperProps = {
  children: ReactNode | ReactNode[];
  linkPath?: string;
  index: number;
};

const tileClass = (tileIndex) => {
  return tileIndex % 2 === 0
    ? styles.reckoningTaskListElement
    : styles.darkerReckoningTaskListElement;
};

function TileWrapper({ children, linkPath, index }: TileWrapperProps) {
  return linkPath ? (
    <Link className={`${styles.tileWrapper} ${tileClass(index)}`} to={linkPath}>
      {children}
    </Link>
  ) : (
    <div className={`${styles.tileWrapper} ${tileClass(index)}`}>
      {children}
    </div>
  );
}
TileWrapper.defaultProps = {
  linkPath: undefined,
};

export default TileWrapper;
