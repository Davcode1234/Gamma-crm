// import { useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './CompanyProfileViewComponent.module.css';
import CompanyProfileRow from '../CompanyProfileRow/CompanyProfileRow';

function CompanyProfileViewComponent({
  loadingState,
  currentTasks,
  currentMonthIndex,
  companyHourRate,
}) {
  if (loadingState.isError) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:close-small"
          width="70"
          height="70"
          className={styles.errorIcon}
        />
        <p>Coś poszło nie tak :(</p>
      </div>
    );
  }

  if (!loadingState.isError && loadingState.isLoading) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  if (
    !loadingState.isError &&
    !loadingState.isLoading &&
    currentTasks.length > 0
  ) {
    return currentTasks.map((task, index) => {
      return (
        <CompanyProfileRow
          key={task._id}
          task={task}
          index={index}
          currentMonthIndex={currentMonthIndex}
          companyHourRate={companyHourRate}
        />
      );
    });
  }

  return (
    <div className={styles.noTasksContainer}>
      <p>Brak zleceń</p>
      <Icon icon="line-md:coffee-loop" width="24" height="24" />
    </div>
  );
}

export default CompanyProfileViewComponent;
