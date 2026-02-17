import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  getStudioTask,
  StudioTaskTypes,
  UpdateStudioTask,
} from '../services/studio-tasks-service';
import useStudioTasksContext from './Context/useStudioTasksContext';

const useCalendar = (task: StudioTaskTypes) => {
  const [isCalendarEditOpen, setIsCalendarEditOpen] = useState({
    isOpen: false,
    position: null,
  });
  const [saving, setSaving] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>({
    from: task.startDate ? new Date(task.startDate) : undefined,
    to: task.deadline ? new Date(task.deadline) : undefined,
  });
  const { dispatch } = useStudioTasksContext();

  const isRangeValid = !!(range?.from && range?.to);

  const handleCalendarSave = async () => {
    if (!isRangeValid || saving) return;
    setSaving(true);
    try {
      const updated = await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          startDate: range.from,
          deadline: range.to,
        },
      });

      const res = await getStudioTask(updated._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      setIsCalendarEditOpen({ isOpen: false, position: null });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return {
    isCalendarEditOpen,
    setIsCalendarEditOpen,
    handleCalendarSave,
    isRangeValid,
    saving,
    range,
    setRange,
  };
};

export default useCalendar;
