import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styles from './BackButton.module.css';

function BackButton({ path }) {
  return (
    <Link to={`/${path}`} className={styles.backButton}>
      <Icon
        icon="ion:arrow-back-outline"
        color="#f68c1e"
        width="35"
        height="35"
      />
    </Link>
  );
}

export default BackButton;
