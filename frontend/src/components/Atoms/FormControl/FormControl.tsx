import styles from './FormControl.module.css';

type FormControlProps = {
  children: JSX.Element | JSX.Element[];
};

function FormControl({ children }: FormControlProps) {
  return (
    <div data-testid="form-control" className={styles.formControl}>
      {children}
    </div>
  );
}

export default FormControl;
