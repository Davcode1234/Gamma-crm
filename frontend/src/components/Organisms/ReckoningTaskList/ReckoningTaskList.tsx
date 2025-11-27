import { Icon } from '@iconify/react';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import ReckoningTile from '../ReckoningTile/ReckoningTile';
import styles from './ReckoningTaskList.module.css';

function ReckoningTaskList({
  tasks = [], // matchedTasksFromSearchInput
  isLoading, // taskLoadingState.isGetMyTasksLoading
  isAddingTask, // taskLoadingState.isAddEmptyLoading
  currentUserId,
  selectedMonthIndex,
  companies,
  onAddEmptyTask, // handleAddEmptyReckoTask
}) {
  if (isLoading) {
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

  if (tasks.length > 0) {
    return tasks
      .sort((a, b) => {
        // Extracted sorting logic
        const left = a.participants.filter(
          (part) => part._id === currentUserId
        );
        const right = b.participants.filter(
          (part) => part._id === currentUserId
        );

        const leftMonth =
          left[0]?.months.filter((obj) => {
            const monthIdx = new Date(obj.createdAt).getUTCMonth() + 1;
            return monthIdx === selectedMonthIndex;
          }) || [];

        const rightMonth =
          right[0]?.months.filter((obj) => {
            const monthIdx = new Date(obj.createdAt).getUTCMonth() + 1;
            return monthIdx === selectedMonthIndex;
          }) || [];

        const leftTime = leftMonth[0]?.addedToRecko
          ? new Date(leftMonth[0].addedToRecko).getTime()
          : 0;

        const rightTime = rightMonth[0]?.addedToRecko
          ? new Date(rightMonth[0].addedToRecko).getTime()
          : 0;

        return leftTime - rightTime;
      })
      .map((reckTask, index) => {
        return (
          <ReckoningTile
            key={reckTask._id}
            reckTask={reckTask}
            index={index}
            selectedMonthIndex={selectedMonthIndex}
            companies={companies}
            isAssignedToKanban={reckTask.idOfAssignedStudioTask !== undefined}
            currentUserId={currentUserId}
          />
        );
      });
  }
  return (
    <div className={styles.noTasksContainer}>
      <div>
        <p>Brak zleceń</p>
        <Icon icon="line-md:coffee-loop" width="24" height="24" />
      </div>

      <div>
        <button
          type="button"
          className={styles.addNewReckoTaskButton}
          onClick={onAddEmptyTask}
        >
          Dodaj pierwszy wiersz!
        </button>
        {isAddingTask && <CheckboxLoader />}
      </div>
    </div>
  );
}

export default ReckoningTaskList;
