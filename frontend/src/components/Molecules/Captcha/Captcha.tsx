import styles from './Captcha.module.css';

function Captcha({ handleDelete, closeFunction, id, isUserProfile }) {
  return (
    <div className={styles.captchaContainer}>
      <h2>Jesteś pewien?</h2>
      <div className={styles.captchaButtonsWrapper}>
        <button
          type="button"
          className={styles.confirmDeleteButton}
          onClick={() => handleDelete(id)}
        >
          Tak
        </button>{' '}
        <button
          type="button"
          className={styles.cancelDeleteButton}
          onClick={() =>
            isUserProfile ? closeFunction() : closeFunction(false)
          }
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default Captcha;
