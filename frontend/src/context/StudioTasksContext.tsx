import { createContext, ReactNode, useReducer, useMemo } from 'react';
import { StudioTaskTypes } from '../services/studio-tasks-service';

type StudioTaskStateType = {
  studioTasks: StudioTaskTypes[];
};

type StudioTaskContextType = StudioTaskStateType & {
  dispatch: React.Dispatch<any>;
};

export const StudioTasksContext = createContext<
  StudioTaskContextType | undefined
>(undefined);

export const studioTasksReducer = (state: StudioTaskStateType, action: any) => {
  switch (action.type) {
    case 'SET_STUDIOTASKS':
      return { studioTasks: action.payload };
    case 'CREATE_STUDIOTASK':
      return { studioTasks: [...state.studioTasks, action.payload] };
    case 'DELETE_STUDIOTASK':
      return {
        studioTasks: state.studioTasks.filter(
          (studioTask) => studioTask._id !== action.payload._id
        ),
      };
    case 'UPDATE_STUDIOTASK':
      return {
        studioTasks: state.studioTasks.map((st) => {
          return st._id === action.payload._id ? action.payload : st;
        }),
      };

    case 'UPDATE_SUBTASK':
      return {
        studioTasks: state.studioTasks.map((st) => {
          if (st._id === action.payload._id) {
            return {
              ...st,
              subtasks: action.payload.subtasks,
            };
          }
          return st;
        }),
      };

    default:
      return state;
  }
};

export function StudioTasksContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(studioTasksReducer, {
    studioTasks: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <StudioTasksContext.Provider value={contextValue}>
      {children}
    </StudioTasksContext.Provider>
  );
}
