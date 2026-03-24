import styles from '../pages/StudioTaskView/StudioTaskView.module.css';

function DateFormatter({ dateString }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
  };

  return <div className={styles.date}>{formatDate(dateString)}</div>;
}

export default DateFormatter;
