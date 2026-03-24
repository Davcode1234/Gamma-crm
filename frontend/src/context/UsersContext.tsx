import { createContext, useMemo, useReducer, ReactNode } from 'react';
import { User } from '../services/users-service';

type UsersStateType = {
  users: User[];
};

type UsersContextType = UsersStateType & {
  dispatch: React.Dispatch<any>;
};

export const UsersContext = createContext<UsersContextType | undefined>(
  undefined
);

export const usersReducer = (
  state: UsersStateType,
  action: any
): UsersStateType => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        users: action.payload,
      };

    case 'CREATE_USER':
      return {
        users: [action.payload, ...state.users],
      };

    case 'DELETE_USER':
      return {
        users: state.users.filter((w) => w._id !== action.payload._id),
      };

    default:
      return state;
  }
};

export function UsersContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(usersReducer, {
    users: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
}
