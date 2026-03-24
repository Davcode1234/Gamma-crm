import { createContext, useMemo, useReducer } from 'react';

export const TasksContext = createContext([]);

const TasksReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        tasks: action.payload,
      };

    // case 'ADD_TASK':
    //   return {
    //     tasks: [...state.tasks, action.payload],
    //   };

    // case 'DELETE_TASK':
    //   return {
    //     tasks: state.tasks.filter((t) => {
    //       return t._id !== action.payload._id;
    //     }),
    //   };
    default:
      return state;
  }
};

function TasksContextProvder({ children }) {
  const [state, dispatch] = useReducer(TasksReducer, {
    tasks: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  );
}

export default TasksContextProvder;
