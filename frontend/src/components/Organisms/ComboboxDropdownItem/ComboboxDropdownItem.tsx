import { useCombobox } from 'downshift';
import styles from './ComboboxDropdownItem.module.css';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import SearchInput from '../../Atoms/ControlBar/SearchInput/SearchInput';
import { StudioTaskTypes } from '../../../services/studio-tasks-service';
import HoursSummaryBadge from '../../Atoms/HoursSummaryBadge/HoursSummaryBadge';

function ComboboxDropdownItem({
  matchingTasks,
  viewVariable,
  loadingState,
  handleUnarchiveStudioTask,

  onSearchInputChange,
}) {
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    inputValue,
    setInputValue,
    closeMenu,
  } = useCombobox({
    items: matchingTasks,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      onSearchInputChange(newInputValue);
    },
    onSelectedItemChange: (item) => {
      if (item.selectedItem) {
        handleUnarchiveStudioTask(item.selectedItem);
        setInputValue('');
        closeMenu();
      }
    },
    itemToString: (item: StudioTaskTypes | null) => (item ? item.title : ''),
  });

  const totalHours = (studioTask) => {
    if (!studioTask) return 0;

    const matchingReckoTask = studioTask.reckoData?.[0];

    if (!matchingReckoTask?.participants) return 0;

    return matchingReckoTask.participants.reduce((summ, part) => {
      const monthsArray = part.months || [];
      return (
        summ +
        monthsArray.reduce((monthSumm, month) => {
          const hoursArray = month.hours || [];
          return (
            monthSumm +
            hoursArray.reduce(
              (daysSumm, day) => Number(daysSumm) + (Number(day.hourNum) || 0),
              0
            )
          );
        }, 0)
      );
    }, 0);
  };

  const renderHoursBatch = (item) => {
    const hoursNum = totalHours(item);

    return (
      <div className={styles.hoursSummaryWrapper}>
        <HoursSummaryBadge totalHours={hoursNum} isArchive />
      </div>
    );
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <div>{loadingState.isLoading && <CheckboxLoader />}</div>
        <SearchInput {...getInputProps()} />
        {!loadingState.isLoading && matchingTasks.length === 0 && inputValue ? (
          <p className={styles.noMatchBatch}>
            Brak wyników dla <span>{`${inputValue}`}</span>
          </p>
        ) : null}
      </div>

      <div
        {...getMenuProps()}
        className={
          isOpen && matchingTasks.length > 0 && viewVariable === 'Aktywne'
            ? styles.searchResultContainer
            : styles.hidden
        }
        aria-label="results"
      >
        {isOpen && viewVariable === 'Aktywne' && (
          <>
            <p className={styles.dropdownTitle}>Zarchwizowane:</p>
            {matchingTasks.map((item, index) => (
              <div key={item._id} className={styles.searchedCompanyItem}>
                {highlightedIndex === index ? (
                  <div
                    {...getItemProps({ item, index })}
                    className={styles.highlightedCompanyItem}
                  >
                    <div className={styles.clientInfoWrapper}>
                      <p
                        className={`${styles.clientBatch} ${[
                          `${item.client}`,
                        ]}`}
                      >
                        {item.client}
                      </p>
                      <p
                        className={`${styles.clientBatch} ${styles.clientPersonBatch}`}
                      >
                        {item.clientPerson}
                      </p>

                      <p className={styles.clientSearchID}>#{item.searchID}</p>
                      {/* <div className={styles.restoreButtonContainer}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnarchiveStudioTask(item);
                                  setInputValue('');
                                  closeMenu();
                                }}
                                className={styles.restoreButton}
                                type="button"
                              >
                                Przywróć
                              </button>
                            </div> */}
                    </div>
                    <span className={styles.searchTitle}>{item.title}</span>
                    <div className={styles.bottomContainer}>
                      <UsersDisplay
                        data={item}
                        usersArray={item.participants}
                        isSmall
                      />
                      {renderHoursBatch(item)}
                      <div className={styles.restoreButtonContainer}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnarchiveStudioTask(item);
                            setInputValue('');
                            closeMenu();
                          }}
                          className={styles.restoreButton}
                          type="button"
                        >
                          Przywróć
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    {...getItemProps({ item, index })}
                    className={styles.companyItem}
                  >
                    <div className={styles.clientInfoWrapper}>
                      <p
                        className={`${styles.clientBatch} ${[
                          `${item.client}`,
                        ]}`}
                      >
                        {item.client}
                      </p>
                      <p
                        className={`${styles.clientBatch} ${styles.clientPersonBatch}`}
                      >
                        {item.clientPerson}
                      </p>

                      <p className={styles.clientSearchID}>#{item.searchID}</p>
                    </div>
                    <span className={styles.searchTitle}>{item.title}</span>
                    <div className={styles.bottomContainer}>
                      <UsersDisplay
                        data={item}
                        usersArray={item.participants}
                        isSmall
                      />
                      {renderHoursBatch(item)}
                      <div className={styles.restoreButtonContainer}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnarchiveStudioTask(item);
                            setInputValue('');
                            closeMenu();
                          }}
                          className={styles.restoreButton}
                          type="button"
                        >
                          Przywróć
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ComboboxDropdownItem;
