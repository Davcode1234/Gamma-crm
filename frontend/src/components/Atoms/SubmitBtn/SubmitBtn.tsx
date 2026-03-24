import styles from './SubmitBtn.module.css';

type BtnProps = {
  buttonContent: string;
  disabled: boolean;
  isSignInView: boolean;
};

function SubmitButton({
  buttonContent,
  disabled,
  isSignInView,
  ...restProps
}: BtnProps) {
  return isSignInView ? (
    <button
      {...restProps}
      className={styles.signInViewSubmitbtn}
      type="submit"
      disabled={disabled}
    >
      {buttonContent}
    </button>
  ) : (
    <button
      {...restProps}
      className={styles.submitbtn}
      type="submit"
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}

export default SubmitButton;
