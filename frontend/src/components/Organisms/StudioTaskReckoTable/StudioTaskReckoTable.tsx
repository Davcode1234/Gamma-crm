import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import styles from './StudioTaskReckoTable.module.css';
import { months } from '../../../hooks/useCurrentDate';
import summarizeHours from '../../../utils/SummarizeHours';

function StudioTaskReckoTable({ assignedReckoTask, isReckoTaskLoading }) {
  console.log(assignedReckoTask);
  if (isReckoTaskLoading) {
    return (
      <div className={styles.checkboxLoaderContainer}>
        <CheckboxLoader />
      </div>
    );
  }

  if (assignedReckoTask.length === 0) {
    return <p className={styles.noRecordsTitle}>Brak pozycji w rozliczeniu</p>;
  }

  return (
    <div className={styles.reckoTable}>
      {assignedReckoTask.participants.map((art) =>
        art.isVisible ? (
          <div className={styles.reckoTableRow} key={art._id}>
            <Link
              className={styles.reckoUserCell}
              to={`/użytkownicy/${art._id}`}
            >
              <img className={styles.heroImg} src={`${art.img}`} alt="" />
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
                    month.hours.reduce((daysSumm, day) => {
                      return Number(daysSumm) + Number(day.hourNum);
                    }, 0)
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
                  // const yearIndex = new Date(m.createdAt).getUTCFullYear();
                  return (
                    <div key={m._id} className={styles.reckoMonthCell}>
                      <p>
                        {/* {yearIndex.toString().slice(2, 4)} */}
                        {months[monthIndex].slice(0, 3)}
                      </p>
                      <p>{summarizeHours(m.hours)}h</p>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

export default StudioTaskReckoTable;
