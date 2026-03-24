import { Icon } from '@iconify/react';
import styles from './ReckoningInfoBar.module.css';

function ReckoningInfoBar({ selectedMonthDaysArray }) {
  return (
    <div className={styles.commonGrid}>
      <p className={`${styles.infoBarElement} `}>&nbsp;</p>
      <p className={`${styles.infoBarElement} `}>Firma</p>
      <p className={`${styles.infoBarElement} `}>Klient</p>
      <p className={`${styles.infoBarElement} `}>Tytuł</p>

      <div className={styles.daysWrapper}>
        <div className={styles.summHoursInfoEl}>
          <Icon
            icon="tabler:circle-plus-2"
            width="24"
            height="24"
            // style="color: #030136"
          />
        </div>
        {selectedMonthDaysArray.map((dayTile, index) => {
          return (
            <p className={styles.dayInfoPar} key={index}>
              {index + 1}
            </p>
          );
        })}
      </div>
      <p className={`${styles.infoBarElement} `}>Komentarz</p>
      <p className={`${styles.infoBarElement} `}>Druk(co)</p>
      <p className={`${styles.infoBarElement} ${styles.printPar}`}>
        Druk(gdzie)
      </p>
    </div>
  );
}

export default ReckoningInfoBar;
