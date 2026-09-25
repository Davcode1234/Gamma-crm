import { Icon } from '@iconify/react';
import styles from './HoursSummaryBadge.module.css';

type HoursSummaryBadgeProps = {
  totalHours: number;
  isArchive: boolean;
};

function HoursSummaryBadge({ totalHours, isArchive }: HoursSummaryBadgeProps) {
  return isArchive ? (
    <div className={styles.archiveTaskHoursSumContainer}>
      <Icon icon="ic:baseline-access-time" width="12" height="12" />
      <p>{totalHours}h</p>
      <p> łącznie</p>
    </div>
  ) : (
    <div className={styles.taskHoursSumContainer}>
      <Icon icon="ic:baseline-access-time" width="16" height="16" />
      <p>{totalHours}h</p>
      <p> łącznie</p>
    </div>
  );
}

export default HoursSummaryBadge;
