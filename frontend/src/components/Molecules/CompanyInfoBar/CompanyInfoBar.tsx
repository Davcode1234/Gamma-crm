import styles from './CompanyInfoBar.module.css';

function CompanyInfoBar({ handleSortChange, sortColumn, sortOrder }) {
  return (
    <div className={styles.companyInfoBar}>
      <div className={styles.reckoningTaskListElement}>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
        >
          <p>ID</p>
        </div>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
        >
          <p>Firma </p>
        </div>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
          role="button"
          tabIndex={0}
          onClick={() => handleSortChange('clientPerson')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSortChange('clientPerson');
            }
          }}
        >
          <p>
            Klient{' '}
            {sortColumn === 'clientPerson' && (sortOrder === 'asc' ? '↑' : '↓')}
          </p>
        </div>
        {/* <div
            className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
            role="button"
            tabIndex={0}
            onClick={() => handleSortChange('createdAt')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleSortChange('createdAt');
              }
            }}
          >
            <p>
              Utworzono{' '}
              {sortColumn === 'createdAt' &&
                (sortOrder === 'asc' ? '↑' : '↓')}
            </p>
          </div> */}
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
        >
          <p>
            Graficy{' '}
            {sortColumn === 'client' && (sortOrder === 'asc' ? '↑' : '↓')}
          </p>
        </div>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
          role="button"
          tabIndex={0}
          onClick={() => handleSortChange('title')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSortChange('title');
            }
          }}
        >
          <p>
            Tytuł {sortColumn === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
          </p>
        </div>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
          role="button"
          tabIndex={0}
          onClick={() => handleSortChange('comment')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSortChange('comment');
            }
          }}
        >
          <p>
            Komentarz{' '}
            {sortColumn === 'comment' && (sortOrder === 'asc' ? '↑' : '↓')}
          </p>
        </div>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
          role="button"
          tabIndex={0}
          onClick={() => handleSortChange('participants')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSortChange('participants');
            }
          }}
        >
          <p>
            Sum{' '}
            {sortColumn === 'participants' && (sortOrder === 'asc' ? '↑' : '↓')}
          </p>
        </div>

        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
        >
          <p>Przychód</p>
        </div>
        <div
          className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
          role="button"
          tabIndex={0}
          onClick={() => handleSortChange('printWhere')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSortChange('printWhere');
            }
          }}
        >
          <p>
            DRUK(gdzie){' '}
            {sortColumn === 'printWhere' && (sortOrder === 'asc' ? '↑' : '↓')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfoBar;
