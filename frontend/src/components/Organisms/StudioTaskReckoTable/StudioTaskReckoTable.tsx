import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './StudioTaskReckoTable.module.css';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import summarizeHours from '../../../utils/SummarizeHours';
import { months } from '../../../hooks/useCurrentDate';

function StudioTaskReckoTable({ assignedReckoTask, isLoading }) {
  const totalHours = useMemo(() => {
    if (!assignedReckoTask?.length) return 0;
    return assignedReckoTask[0].participants.reduce((summ, part) => {
      return (
        summ +
        part.months.reduce((monthSumm, month) => {
          return (
            monthSumm +
            month.hours.reduce((daysSumm, day) => {
              return Number(daysSumm) + Number(day.hourNum);
            }, 0)
          );
        }, 0)
      );
    }, 0);
  }, [assignedReckoTask]);

  if (isLoading) {
    return (
      <div className={styles.checkboxLoaderContainer}>
        <CheckboxLoader />
      </div>
    );
  }

  if (!assignedReckoTask || assignedReckoTask.length === 0) {
    return <p className={styles.noRecordsTitle}>Brak pozycji w rozliczeniu</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.totalHoursHeader}>
        <Icon icon="ic:baseline-access-time" width="16" height="16" />
        <p>
          <strong>{totalHours}h</strong> łącznie
        </p>
      </div>

      <div className={styles.reckoTable}>
        {assignedReckoTask[0].participants.map((art) =>
          art.isVisible ? (
            <div className={styles.reckoTableRow} key={art._id}>
              <Link
                className={styles.reckoUserCell}
                to={`/użytkownicy/${art._id}`}
              >
                <img
                  className={styles.heroImg}
                  src={`${art.img}`}
                  alt={art.name}
                />
                <p className={styles.reckoSectionPartName}>{art.name}:</p>
              </Link>

              <div className={styles.tileSummWrapper}>
                <Icon
                  icon="line-md:calendar"
                  width="17"
                  height="17"
                  className={styles.summTileIcon}
                />
                <p className={styles.tileSummValue}>
                  {art.months.reduce((summ, month) => {
                    return (
                      summ +
                      month.hours.reduce(
                        (daysSumm, day) =>
                          Number(daysSumm) + Number(day.hourNum),
                        0
                      )
                    );
                  }, 0)}
                  h
                </p>
              </div>

              <div className={styles.reckoMonthCells}>
                {art.months
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((m) => {
                    const monthIndex = new Date(m.createdAt).getUTCMonth();
                    return (
                      <div key={m._id} className={styles.reckoMonthCell}>
                        <p>{months[monthIndex].slice(0, 3)}</p>
                        <p>{summarizeHours(m.hours)}h</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default StudioTaskReckoTable;
