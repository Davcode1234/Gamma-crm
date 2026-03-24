import styles from './SaveButton.module.css';

function SaveButton({ children, callbackFunc }) {
  return (
    <button type="button" onClick={callbackFunc} className={styles.editButton}>
      {children}
    </button>
  );
}

export default SaveButton;
