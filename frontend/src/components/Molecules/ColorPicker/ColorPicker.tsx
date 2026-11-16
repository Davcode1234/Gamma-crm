import styles from './ColorPicker.module.css';

type Props = {
  value: string;
  onChange: (color: string) => void;
  previewText?: string;
};

function ColorPicker({ value, onChange, previewText = '' }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Kolor</span>
      <label
        className={styles.preview}
        style={{ backgroundColor: value }}
        title="Zmień kolor"
      >
        <p>{previewText}</p>
        <input
          type="color"
          className={styles.nativeInput}
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-label="Kolor"
        />
      </label>
    </div>
  );
}

export default ColorPicker;
