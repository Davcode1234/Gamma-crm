import { Icon } from '@iconify/react';
import { Droppable } from '@hello-pangea/dnd';
import styles from './DroppableColumn.module.css';
import DraggableCard from '../DraggableCard/DraggableCard';
import { statusNames } from '../../../statuses';

const test = {
  do_wzięcia: styles.dwz,
  na_później: styles.np,
  do_zrobienia: styles.dzr,
  w_trakcie: styles.wtr,
  wysłane: styles.wys,
};
function DroppableColumn({
  status,
  tasks,
  unfilteredStudioTasks,
  isDragAllowed,
  isLoading,
}) {
  const isAlert = unfilteredStudioTasks > 25 && status !== 'wysłane';
  return (
    <div className={`${styles.columnWrapper} `}>
      <div className={styles.columnTitleWrapper}>
        <div className={`${styles.bullet} ${test[status]}`} />
        <p className={styles.statusName}>{statusNames[status]}</p>
        <div
          className={`${styles.tasksNumeberPill} ${
            isAlert && styles.alertColor
          }`}
        >
          <p>
            <span>{unfilteredStudioTasks}</span>
            {status !== 'wysłane' && <span>/25</span>}
          </p>
        </div>
        {isAlert ? (
          <Icon
            icon="line-md:alert-circle-loop"
            width="22"
            height="22"
            className={styles.alertIcon}
          />
        ) : null}
      </div>
      <Droppable droppableId={status}>
        {(droppableProvided, snapshot) => {
          return (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className={`${
                snapshot.isDraggingOver
                  ? styles.draggedColumn
                  : styles.columnContainer
              } ${
                tasks.some((task) => task.status === status)
                  ? styles.noBorder
                  : null
              }
              ${isAlert && styles.alertColor}
              `}
            >
              {!isLoading ? (
                tasks.length > 0 &&
                tasks.map((task, index) => {
                  let doneSubtasks = 0;

                  task.subtasks.forEach((subtask) => {
                    if (subtask.done) {
                      doneSubtasks += 1;
                    }
                  });

                  return (
                    <DraggableCard
                      key={task._id}
                      task={task}
                      index={index}
                      doneSubtasks={doneSubtasks}
                      isDragAllowed={isDragAllowed}
                    />
                  );
                })
              ) : (
                <>
                  <div className={styles.skeletonWrapper}>
                    <div className={styles.taskSkeleton} />
                  </div>
                  <div className={styles.skeletonWrapper}>
                    <div className={styles.taskSkeleton} />
                  </div>
                  <div className={styles.skeletonWrapper}>
                    <div className={styles.taskSkeleton} />
                  </div>
                </>
              )}

              {droppableProvided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default DroppableColumn;
