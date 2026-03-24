import styles from './FormContainer.module.css';

type FormContainerProps = {
  children: string | JSX.Element | JSX.Element[];
};

function FormContainer({ children }: FormContainerProps) {
  return (
    <div data-testid="wrapper" className={styles.formContainer}>
      {children}
    </div>
  );
}

export default FormContainer;
