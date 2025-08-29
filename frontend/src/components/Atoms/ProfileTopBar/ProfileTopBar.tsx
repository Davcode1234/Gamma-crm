import styles from './ProfileTopBar.module.css';

function ProfileTopBar({ children }) {
  return <div className={styles.topBar}>{children}</div>;
}

export default ProfileTopBar;
