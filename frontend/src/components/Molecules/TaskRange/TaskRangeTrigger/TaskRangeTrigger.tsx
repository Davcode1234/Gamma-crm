import DateFormatter from '../../../../utils/dateFormatter';
import styles from './TaskRangeTrigger.module.css';
import { TaskDateRangeEditorProps } from '../TaskDateRangeEditor/TaskDateRangeEditor';

type TaskDateRangeTriggerProps = Omit<
  TaskDateRangeEditorProps,
  'isCalendarEditOpen'
>;

function TaskRangeTrigger({
  task,
  setIsCalendarEditOpen,
}: TaskDateRangeTriggerProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

          setIsCalendarEditOpen((prev) => {
            return {
              position: {
                top: rect.bottom + 5 + window.scrollY,
                left: rect.left + window.scrollX,
              },
              isOpen: !prev.isOpen,
            };
          });
        }
      }}
      className={styles.cardNumberWrapper}
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        setIsCalendarEditOpen((prev) => {
          return {
            position: {
              top: rect.bottom + 5 + window.scrollY,
              left: rect.left + window.scrollX,
            },
            isOpen: !prev.isOpen,
          };
        });
      }}
    >
      <p className={styles.sectionTitle}>Data</p>
      <div
        className={`${styles.modalDatesWrapper} ${
          new Date(task.deadline) <= new Date()
            ? styles.datePast
            : styles.dateCurrent
        }`}
      >
        {task.deadline && task.startDate ? (
          <>
            <DateFormatter dateString={task.startDate} />
            <span>&nbsp;-&nbsp;</span>
            <DateFormatter dateString={task.deadline} />
          </>
        ) : (
          <p className={styles.noDates}>Brak dat</p>
        )}
      </div>
    </div>
  );
}

export default TaskRangeTrigger;
