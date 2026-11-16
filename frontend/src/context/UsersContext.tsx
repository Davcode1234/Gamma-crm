import {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';
import { getAllUsers, User } from '../services/users-service';
import useAuth from '../hooks/useAuth';

type UsersStateType = {
  users: User[];
};

type UsersContextType = UsersStateType & {
  dispatch: React.Dispatch<any>;
  /** Stored color per user id, from the live users list. */
  colorById: Record<string, string>;
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

  const { user: loggedUser } = useAuth();

  // Load users once after login, so components showing embedded user
  // copies (task participants, company team members) can look up the
  // current color by id.
  useEffect(() => {
    if (!loggedUser) return;
    getAllUsers()
      .then((allUsers) => {
        if (allUsers) dispatch({ type: 'SET_USERS', payload: allUsers });
      })
      .catch(() => {});
  }, [loggedUser]);

  const colorById = useMemo(
    () =>
      Object.fromEntries(
        (state.users ?? [])
          .filter((u) => u.color)
          .map((u) => [String(u._id), u.color as string])
      ),
    [state.users]
  );

  const contextValue = useMemo(
    () => ({ ...state, dispatch, colorById }),
    [state, dispatch, colorById]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
}
