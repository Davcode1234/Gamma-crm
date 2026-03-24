import { Icon } from '@iconify/react';
import styles from './ClientTile.module.css';

function ClientTile({ children, deleteCallback, ...restProps }) {
  return (
    <div className={styles.clientTile} {...restProps}>
      <p>{children}</p>
      <Icon
        icon="line-md:trash"
        width="24"
        height="24"
        onClick={(e) => {
          e.stopPropagation(); // stop bubbling
          e.preventDefault();
          deleteCallback();
        }}
      />
    </div>
  );
}

export default ClientTile;
