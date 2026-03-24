import styles from './DeleteButton.module.css';

function DeleteButton({ children, callbackFunc }) {
  return (
    <button
      type="button"
      onClick={callbackFunc}
      className={styles.deleteCompanyButton}
    >
      {children}
    </button>
  );
}

export default DeleteButton;
