import styles from './Label.module.css';

type LabelProps = {
  htmlFor: string;
  labelContent: string | JSX.Element | JSX.Element[];
};

function Label({ htmlFor, labelContent }: LabelProps) {
  return (
    <label data-testid="label" htmlFor={htmlFor} className={styles.label}>
      {labelContent}
    </label>
  );
}

export default Label;
