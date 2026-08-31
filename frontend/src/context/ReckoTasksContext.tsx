import React, { createContext, ReactNode, useMemo, useReducer } from 'react';
import { ReckoningTaskTypes } from '../services/reckoning-view-service';

type ReckoTasksStateType = {
  reckoTasks: ReckoningTaskTypes[];
};

type ReckoTaskContextType = ReckoTasksStateType & {
  dispatch: React.Dispatch<any>;
};

export const ReckoTasksContext = createContext<
  ReckoTaskContextType | undefined
>(undefined);

export const reckoTasksReducer = (state: ReckoTasksStateType, action: any) => {
  switch (action.type) {
    case 'SET_RECKOTASKS':
      return { reckoTasks: action.payload };
    case 'CREATE_RECKOTASK':
      return { reckoTasks: [...state.reckoTasks, action.payload] };
    case 'DELETE_RECKOTASK':
      return {
        reckoTasks: state.reckoTasks.filter((reckTask) => {
          return reckTask._id !== action.payload._id;
        }),
      };
    case 'UPDATE_RECKOTASK':
      return {
        reckoTasks: state.reckoTasks.map((rt) => {
          return rt._id === action.payload._id ? action.payload : rt;
        }),
      };
    case 'UPDATE_HOUR_NUM': {
      const {
        taskId,
        userId,
        dayId,
        newValue,
        selectedMonthIndex,
        selectedYear,
      } = action.payload;

      return {
        reckoTasks: state.reckoTasks.map((task) => {
          if (task._id !== taskId) return task;

          const updatedParticipants = task.participants.map((participant) => {
            if (participant._id !== userId) return participant;

            const monthToUpdate = participant.months?.find((m) => {
              const date = new Date(m.createdAt);

              return (
                date.getUTCMonth() + 1 === selectedMonthIndex &&
                date.getUTCFullYear() === Number(selectedYear)
              );
            });

            if (!monthToUpdate || !Array.isArray(monthToUpdate.hours)) {
              return participant;
            }

            const updatedHours = monthToUpdate.hours.map((hour) =>
              hour._id === dayId ? { ...hour, hourNum: Number(newValue) } : hour
            );

            const updatedMonths = participant.months.map((month) => {
              const date = new Date(month.createdAt);

              const isMatch =
                date.getUTCMonth() + 1 === selectedMonthIndex &&
                date.getUTCFullYear() === Number(selectedYear);

              return isMatch ? { ...month, hours: updatedHours } : month;
            });

            return { ...participant, months: updatedMonths };
          });

          return { ...task, participants: updatedParticipants };
        }),
      };
    }
    case 'CLEAR_HOURS': {
      const { taskId, userId, selectedMonthIndex, selectedYear } =
        action.payload;

      return {
        reckoTasks: state.reckoTasks.map((task) => {
          if (task._id !== taskId) return task;

          const updatedParticipants = task.participants.map((participant) => {
            if (participant._id !== userId) return participant;

            const updatedMonths =
              participant.months?.map((m) => {
                const date = new Date(m.createdAt);

                const isMatch =
                  date.getUTCMonth() + 1 === selectedMonthIndex &&
                  date.getUTCFullYear() === Number(selectedYear);

                if (!isMatch) return m;

                if (!Array.isArray(m.hours)) return m;

                return {
                  ...m,
                  hours: m.hours.map((h) =>
                    h.hourNum > 0 ? { ...h, hourNum: 0 } : h
                  ),
                };
              }) ?? participant.months;

            return { ...participant, months: updatedMonths };
          });

          return { ...task, participants: updatedParticipants };
        }),
      };
    }

    default:
      return state;
  }
};

export function ReckoTasksContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reckoTasksReducer, {
    reckoTasks: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <ReckoTasksContext.Provider value={contextValue}>
      {children}
    </ReckoTasksContext.Provider>
  );
}
