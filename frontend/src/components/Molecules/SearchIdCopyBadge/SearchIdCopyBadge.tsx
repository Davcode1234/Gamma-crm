import { Icon } from '@iconify/react';
import styles from './SearchIdCopyBadge.module.css';

function SearchIdCopyBadge({
  searchIDCopied,
  setSearchIDCopied,
  handleCopy,
  id,
}) {
  return (
    <div className={styles.searchIDContainer}>
      <p className={styles.sectionTitle}>Numer</p>
      {searchIDCopied ? (
        <div className={styles.copiedInfo}>
          <span>Skopiowano</span>
          <Icon icon="line-md:folder-check" width="20" height="20" />
        </div>
      ) : (
        <p
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              handleCopy(id, setSearchIDCopied);
            }
          }}
          onClick={() => handleCopy(id, setSearchIDCopied)}
          className={styles.cardNumber}
        >
          #{id}
        </p>
      )}
    </div>
  );
}

export default SearchIdCopyBadge;
