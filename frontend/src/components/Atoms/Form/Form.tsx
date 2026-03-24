import styles from './Form.module.css';

type FormProps = {
  children: string | JSX.Element | JSX.Element[];
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isSignInView: boolean;
};

function Form({ children, onSubmit, isSignInView }: FormProps) {
  return isSignInView ? (
    <form data-testid="form" className={styles.signInForm} onSubmit={onSubmit}>
      {children}
    </form>
  ) : (
    <form data-testid="form" className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export default Form;
