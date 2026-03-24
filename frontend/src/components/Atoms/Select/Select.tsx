import styles from './Select.module.css';

function Select({ value, handleValueChange, optionData }) {
  return (
    <select
      id="month-select"
      value={value}
      onChange={handleValueChange}
      className={styles.selectInput}
    >
      {optionData.map((val) => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </select>
  );
}

export default Select;
