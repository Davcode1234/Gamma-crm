import { Icon } from '@iconify/react';
import styles from './ModalSectionTitle.module.css';

function ModalSectionTitle({ children, iconName }) {
  return (
    <div className={styles.titleContainer}>
      <Icon
        icon={`${iconName}`}
        width="24"
        height="24"
        style={{ color: '#030136' }}
      />
      {children}
    </div>
  );
}

export default ModalSectionTitle;
