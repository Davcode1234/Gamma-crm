import ReactDOM from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { pl } from 'date-fns/locale';
import styles from './TaskDateRangeEditor.module.css';
import useCalendar from '../../../../hooks/useCalendar';
import { StudioTaskTypes } from '../../../../services/studio-tasks-service';

type CalendarPosition = {
  top: number;
  left: number;
};

type CalendarEditOpenState = {
  isOpen: boolean;
  position: CalendarPosition | null;
};

export type TaskDateRangeEditorProps = {
  task: StudioTaskTypes;
  isCalendarEditOpen: CalendarEditOpenState;
  setIsCalendarEditOpen: React.Dispatch<
    React.SetStateAction<CalendarEditOpenState>
  >;
};

function TaskDateRangeEditor({
  task,
  isCalendarEditOpen,
  setIsCalendarEditOpen,
}: TaskDateRangeEditorProps) {
  const { handleCalendarSave, isRangeValid, saving, range, setRange } =
    useCalendar(task);
  const closeCalendar = () =>
    setIsCalendarEditOpen({ isOpen: false, position: null });
  if (!isCalendarEditOpen.isOpen) return null;
  return (
    isCalendarEditOpen.isOpen &&
    ReactDOM.createPortal(
      <>
        <div
          className={styles.overlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              closeCalendar();
            }
          }}
          onClick={() => {
            closeCalendar();
          }}
        />

        <div
          className={styles.editDateContainer}
          style={{
            position: 'absolute',
            top: isCalendarEditOpen.position?.top ?? 0,
            left: isCalendarEditOpen.position?.left ?? 0,
            zIndex: 1000,
          }}
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            // disabled={{ before: task.startDate }}
            min={1}
            max={180}
            locale={pl}
          />

          <div className={styles.buttonsWrapper}>
            <button
              type="button"
              className={`${styles.calendarBtn} ${styles.saveBtn}`}
              onClick={handleCalendarSave}
              disabled={!isRangeValid || saving}
            >
              {saving ? 'Zapisywanie…' : 'Zapisz'}
            </button>
            <button
              type="button"
              className={`${styles.calendarBtn} ${styles.abortBtn}`}
              onClick={() => {
                closeCalendar();

                setRange({
                  from: task.startDate ? new Date(task.startDate) : undefined,
                  to: task.deadline ? new Date(task.deadline) : undefined,
                });
              }}
            >
              Anuluj
            </button>
          </div>
        </div>
      </>,

      document.getElementById('calendar-root')
    )
  );
}

export default TaskDateRangeEditor;
