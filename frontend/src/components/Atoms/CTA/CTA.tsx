import styles from './CTA.module.css';

function CTA({ children, ...restProps }) {
  return (
    <button type="button" className={styles.button} {...restProps}>
      {children}
    </button>
  );
}

export default CTA;
