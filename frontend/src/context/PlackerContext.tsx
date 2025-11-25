import { createContext, ReactNode, useReducer, useMemo } from 'react';

export const PlackerTasksContext = createContext(undefined);

export const plackerTasksReducer = (state, action: any) => {
  switch (action.type) {
    case 'SET_PLACKERTASKS':
      return { plackerTasks: action.payload };

    default:
      return state;
  }
};

export function PlackerTasksContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(plackerTasksReducer, {
    plackerTasks: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <PlackerTasksContext.Provider value={contextValue}>
      {children}
    </PlackerTasksContext.Provider>
  );
}
