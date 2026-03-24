import styles from './SkeletonUsersLoading.module.css';

function SkeletonUsersLoading() {
  return (
    <>
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
      <div className={styles.loadingUserTile} />
    </>
  );
}

export default SkeletonUsersLoading;
