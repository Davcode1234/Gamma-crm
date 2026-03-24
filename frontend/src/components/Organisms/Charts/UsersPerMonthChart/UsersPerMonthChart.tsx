import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './UsersPerMonthChart.module.css';

function UsersPerMonthChart({ usersMonthSummary, isLoading, isYearly }) {
  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  if (usersMonthSummary.length > 0 && !isLoading && !isYearly) {
    return (
      <div className={styles.rowsContainer}>
        {usersMonthSummary.map((user) => {
          return (
            <div className={styles.usersMonthSummaryRow} key={user._id}>
              <Link
                to={`/użytkownicy/${user._id}`}
                className={styles.userWrapper}
              >
                <img src={user.img} className={styles.userImg} alt="" />
                <p className={styles.userName}>{user.name}</p>
              </Link>

              <div className={styles.daysRow}>
                <div className={styles.sumTile}>{user.totalHours}</div>
                {user.days &&
                  user.days.map((day) => {
                    return (
                      <div
                        key={day.day}
                        className={`${
                          day.isWeekend ? styles.weekendDay : styles.dayTile
                        }`}
                      >
                        {day.totalHours}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (usersMonthSummary.length > 0 && !isLoading && isYearly) {
    return (
      <div className={styles.rowsContainer}>
        {usersMonthSummary.map((user) => {
          return (
            <div className={styles.usersMonthSummaryRow} key={user._id}>
              <div className={styles.userWrapper}>
                <img src={user.img} className={styles.userImg} alt="" />
                <p className={styles.userName}>{user.name}</p>
              </div>

              <div className={styles.daysRow}>
                <div className={styles.yearSumTile}>
                  {user.months &&
                    user.months.reduce((summ, months) => {
                      return Number(summ) + Number(months.totalHours);
                    }, 0)}
                </div>
                {user.months &&
                  user.months.map((month) => {
                    return (
                      <div
                        key={month.month}
                        className={`${styles.yearDayTile}`}
                      >
                        {month.totalHours}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.loaderWrapper}>
      <p>Brak zleceń</p>
      <Icon icon="line-md:coffee-loop" width="24" height="24" />
    </div>
  );
}

export default UsersPerMonthChart;
