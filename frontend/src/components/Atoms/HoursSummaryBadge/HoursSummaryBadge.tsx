import { Icon } from '@iconify/react';
import styles from './HoursSummaryBadge.module.css';

type HoursSummaryBadgeProps = {
  totalHours: number;
};

function HoursSummaryBadge({ totalHours }: HoursSummaryBadgeProps) {
  return (
    <div className={styles.taskHoursSumContainer}>
      <Icon icon="ic:baseline-access-time" width="16" height="16" />
      <p>{totalHours}h</p>
      <p>łącznie</p>
    </div>
  );
}

export default HoursSummaryBadge;
